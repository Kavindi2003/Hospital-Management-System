const API_URL = "http://localhost:8080/staff";
let allStaff = []; //This variable will always keep a copy of all staff records.

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

        allStaff = await response.json(); // every time data is loaded, it's stored in allStaff.

        displayStaff(allStaff);

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


// Placeholder functions
// ===============================
// Edid Staff
// ===============================

async function editStaff(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const staff = await response.json();

        document.getElementById("staffId").value = staff.staffId;
        document.getElementById("firstName").value = staff.firstName;
        document.getElementById("lastName").value = staff.lastName;
        document.getElementById("role").value = staff.role;
        document.getElementById("specialization").value = staff.specialization;
        document.getElementById("phoneNumber").value = staff.phoneNumber;
        document.getElementById("email").value = staff.email;

        document.getElementById("saveBtn").textContent = "Update Staff";

    } catch (error) {

        console.error(error);
        alert("Unable to load staff details.");

    }

}

// ===============================
// Delete Staff
// ===============================

async function deleteStaff(id) {

    const confirmDelete = confirm("Are you sure you want to delete this staff member?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        if (response.ok) {

            alert("Staff deleted successfully!");

            loadStaff();

        } else {

            alert("Failed to delete staff.");

        }

    } catch (error) {

        console.error(error);

        alert("Error while deleting staff.");

    }

}

// ===============================
// Save Staff
// ===============================

document.getElementById("staffForm").addEventListener("submit", saveStaff);

async function saveStaff(event) {

    event.preventDefault();

    const staff = {

        staffId: document.getElementById("staffId").value,

        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        role: document.getElementById("role").value,
        specialization: document.getElementById("specialization").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        email: document.getElementById("email").value

    };

    try {

        const isUpdate = staff.staffId !== "";

        const response = await fetch(API_URL, {

            method: isUpdate ? "PUT" : "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(staff)

        });

        if(response.ok){

            alert("Staff added successfully!");

            document.getElementById("staffForm").reset();

            document.getElementById("staffId").value = "";

            document.getElementById("saveBtn").textContent = "Save Staff";

            loadStaff();

        }else{

            alert("Failed to add staff.");

        }

    } catch (error) {

        console.error(error);

        alert("Error while saving staff.");

    }

}

// ===============================
// Search Staff
// ===============================

document.getElementById("searchInput").addEventListener("input", searchStaff);

function searchStaff() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filteredStaff = allStaff.filter(staff =>

        staff.firstName.toLowerCase().includes(keyword) ||
        staff.lastName.toLowerCase().includes(keyword) ||
        staff.role.toLowerCase().includes(keyword)

    );

    displayStaff(filteredStaff);

}