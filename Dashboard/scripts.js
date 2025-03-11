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

document.addEventListener('DOMContentLoaded', function() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonth = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    let date = new Date();
    let currentYear = date.getFullYear();
    let currentMonthIndex = date.getMonth();

    function renderCalendar(year, month) {
        calendarGrid.innerHTML = '';
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        currentMonth.textContent = date.toLocaleString('default', { month: 'long' }) + ' ' + year;

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty-cell');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('span');
            dayCell.textContent = day;

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('current-day');
            }

            calendarGrid.appendChild(dayCell);
        }
    }

    prevMonthButton.addEventListener('click', function() {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
            currentMonthIndex = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonthIndex);
    });

    nextMonthButton.addEventListener('click', function() {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
            currentMonthIndex = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonthIndex);
    });

    renderCalendar(currentYear, currentMonthIndex);
});

// Fetch documents from the backend
async function fetchDocuments() {
    try {
        const response = await fetch('http://localhost:3001/api/documents');
        const documents = await response.json();
        console.log('Documents:', documents);
        renderDocuments(documents); // Render documents in the frontend
    } catch (error) {
        console.error('Error fetching documents:', error);
    }
}

// Render documents in the frontend
function renderDocuments(documents) {
    const docList = document.querySelector('.doc-list');
    docList.innerHTML = ''; // Clear existing documents

    documents.forEach(doc => {
        const docItem = document.createElement('div');
        docItem.classList.add('doc-item');

        const docInfo = document.createElement('div');
        docInfo.classList.add('doc-info');

        const docTitle = document.createElement('span');
        docTitle.classList.add('doc-title');
        docTitle.textContent = doc.employeeName;

        const jobDescription = document.createElement('span');
        jobDescription.classList.add('job-description');
        jobDescription.textContent = doc.documentType;

        docInfo.appendChild(docTitle);
        docInfo.appendChild(jobDescription);

        const docType = document.createElement('span');
        docType.classList.add('doc-type');
        docType.textContent = doc.documentType;

        docItem.appendChild(docInfo);
        docItem.appendChild(docType);

        docList.appendChild(docItem);
    });
}

// Fetch messages from the backend
async function fetchMessages() {
    try {
        const response = await fetch('http://localhost:3001/api/messages');
        const messages = await response.json();
        console.log('Messages:', messages);
        renderMessages(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Render messages in the frontend
function renderMessages(messages) {
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = ''; // Clear existing messages

    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item');

        const profileImg = document.createElement('img');
        profileImg.src = 'images/profile.jpg'; // Placeholder image
        profileImg.alt = 'User';

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('name');
        nameSpan.textContent = message.sender;

        const textSpan = document.createElement('span');
        textSpan.classList.add('text');
        textSpan.textContent = message.message;

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('time');
        timeSpan.textContent = new Date(message.timestamp.seconds * 1000).toLocaleTimeString();

        messageContent.appendChild(nameSpan);
        messageContent.appendChild(textSpan);
        messageItem.appendChild(profileImg);
        messageItem.appendChild(messageContent);
        messageItem.appendChild(timeSpan);

        messageList.appendChild(messageItem);
    });
}

// Send a message to the backend
async function sendMessage(sender, receiver, message) {
    try {
        const response = await fetch('http://localhost:3001/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender, receiver, message }),
        });
        const result = await response.json();
        console.log('Message sent:', result);
        fetchMessages(); // Refresh messages after sending
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Example usage
document.addEventListener("DOMContentLoaded", function () {
    fetchDocuments();
    fetchMessages(); // Fetch messages when the page loads

    document.querySelectorAll(".menu-item span").forEach((el) => {
        el.style.textDecoration = "none";
    });
    
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

    // Handle message form submission
    const messageForm = document.getElementById('message-form');
    messageForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const sender = 'HR Manager'; // Replace with actual sender
        const receiver = document.getElementById('receiver').value;
        const message = document.getElementById('message').value;
        sendMessage(sender, receiver, message);
        messageForm.reset(); // Clear the form
    });
});

