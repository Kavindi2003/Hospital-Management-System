const API_URL = "http://localhost:8080/staff";

// ===============================
// Load data when page opens
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadStaff();

});

// ===============================
// Get all staff from backend
// ===============================

async function loadStaff() {

    try {

        const response = await fetch(API_URL);

        const staffList = await response.json();

        displayStaff(staffList);

    } catch (error) {

        console.error("Error loading staff:", error);

    }

}

// ===============================
// Display staff in table
// ===============================

function displayStaff(staffList) {

    const tableBody = document.querySelector("#staffTable tbody");

    tableBody.innerHTML = "";

    staffList.forEach(staff => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${staff.staffId}</td>
            <td>${staff.firstName}</td>
            <td>${staff.lastName}</td>
            <td>${staff.role}</td>
            <td>${staff.specialization}</td>
            <td>${staff.phoneNumber}</td>
            <td>${staff.email}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStaff(${staff.staffId})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStaff(${staff.staffId})">

                    Delete

                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });

}

// ===============================
// Placeholder functions
// (We'll implement these next.)
// ===============================

function editStaff(id) {

    console.log("Edit Staff:", id);

}

function deleteStaff(id) {

    console.log("Delete Staff:", id);

}