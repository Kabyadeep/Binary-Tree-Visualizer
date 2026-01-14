from flask import Flask, request, jsonify

# ---------------- BST CODE ---------------- #

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if self.root is None:
            self.root = Node(value)
            return

        current = self.root
        while True:
            if value < current.data:
                if current.left is None:
                    current.left = Node(value)
                    return
                current = current.left
            else:
                if current.right is None:
                    current.right = Node(value)
                    return
                current = current.right

# create ONE global tree
bst = BST()

# ---------------- FLASK CODE ---------------- #

app = Flask(__name__)

@app.route("/")
def home():
    return "BST Flask App Running"

@app.route("/insert", methods=["POST"])
def insert_value():
    data = request.get_json()
    value = data.get("value")

    bst.insert(value)

    return jsonify({
        "message": f"Value {value} inserted into BST"
    })

if __name__ == "__main__":
    app.run(debug=True)
