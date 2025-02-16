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
    selectTheme('desert');
});

// Dropdown Toggle Function
function toggleDropdown() {
    const dropdown = document.getElementById('myDropdown');

    // Toggle the 'show' class to open/close the dropdown
    dropdown.classList.toggle('show');
}

// Open Close Sidebar
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Logout - Redirect Logic
document.getElementById('logoutBtn').addEventListener('click', function () {
    // Redirect to index.html (relative path)
    window.location.href = "../index.html";
});

// Show Password
function showPass() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type =
            "password";
    }
}
// Confirm Password
function confirmPass() {
    var x = document.getElementById("confirm-password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type =
            "password";
    }
}
// Add New Member Modal
var modal = document.getElementById("modal");

// Get the button that opens the modal
var btn = document.getElementById("addmemberbtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// View Reports Graph
const ctx = document.getElementById('gymReportChart').getContext('2d');
const gymReportChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Memberships', 'Financials', 'Training & Diet', 'Supplements', 'Attendance'],
        datasets: [{
            label: 'Report Data',
            data: [120, 200, 85, 50, 95],
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});