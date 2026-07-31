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

// ===============================
// Save Staff
// ===============================

document.getElementById("staffForm").addEventListener("submit", saveStaff);

async function saveStaff(event) {

    event.preventDefault();

    const staff = {

        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        role: document.getElementById("role").value,
        specialization: document.getElementById("specialization").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        email: document.getElementById("email").value

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(staff)

        });

        if(response.ok){

            alert("Staff added successfully!");

            document.getElementById("staffForm").reset();

            loadStaff();

        }else{

            alert("Failed to add staff.");

        }

    } catch (error) {

        console.error(error);

        alert("Error while saving staff.");

    }

}