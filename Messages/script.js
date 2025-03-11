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
});


