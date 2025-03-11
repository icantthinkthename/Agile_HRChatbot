document.addEventListener("DOMContentLoaded", function () {
    const profileButton = document.getElementById("profile-button");
    const profileDropdown = document.getElementById("profileDropdown");

    function toggleProfileDropdown(event) {
        event.stopPropagation(); // Prevents event bubbling
        profileDropdown.style.display = (profileDropdown.style.display === "block") ? "none" : "block";
    }

    function closeDropdown(event) {
        if (!profileDropdown.contains(event.target) && !profileButton.contains(event.target)) {
            profileDropdown.style.display = "none";
        }
    }

    profileButton.addEventListener("click", toggleProfileDropdown);
    document.addEventListener("click", closeDropdown);
    
    // Set active menu item
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (currentPath.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});

function logout() {
    window.location.href = "../Login/index.html"; 
}


