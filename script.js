
//  CONFIG

const BASE_URL = "http://127.0.0.1:5000";

//  DOM ELEMENTS

const insertBtn = document.getElementById("insertBtn");
const searchBtn = document.getElementById("searchBtn");
const inorderBtn = document.getElementById("inorderBtn");
const preorderBtn = document.getElementById("preorderBtn");
const postorderBtn = document.getElementById("postorderBtn");
const valueInput = document.getElementById("valueInput");
const outputText = document.getElementById("outputText");

//  HELPER FUNCTIONS

function clearHighlights() {
    document.querySelectorAll(".node").forEach(node =>
        node.classList.remove("active", "found", "not-found")
    );
}

//  ANIMATIONS

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


//  API CALLS

// Insert
insertBtn.addEventListener("click", () => {
    const value = parseInt(valueInput.value);
    if (isNaN(value)) return;

    fetch(`${BASE_URL}/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value })
    })
        .then(res => res.json())
        .then(data => {
           outputText.textContent = data.message;
           drawTreeFromBackend(data.tree);
    });

});

// Search
searchBtn.addEventListener("click", () => {
    const value = parseInt(valueInput.value);
    if (isNaN(value)) return;

    fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value })
    })
        .then(res => res.json())
        .then(data => {
            animateSearch(data.path, data.found);
            outputText.textContent = data.found
                ? `Value ${value} FOUND`
                : `Value ${value} NOT FOUND`;
        });
});

function drawTreeFromBackend(tree) {
    const container = document.querySelector(".tree-container");

    // Clear container
    container.innerHTML = `<svg id="tree-lines"></svg>`;
    const svg = document.getElementById("tree-lines");

    const width = container.offsetWidth;

    function drawNode(node, x, y, gap) {
        if (!node) return;

        const div = document.createElement("div");
        div.className = "node";
        div.textContent = node.value;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        container.appendChild(div);

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

    drawNode(tree, width / 2, 20, 140);
}

const deleteBtn = document.getElementById("deleteBtn");

deleteBtn.addEventListener("click", () => {
    const value = parseInt(valueInput.value);
    if (isNaN(value)) return;

    fetch("http://127.0.0.1:5000/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value })
    })
        .then(res => res.json())
        .then(data => {
            outputText.textContent = data.message;
            drawTreeFromBackend(data.tree);
            valueInput.value = "";
        });
});


// Traversals
inorderBtn.addEventListener("click", () => {
    fetch(`${BASE_URL}/inorder`)
        .then(res => res.json())
        .then(result => {
            outputText.textContent = "Inorder: " + result.join(" ");
            animateTraversal(result);
        });
});

preorderBtn.addEventListener("click", () => {
    fetch(`${BASE_URL}/preorder`)
        .then(res => res.json())
        .then(result => {
            outputText.textContent = "Preorder: " + result.join(" ");
            animateTraversal(result);
        });
});

postorderBtn.addEventListener("click", () => {
    fetch(`${BASE_URL}/postorder`)
        .then(res => res.json())
        .then(result => {
            outputText.textContent = "Postorder: " + result.join(" ");
            animateTraversal(result);
        });
});
