// Function to handle theme selection
function selectTheme(theme) {
    // Remove 'selected' class from all theme options
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('selected');
    });

    // Add 'selected' class to the clicked theme option
    document.querySelector(`.${theme}`).classList.add('selected');

    // Change the theme by applying the selected theme's image as the background
    switch (theme) {
        case 'desert':
            document.body.style.backgroundImage = "url('../content/Desert.jpg')";
            break;
        case 'galaxy':
            document.body.style.backgroundImage = "url('../content/Galaxy.jpg')";
            break;
        case 'kinetic':
            document.body.style.backgroundImage = "url('../content/Kinetic.jpg')";
            break;
        case 'northern-light':
            document.body.style.backgroundImage = "url('../content/NorthernLight.jpg')";
            break;
        case 'red-velvet':
            document.body.style.backgroundImage = "url('../content/RedVelvet.jpg')";
            break;
        case 'solaris':
            document.body.style.backgroundImage = "url('../content/Solaris.jpg')";
            break;
        case 'sunset':
            document.body.style.backgroundImage = "url('../content/Sunset.jpg')";
            break;
        default:
            document.body.style.backgroundImage = "none";
    }
}

// Initial theme setup (default theme)
document.addEventListener('DOMContentLoaded', () => {
    selectTheme('northern-light');
});

// Dropdown Toggle Function
function toggleDropdown() {
    const dropdown = document.getElementById('myDropdown');

    // Toggle the 'show' class to open/close the dropdown
    dropdown.classList.toggle('show');
}

// Logout - Redirect Logic
document.getElementById('logoutBtn').addEventListener('click', function () {
    // Redirect to index.html (relative path)
    window.location.href = "../index.html";
});

// Search
document.getElementById("search").addEventListener("input", function () {
    let query = this.value.trim().toLowerCase();
    let contentDiv = document.querySelector(".showcontent");
    clearHighlights(contentDiv);
    if (query !== "") {
        highlightText(contentDiv, query);
    }
});

// Existing Highlights Clear Function
function clearHighlights(element) {
    let marks = element.querySelectorAll("mark");
    marks.forEach(mark => {
        let parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize(); // Remove extra nodes
    });
}

// Highlight Function using Range API
function highlightText(element, query) {
    let textNodes = getTextNodes(element);
    
    textNodes.forEach(node => {
        let matchIndex = node.nodeValue.toLowerCase().indexOf(query);
        if (matchIndex !== -1) {
            let range = document.createRange();
            range.setStart(node, matchIndex);
            range.setEnd(node, matchIndex + query.length);

            let highlight = document.createElement("mark");
            highlight.appendChild(range.extractContents());
            range.insertNode(highlight);
        }
    });
}

// Get All Text Nodes
function getTextNodes(element) {
    let textNodes = [];
    let walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }
    return textNodes;
}

function sendMail() {
    let name = document.getElementById("uname").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message) {
        alert("Please fill all fields first.");
        return;
    } else if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    let parms = {
        name: name,
        email: email,
        message: message,
    }
    
    // You can find your service ID in the Email Services section and your template ID in the Email Templates section of the EmailJS Dashboard.
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", parms).then(alert("Your Email Sent Successfully!!!"))
}
