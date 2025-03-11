document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        const userID = document.getElementById("user-id").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ employeeID: userID, password: password }),
            });

            const result = await response.json();

            if (result.success) {
                // Store employee data in localStorage
                localStorage.setItem('employeeData', JSON.stringify({
                    name: result.name,
                    role: result.role,
                    id: userID,
                    photo: 'images/default-profile.png' // Placeholder, replace with actual photo URL if available
                }));

                if (result.role === "HR") {
                    window.location.href = "../Dashboard/index.html"; // Redirect HR to Dashboard
                } else {
                    window.location.href = "../Employee/index.html"; // Redirect other employees
                }
            } else {
                document.getElementById("error-message").style.display = "block";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});

// Get input and label elements
const idInput = document.getElementById('user-id');
const idLabel = document.querySelector('.id-label');

const passwordInput = document.getElementById('password');
const passwordLabel = document.querySelector('.password-label');

// Change ID Label on Focus
idInput.addEventListener('focus', () => {
    idLabel.textContent = 'Enter your ID';
});
idInput.addEventListener('blur', () => {
    if (idInput.value === '') {
        idLabel.textContent = 'ID';
    }
});

// Change Password Label on Focus
passwordInput.addEventListener('focus', () => {
    passwordLabel.textContent = 'Enter your Password';
});
passwordInput.addEventListener('blur', () => {
    if (passwordInput.value === '') {
        passwordLabel.textContent = 'Password';
    }
});

document.getElementById('profile-pic').addEventListener('click', function() {
    document.getElementById('profile-popup').style.display = 'block';
    fetchHRProfile();
});

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('profile-popup').style.display = 'none';
});

function fetchHRProfile() {
    // Simulate fetching data from the database
    const hrProfile = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'HR Manager'
    };

    document.getElementById('hr-name').innerText = hrProfile.name;
    document.getElementById('hr-email').innerText = hrProfile.email;
    document.getElementById('hr-position').innerText = hrProfile.position;
}