from platform import node
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if not self.root:
            self.root = Node(value)
            return
        current = self.root
        while True:
            if value < current.data:
                if not current.left:
                    current.left = Node(value)
                    return
                current = current.left
            else:
                if not current.right:
                    current.right = Node(value)
                    return
                current = current.right
    
    def delete(self, node, value):
    if not node:
        return node

    if value < node.data:
        node.left = self.delete(node.left, value)
    elif value > node.data:
        node.right = self.delete(node.right, value)
    else:
        # Case 1 & 2
        if not node.left:
            return node.right
        elif not node.right:
            return node.left

        # Case 3: two children
        temp = self.find_min(node.right)
        node.data = temp.data
        node.right = self.delete(node.right, temp.data)

    return node

    def find_min(self, node):
    current = node
    while current.left:
        current = current.left
    return current

    def inorder(self, node, result):
        if node:
            self.inorder(node.left, result)
            result.append(node.data)
            self.inorder(node.right, result)

    def preorder(self, node, result):
        if node:
            result.append(node.data)
            self.preorder(node.left, result)
            self.preorder(node.right, result)

    def postorder(self, node, result):
        if node:
            self.postorder(node.left, result)
            self.postorder(node.right, result)
            result.append(node.data)

bst=BST()            

@app.route("/insert", methods=["POST"])
def insert_value():
    value = request.json.get("value")
    bst.insert(value)
    return jsonify({
        "message": f"Inserted {value}",
        "tree": serialize_tree(bst.root)
    })
def serialize_tree(node):
    if not node:
        return None
    return {
        "value": node.data,
        "left": serialize_tree(node.left),
        "right": serialize_tree(node.right)
    }

@app.route("/delete", methods=["POST"])
def delete_value():
    value = request.json.get("value")
    bst.root = bst.delete(bst.root, value)
    return jsonify({
        "message": f"Deleted {value}",
        "tree": serialize_tree(bst.root)
    })

@app.route("/inorder")
def inorder():
    result = []
    bst.inorder(bst.root, result)
    return jsonify(result)

@app.route("/preorder")
def preorder():
    result = []
    bst.preorder(bst.root, result)
    return jsonify(result)

@app.route("/postorder")
def postorder():
    result = []
    bst.postorder(bst.root, result)
    return jsonify(result)

@app.route("/search", methods=["POST"])
def search():
    value = request.json["value"]
    path = []
    current = bst.root

    while current:
        path.append(current.data)
        if value == current.data:
            return jsonify({"path": path, "found": True})
        current = current.left if value < current.data else current.right

    return jsonify({"path": path, "found": False})


if __name__ == "__main__":
    app.run(debug=True)
