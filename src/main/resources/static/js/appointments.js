// ============================
// LOAD APPOINTMENTS
// ============================

window.onload = function () {
    loadAppointments();
};

// ============================
// LOAD ALL APPOINTMENTS
// ============================

function loadAppointments() {

    fetch("/api/appointments")
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.log(error));

}

// ============================
// RENDER TABLE
// ============================

function renderTable(data) {

    let table = document.getElementById("appointmentData");

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">No Appointments Found</td>
            </tr>
        `;

        return;
    }

    data.forEach(a => {

        table.innerHTML += `
        <tr>

            <td>${a.appointmentId}</td>

            <td>${a.patientId}</td>

            <td>${a.doctorId}</td>

            <td>${a.appointmentDate.replace("T"," ")}</td>

            <td>${a.reason}</td>

            <td>

                <button
                    class="btn btn-success btn-sm"
                    onclick="editAppointment(
                        ${a.appointmentId},
                        ${a.patientId},
                        ${a.doctorId},
                        '${a.appointmentDate}',
                        '${a.reason}'
                    )">

                    Edit

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteAppointment(${a.appointmentId})">

                    Delete

                </button>

            </td>

        </tr>
        `;

    });

}

// ============================
// SAVE / UPDATE
// ============================

document.getElementById("appointmentForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        let id = document.getElementById("appointmentId").value;

        let appointment = {

            patientId: document.getElementById("patientId").value,

            doctorId: document.getElementById("doctorId").value,

            appointmentDate: document.getElementById("appointmentDate").value,

            reason: document.getElementById("reason").value

        };

        let url = "/api/appointments";

        let method = "POST";

        if (id !== "") {

            url = "/api/appointments/" + id;

            method = "PUT";

        }

        fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(appointment)

        })

            .then(response => {

                if (!response.ok) {

                    throw new Error("Save Failed");

                }

                return response.json();

            })

            .then(() => {

                alert("Appointment Saved Successfully");

                document.getElementById("appointmentForm").reset();

                document.getElementById("appointmentId").value = "";

                loadAppointments();

            })

            .catch(error => {

                alert(error.message);

            });

    });

// ============================
// EDIT
// ============================

function editAppointment(id, patient, doctor, date, reason) {

    document.getElementById("appointmentId").value = id;

    document.getElementById("patientId").value = patient;

    document.getElementById("doctorId").value = doctor;

    document.getElementById("appointmentDate").value = date.substring(0,16);

    document.getElementById("reason").value = reason;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// ============================
// DELETE
// ============================

function deleteAppointment(id) {

    if (!confirm("Do you want to delete this appointment?")) {

        return;

    }

    fetch("/api/appointments/" + id, {

        method: "DELETE"

    })

        .then(response => {

            if (!response.ok) {

                throw new Error("Delete Failed");

            }

            alert("Appointment Deleted Successfully");

            loadAppointments();

        })

        .catch(error => {

            alert(error.message);

        });

}

// ============================
// SEARCH
// ============================

function searchAppointment() {

    let keyword = document.getElementById("searchBox").value;

    if (keyword.trim() === "") {

        loadAppointments();

        return;

    }

    fetch("/api/appointments/search?keyword=" + encodeURIComponent(keyword))

        .then(response => response.json())

        .then(data => {

            renderTable(data);

        })

        .catch(error => {

            console.log(error);

        });

}