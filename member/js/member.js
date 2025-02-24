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
    selectTheme('galaxy');
});

// Dropdown Toggle Function
function toggleDropdown() {
    const dropdown = document.getElementById('myDropdown');

    // Toggle the 'show' class to open/close the dropdown
    dropdown.classList.toggle('show');
}

// Logout - Redirect Logic
document.getElementById('logoutBtn').addEventListener('click', function () {
    window.location.href = "../index.html";
});

// Close Purchase Modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Print Bill
function printBill() {
    const printContents = document.getElementById('modal').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}
