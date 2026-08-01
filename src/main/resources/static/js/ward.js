var WARD_API = "/api/wards";
var ALLOCATION_API = "/api/allocations";


/* ============================================
   PAGE START
============================================ */

document.addEventListener("DOMContentLoaded", function () {

    loadWards();
    loadAllocations();

    document.getElementById("wardForm")
        .addEventListener("submit", saveWard);

    document.getElementById("allocationForm")
        .addEventListener("submit", saveAllocation);

});


/* ============================================
   MESSAGE
============================================ */

function showMessage(text, type) {

    var message = document.getElementById("message");

    message.innerText = text;

    message.className = type;

    setTimeout(function () {

        message.className = "";

        message.style.display = "none";

    }, 3000);
}


/* ============================================
   LOAD WARDS
============================================ */

function loadWards() {

    fetch(WARD_API)

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Could not load wards");
            }

            return response.json();

        })

        .then(function (wards) {

            displayWards(wards);

            fillWardSelect(wards);

        })

        .catch(function (error) {

            console.error(error);

            showMessage(
                "Failed to load wards",
                "error"
            );

        });
}


/* ============================================
   DISPLAY WARDS
============================================ */

function displayWards(wards) {

    var table =
        document.getElementById("wardTable");

    table.innerHTML = "";


    if (wards.length === 0) {

        table.innerHTML =
            "<tr>" +
            "<td colspan='6'>No wards found</td>" +
            "</tr>";

        return;
    }


    wards.forEach(function (ward) {

        var available =
            ward.capacity - ward.occupiedBeds;


        var row =
            document.createElement("tr");


        row.innerHTML =

            "<td>" +
            ward.wardId +
            "</td>" +

            "<td>" +
            ward.wardName +
            "</td>" +

            "<td>" +
            ward.capacity +
            "</td>" +

            "<td>" +
            ward.occupiedBeds +
            "</td>" +

            "<td>" +
            available +
            "</td>" +

            "<td>" +

            "<button " +
            "class='edit-button' " +
            "onclick='editWard(" +
            ward.wardId +
            ")'>" +

            "Edit" +

            "</button>" +

            "<button " +
            "class='delete-button' " +
            "onclick='deleteWard(" +
            ward.wardId +
            ")'>" +

            "Delete" +

            "</button>" +

            "</td>";


        table.appendChild(row);

    });
}


/* ============================================
   WARD DROPDOWN
============================================ */

function fillWardSelect(wards) {

    var select =
        document.getElementById("wardSelect");


    select.innerHTML =
        "<option value=''>Select Ward</option>";


    wards.forEach(function (ward) {

        var option =
            document.createElement("option");


        option.value =
            ward.wardId;


        option.text =
            ward.wardName;


        select.appendChild(option);

    });
}


/* ============================================
   SAVE WARD
============================================ */

function saveWard(event) {

    event.preventDefault();


    var id =
        document.getElementById("wardId").value;


    var name =
        document.getElementById("wardName").value;


    var capacity =
        parseInt(
            document.getElementById("capacity").value
        );


    var occupied =
        parseInt(
            document.getElementById("occupiedBeds").value
        );


    if (occupied > capacity) {

        showMessage(
            "Occupied beds cannot be greater than capacity",
            "error"
        );

        return;
    }


    var ward = {

        wardName: name,

        capacity: capacity,

        occupiedBeds: occupied

    };


    var url = WARD_API;

    var method = "POST";


    if (id !== "") {

        url =
            WARD_API + "/" + id;

        method = "PUT";

    }


    fetch(url, {

        method: method,

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify(ward)

    })

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Ward save failed");
            }

            return response.json();

        })

        .then(function () {

            showMessage(
                "Ward saved successfully",
                "success"
            );

            clearWardForm();

            loadWards();

        })

        .catch(function (error) {

            console.error(error);

            showMessage(
                "Failed to save ward",
                "error"
            );

        });
}


/* ============================================
   EDIT WARD
============================================ */

function editWard(id) {

    fetch(
        WARD_API + "/" + id
    )

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Ward not found");
            }

            return response.json();

        })

        .then(function (ward) {

            document.getElementById(
                "wardId"
            ).value = ward.wardId;


            document.getElementById(
                "wardName"
            ).value = ward.wardName;


            document.getElementById(
                "capacity"
            ).value = ward.capacity;


            document.getElementById(
                "occupiedBeds"
            ).value = ward.occupiedBeds;


            document.getElementById(
                "wardTitle"
            ).innerText = "Edit Ward";


            document.getElementById(
                "wardForm"
            ).scrollIntoView({
                behavior: "smooth"
            });

        })

        .catch(function (error) {

            console.error(error);

            showMessage(
                "Failed to load ward",
                "error"
            );

        });
}


/* ============================================
   DELETE WARD
============================================ */

function deleteWard(id) {

    var answer =
        confirm(
            "Are you sure you want to delete this ward?"
        );


    if (!answer) {
        return;
    }


    fetch(
        WARD_API + "/" + id,
        {
            method: "DELETE"
        }
    )

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Delete failed");
            }

        })

        .then(function () {

            showMessage(
                "Ward deleted successfully",
                "success"
            );

            loadWards();

        })

        .catch(function (error) {

            console.error(error);

            showMessage(
                "Failed to delete ward",
                "error"
            );

        });
}


/* ============================================
   CLEAR WARD FORM
============================================ */

function clearWardForm() {

    document.getElementById(
        "wardForm"
    ).reset();


    document.getElementById(
        "wardId"
    ).value = "";


    document.getElementById(
        "occupiedBeds"
    ).value = "0";


    document.getElementById(
        "wardTitle"
    ).innerText = "Add Ward";
}


/* ============================================
   LOAD ALLOCATIONS
============================================ */

function loadAllocations() {

    fetch(ALLOCATION_API)

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Could not load allocations"
                );
            }

            return response.json();

        })

        .then(function (allocations) {

            displayAllocations(
                allocations
            );

        })

        .catch(function (error) {

            console.error(error);

            showMessage(
                "Failed to load room allocations",
                "error"
            );

        });
}


/* ============================================
   DISPLAY ALLOCATIONS
============================================ */

function displayAllocations(
    allocations
) {

    var table =
        document.getElementById(
            "allocationTable"
        );


    table.innerHTML = "";


    if (allocations.length === 0) {

        table.innerHTML =
            "<tr>" +
            "<td colspan='7'>" +
            "No allocations found" +
            "</td>" +
            "</tr>";

        return;
    }


    allocations.forEach(
        function (allocation) {

            var discharge =
                allocation.dischargeDate
                    ? allocation.dischargeDate
                    : "Not discharged";


            var row =
                document.createElement("tr");


            row.innerHTML =

                "<td>" +
                allocation.allocationId +
                "</td>" +

                "<td>" +
                allocation.patientId +
                "</td>" +

                "<td>" +
                allocation.wardId +
                "</td>" +

                "<td>" +
                allocation.bedNumber +
                "</td>" +

                "<td>" +
                allocation.admissionDate +
                "</td>" +

                "<td>" +
                discharge +
                "</td>" +

                "<td>" +

                "<button " +
                "class='edit-button' " +
                "onclick='editAllocation(" +
                allocation.allocationId +
                ")'>" +

                "Edit" +

                "</button>" +

                "<button " +
                "class='delete-button' " +
                "onclick='deleteAllocation(" +
                allocation.allocationId +
                ")'>" +

                "Delete" +

                "</button>" +

                "</td>";


            table.appendChild(row);

        }
    );
}


/* ============================================
   SAVE ALLOCATION
============================================ */

function saveAllocation(event) {

    event.preventDefault();


    var id =
        document.getElementById(
            "allocationId"
        ).value;


    var patientId =
        parseInt(
            document.getElementById(
                "patientId"
            ).value
        );


    var wardId =
        parseInt(
            document.getElementById(
                "wardSelect"
            ).value
        );


    var bedNumber =
        parseInt(
            document.getElementById(
                "bedNumber"
            ).value
        );


    var admissionDate =
        document.getElementById(
            "admissionDate"
        ).value;


    var dischargeDate =
        document.getElementById(
            "dischargeDate"
        ).value;


    var allocation = {

        patientId: patientId,

        wardId: wardId,

        bedNumber: bedNumber,

        admissionDate: admissionDate,

        dischargeDate:
            dischargeDate === ""
                ? null
                : dischargeDate

    };


    var url =
        ALLOCATION_API;


    var method =
        "POST";


    if (id !== "") {

        url =
            ALLOCATION_API +
            "/" +
            id;

        method =
            "PUT";

    }


    fetch(url, {

        method: method,

        headers: {
            "Content-Type":
                "application/json"
        },

        body:
            JSON.stringify(
                allocation
            )

    })

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Allocation save failed"
                );
            }

            return response.json();

        })

        .then(function () {

            showMessage(
                "Room allocation saved successfully",
                "success"
            );


            clearAllocationForm();

            loadAllocations();

            loadWards();

        })

        .catch(function (error) {

            console.error(error);

            showMessage(
                "Failed to save allocation",
                "error"
            );

        });
}


/* ============================================
   EDIT ALLOCATION
============================================ */

function editAllocation(id) {

    fetch(
        ALLOCATION_API +
        "/" +
        id
    )

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Allocation not found"
                );
            }

            return response.json();

        })

        .then(function (allocation) {

            document.getElementById(
                "allocationId"
            ).value =
                allocation.allocationId;


            document.getElementById(
                "patientId"
            ).value =
                allocation.patientId;


            document.getElementById(
                "wardSelect"
            ).value =
                allocation.wardId;


            document.getElementById(
                "bedNumber"
            ).value =
                allocation.bedNumber;


            document.getElementById(
                "admissionDate"
            ).value =
                convertDate(
                    allocation.admissionDate
                );


            if (
                allocation.dischargeDate
            ) {

                document.getElementById(
                    "dischargeDate"
                ).value =
                    convertDate(
                        allocation.dischargeDate
                    );

            } else {

                document.getElementById(
                    "dischargeDate"
                ).value = "";

            }


            document.getElementById(
                "allocationTitle"
            ).innerText =
                "Edit Room Allocation";


            document.getElementById(
                "allocationForm"
            ).scrollIntoView({
                behavior: "smooth"
            });

        })

        .catch(function (error) {

            console.error(error);

            showMessage(
                "Failed to load allocation",
                "error"
            );

        });
}


/* ============================================
   DELETE ALLOCATION
============================================ */

function deleteAllocation(id) {

    var answer =
        confirm(
            "Are you sure you want to delete this allocation?"
        );


    if (!answer) {
        return;
    }


    fetch(
        ALLOCATION_API +
        "/" +
        id,
        {
            method: "DELETE"
        }
    )

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Delete failed"
                );
            }

        })

        .then(function () {

            showMessage(
                "Allocation deleted successfully",
                "success"
            );


            loadAllocations();

            loadWards();

        })

        .catch(function (error) {

            console.error(error);

            showMessage(
                "Failed to delete allocation",
                "error"
            );

        });
}


/* ============================================
   CLEAR ALLOCATION FORM
============================================ */

function clearAllocationForm() {

    document.getElementById(
        "allocationForm"
    ).reset();


    document.getElementById(
        "allocationId"
    ).value = "";


    document.getElementById(
        "allocationTitle"
    ).innerText =
        "Add Room Allocation";
}


/* ============================================
   DATE CONVERSION
============================================ */

function convertDate(dateString) {

    if (!dateString) {
        return "";
    }


    return dateString.substring(
        0,
        16
    );
}