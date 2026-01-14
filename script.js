
//   BST DATA STRUCTURE

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);

        if (!this.root) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        while (true) {
            if (value < current.data) {
                if (!current.left) {
                    current.left = newNode;
                    return;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }

    inorder(node, result = []) {
        if (!node) return result;
        this.inorder(node.left, result);
        result.push(node.data);
        this.inorder(node.right, result);
        return result;
    }

    preorder(node, result = []) {
        if (!node) return result;
        result.push(node.data);
        this.preorder(node.left, result);
        this.preorder(node.right, result);
        return result;
    }

    postorder(node, result = []) {
        if (!node) return result;
        this.postorder(node.left, result);
        this.postorder(node.right, result);
        result.push(node.data);
        return result;
    }
}

//   SEARCH LOGIC

function searchPath(root, value) {
    const path = [];
    let current = root;

    while (current) {
        path.push(current.data);
        if (value === current.data) break;
        current = value < current.data ? current.left : current.right;
    }

    return path;
}


//   TREE DRAWING


function drawTree(root) {
    const container = document.querySelector(".tree-container");
    const svg = document.getElementById("tree-lines");

    container.innerHTML = "";
    container.appendChild(svg);
    svg.innerHTML = "";

    if (!root) return;

    const width = container.offsetWidth;
    const startX = width / 2;

    function drawNode(node, x, y, gap) {
        if (!node) return;

        const nodeDiv = document.createElement("div");
        nodeDiv.className = "node";
        nodeDiv.textContent = node.data;
        nodeDiv.style.left = `${x}px`;
        nodeDiv.style.top = `${y}px`;
        container.appendChild(nodeDiv);

        if (node.left) {
            drawLine(x + 22, y + 45, x - gap + 22, y + 125);
            drawNode(node.left, x - gap, y + 100, gap / 2);
        }

        if (node.right) {
            drawLine(x + 22, y + 45, x + gap + 22, y + 125);
            drawNode(node.right, x + gap, y + 100, gap / 2);
        }
    }

    function drawLine(x1, y1, x2, y2) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#555");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
    }

    drawNode(root, startX, 20, 120);
}

//  ANIMATIONS


function clearHighlights() {
    document.querySelectorAll(".node").forEach(node =>
        node.classList.remove("active", "found", "not-found")
    );
}

function animateTraversal(order) {
    const nodes = document.querySelectorAll(".node");
    clearHighlights();

    order.forEach((value, index) => {
        setTimeout(() => {
            clearHighlights();
            const current = [...nodes].find(n => n.textContent == value);
            if (current) current.classList.add("active");
        }, index * 1000);
    });
}

function animateSearch(path, found) {
    const nodes = document.querySelectorAll(".node");
    clearHighlights();

    path.forEach((value, index) => {
        setTimeout(() => {
            clearHighlights();
            const current = [...nodes].find(n => n.textContent == value);

            if (current) {
                current.classList.add("active");

                if (index === path.length - 1) {
                    current.classList.remove("active");
                    current.classList.add(found ? "found" : "not-found");
                }
            }
        }, index * 1000);
    });
}

//  DOM & EVENTS

const bst = new BST();

const insertBtn = document.getElementById("insertBtn");
const searchBtn = document.getElementById("searchBtn");
const inorderBtn = document.getElementById("inorderBtn");
const preorderBtn = document.getElementById("preorderBtn");
const postorderBtn = document.getElementById("postorderBtn");
const valueInput = document.getElementById("valueInput");
const outputText = document.getElementById("outputText");

// Insert
insertBtn.addEventListener("click", () => {
    const value = parseInt(valueInput.value);
    if (isNaN(value)) return;

    bst.insert(value);
    drawTree(bst.root);
    outputText.textContent = `Inserted ${value}`;
    valueInput.value = "";
});

// Search
searchBtn.addEventListener("click", () => {
    const value = parseInt(valueInput.value);
    if (isNaN(value)) return;

    const path = searchPath(bst.root, value);
    const found = path[path.length - 1] === value;

    animateSearch(path, found);
    outputText.textContent = found
        ? `Value ${value} FOUND`
        : `Value ${value} NOT FOUND`;
});

// Traversals
inorderBtn.addEventListener("click", () => {
    const result = bst.inorder(bst.root);
    outputText.textContent = "Inorder: " + result.join(" ");
    animateTraversal(result);
});

preorderBtn.addEventListener("click", () => {
    const result = bst.preorder(bst.root);
    outputText.textContent = "Preorder: " + result.join(" ");
    animateTraversal(result);
});

postorderBtn.addEventListener("click", () => {
    const result = bst.postorder(bst.root);
    outputText.textContent = "Postorder: " + result.join(" ");
    animateTraversal(result);
});
