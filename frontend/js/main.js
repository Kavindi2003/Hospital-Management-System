/* =====================================================
   Ward & Room Allocation module
   (Safe to include on other pages — code below only runs
   if the relevant elements exist on the current page.)
   ===================================================== */

// Your Spring Boot backend runs on port 8080.
// Since this frontend is opened separately (not served by Spring Boot),
// we need the FULL address here, not a relative path.
const API_BASE = "http://localhost:8080";

function showStatus(elId, msg, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.className = "status-msg show " + type;
    setTimeout(() => {
        el.className = "status-msg";
    }, 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

/* ===================== WARD LOGIC ===================== */
(function initWardModule() {
    const form = document.getElementById("ward-form");
    if (!form) return; // this page doesn't have the ward section, skip

    const cancelBtn = document.getElementById("ward-cancel-btn");
    const submitBtn = document.getElementById("ward-submit-btn");
    const formTitle = document.getElementById("ward-form-title");

    loadWards();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("wardId").value;
        const ward = {
            wardName: document.getElementById("wardName").value,
            capacity: parseInt(document.getElementById("capacity").value, 10),
            occupiedBeds: parseInt(document.getElementById("occupiedBeds").value, 10)
        };

        try {
            let res;
            if (id) {
                res = await fetch(`${API_BASE}/api/wards/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ward)
                });
            } else {
                res = await fetch(`${API_BASE}/api/wards`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ward)
                });
            }

            if (!res.ok) throw new Error("Request failed: " + res.status);

            showStatus("ward-status-msg", id ? "Ward updated." : "Ward added.", "success");
            resetWardForm();
            loadWards();
        } catch (err) {
            showStatus("ward-status-msg", "Something went wrong: " + err.message, "error");
        }
    });

    cancelBtn.addEventListener("click", resetWardForm);

    function resetWardForm() {
        form.reset();
        document.getElementById("wardId").value = "";
        submitBtn.textContent = "Add ward";
        formTitle.textContent = "Add a new ward";
        cancelBtn.style.display = "none";
    }

    function editWard(ward) {
        document.getElementById("wardId").value = ward.wardId;
        document.getElementById("wardName").value = ward.wardName;
        document.getElementById("capacity").value = ward.capacity;
        document.getElementById("occupiedBeds").value = ward.occupiedBeds;
        submitBtn.textContent = "Save changes";
        formTitle.textContent = "Edit ward";
        cancelBtn.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function deleteWard(id) {
        if (!confirm("Delete this ward? This cannot be undone.")) return;
        try {
            const res = await fetch(`${API_BASE}/api/wards/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Request failed: " + res.status);
            showStatus("ward-status-msg", "Ward deleted.", "success");
            loadWards();
        } catch (err) {
            showStatus("ward-status-msg", "Something went wrong: " + err.message, "error");
        }
    }

    async function loadWards() {
        try {
            const res = await fetch(`${API_BASE}/api/wards`);
            const wards = await res.json();
            const tbody = document.getElementById("ward-table-body");
            const emptyState = document.getElementById("ward-empty-state");
            tbody.innerHTML = "";

            if (!wards.length) {
                emptyState.style.display = "block";
                return;
            }
            emptyState.style.display = "none";

            wards.forEach(ward => {
                const available = ward.capacity - ward.occupiedBeds;
                const badgeClass = available > 0 ? "badge-ok" : "badge-full";
                const badgeText = available > 0 ? `${available} available` : "Full";

                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${ward.wardId}</td>
          <td>${escapeHtml(ward.wardName)}</td>
          <td>${ward.capacity}</td>
          <td>${ward.occupiedBeds}</td>
          <td><span class="badge ${badgeClass}">${badgeText}</span></td>
          <td class="row-actions">
            <button class="icon-btn" data-edit="${ward.wardId}">Edit</button>
            <button class="icon-btn danger" data-delete="${ward.wardId}">Delete</button>
          </td>
        `;
                tbody.appendChild(tr);

                tr.querySelector("[data-edit]").addEventListener("click", () => editWard(ward));
                tr.querySelector("[data-delete]").addEventListener("click", () => deleteWard(ward.wardId));
            });
        } catch (err) {
            showStatus("ward-status-msg", "Could not load wards: " + err.message, "error");
        }
    }
})();

/* =================== ROOM ALLOCATION LOGIC =================== */
(function initAllocationModule() {
    const form = document.getElementById("allocation-form");
    if (!form) return; // this page doesn't have the allocation section, skip

    const cancelBtn = document.getElementById("allocation-cancel-btn");
    const submitBtn = document.getElementById("allocation-submit-btn");
    const formTitle = document.getElementById("allocation-form-title");

    loadAllocations();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("allocationId").value;
        const dischargeVal = document.getElementById("dischargeDate").value;

        const allocation = {
            patientId: parseInt(document.getElementById("patientId").value, 10),
            wardId: parseInt(document.getElementById("allocWardId").value, 10),
            bedNumber: parseInt(document.getElementById("bedNumber").value, 10),
            admissionDate: document.getElementById("admissionDate").value,
            dischargeDate: dischargeVal ? dischargeVal : null
        };

        try {
            let res;
            if (id) {
                res = await fetch(`${API_BASE}/api/allocations/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(allocation)
                });
            } else {
                res = await fetch(`${API_BASE}/api/allocations`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(allocation)
                });
            }

            if (!res.ok) throw new Error("Request failed: " + res.status);

            showStatus("allocation-status-msg", id ? "Allocation updated." : "Allocation added.", "success");
            resetAllocationForm();
            loadAllocations();
        } catch (err) {
            showStatus("allocation-status-msg", "Something went wrong: " + err.message, "error");
        }
    });

    cancelBtn.addEventListener("click", resetAllocationForm);

    function resetAllocationForm() {
        form.reset();
        document.getElementById("allocationId").value = "";
        submitBtn.textContent = "Add allocation";
        formTitle.textContent = "Add a new allocation";
        cancelBtn.style.display = "none";
    }

    function editAllocation(a) {
        document.getElementById("allocationId").value = a.allocationId;
        document.getElementById("patientId").value = a.patientId;
        document.getElementById("allocWardId").value = a.wardId;
        document.getElementById("bedNumber").value = a.bedNumber;
        document.getElementById("admissionDate").value = a.admissionDate ? a.admissionDate.substring(0, 16) : "";
        document.getElementById("dischargeDate").value = a.dischargeDate ? a.dischargeDate.substring(0, 16) : "";
        submitBtn.textContent = "Save changes";
        formTitle.textContent = "Edit allocation";
        cancelBtn.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function deleteAllocation(id) {
        if (!confirm("Delete this allocation? This cannot be undone.")) return;
        try {
            const res = await fetch(`${API_BASE}/api/allocations/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Request failed: " + res.status);
            showStatus("allocation-status-msg", "Allocation deleted.", "success");
            loadAllocations();
        } catch (err) {
            showStatus("allocation-status-msg", "Something went wrong: " + err.message, "error");
        }
    }

    async function loadAllocations() {
        try {
            const res = await fetch(`${API_BASE}/api/allocations`);
            const allocations = await res.json();
            const tbody = document.getElementById("allocation-table-body");
            const emptyState = document.getElementById("allocation-empty-state");
            tbody.innerHTML = "";

            if (!allocations.length) {
                emptyState.style.display = "block";
                return;
            }
            emptyState.style.display = "none";

            allocations.forEach(a => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${a.allocationId}</td>
          <td>Patient #${a.patientId}</td>
          <td>Ward #${a.wardId}</td>
          <td>${a.bedNumber}</td>
          <td>${formatDate(a.admissionDate)}</td>
          <td>${formatDate(a.dischargeDate)}</td>
          <td class="row-actions">
            <button class="icon-btn" data-edit="${a.allocationId}">Edit</button>
            <button class="icon-btn danger" data-delete="${a.allocationId}">Delete</button>
          </td>
        `;
                tbody.appendChild(tr);

                tr.querySelector("[data-edit]").addEventListener("click", () => editAllocation(a));
                tr.querySelector("[data-delete]").addEventListener("click", () => deleteAllocation(a.allocationId));
            });
        } catch (err) {
            showStatus("allocation-status-msg", "Could not load allocations: " + err.message, "error");
        }
    }
})();