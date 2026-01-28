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
        self.height = 1

class BST:
    def __init__(self):
        self.root = None

    def get_height(self, node):
     if not node:
        return 0
     return node.height

    def get_balance(self, node):
     if not node:
        return 0
     return self.get_height(node.left) - self.get_height(node.right)

    def right_rotate(self, y):
     x = y.left
     T2 = x.right

     x.right = y
     y.left = T2

     y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
     x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))

     return x

    def left_rotate(self, x):
     y = x.right
     T2 = y.left

     y.left = x
     x.right = T2

     x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
     y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))

     return y
    def avl_insert(self, node, value):
     if node and value == node.data:
        return node

     if not node:
        return Node(value)

     if value < node.data:
        node.left = self.avl_insert(node.left, value)
     else:
        node.right = self.avl_insert(node.right, value)

     node.height = 1 + max(self.get_height(node.left),
                          self.get_height(node.right))

     balance = self.get_balance(node)

     if balance > 1 and value < node.left.data:
        return self.right_rotate(node)

     if balance < -1 and value > node.right.data:
        return self.left_rotate(node)

     if balance > 1 and value > node.left.data:
        node.left = self.left_rotate(node.left)
        return self.right_rotate(node)

     if balance < -1 and value < node.right.data:
        node.right = self.right_rotate(node.right)
        return self.left_rotate(node)

     return node

    def insert(self, value):
     newNode = Node(value)

     if not self.root:
        self.root = newNode
        return True

     current = self.root
     while True:
        if value == current.data:
            return False  # duplicate

        if value < current.data:
            if not current.left:
                current.left = newNode
                return True
            current = current.left
        else:
            if not current.right:
                current.right = newNode
                return True
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
    success = bst.insert(value)

    if not success:
        return jsonify({
            "message": f"Value {value} already exists!",
            "tree": serialize_tree(bst.root)
        })

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

@app.route("/avl_insert", methods=["POST"])
def avl_insert_value():
    value = request.json.get("value")
    bst.root = bst.avl_insert(bst.root, value)
    return jsonify({
        "message": f"Inserted {value} (AVL)",
        "tree": serialize_tree(bst.root)
    })

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
