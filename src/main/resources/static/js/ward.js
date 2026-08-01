const WARD_API = "/api/wards";
const ALLOCATION_API = "/api/allocations";

// In-memory cache of wards, used to populate the allocation dropdown
// and to show a friendly ward name in the allocation table.
let wardsCache = [];
let allocationsCache = [];

// Used only if the backend isn't reachable yet, so the UI is always testable.
let usingFallbackWards = false;
let usingFallbackAllocations = false;
const fallbackWards = [
    { wardId: 1, wardName: "General Ward A", capacity: 20, occupiedBeds: 12 },
    { wardId: 2, wardName: "ICU", capacity: 8, occupiedBeds: 5 },
    { wardId: 3, wardName: "Pediatric Ward", capacity: 15, occupiedBeds: 9 }
];
let fallbackAllocations = [];
let fallbackNextAllocationId = 1;

document.addEventListener("DOMContentLoaded", () => {

    loadWards();
    loadAllocations();

    document.getElementById("wardForm")
        .addEventListener("submit", saveWard);

    document.getElementById("allocationForm")
        .addEventListener("submit", saveAllocation);

});

/* ---------- Helpers ---------- */

// Prevent HTML/XSS injection when interpolating user-entered strings into innerHTML.
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function showMessage(text, type = "success") {
    const el = document.getElementById("message");
    el.textContent = text;
    el.className = type === "error" ? "error" : "success";

    clearTimeout(showMessage._timer);
    showMessage._timer = setTimeout(() => {
        el.className = "";
        el.textContent = "";
    }, 4000);
}

function formatDateTime(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return escapeHtml(value);
    return d.toLocaleString();
}

/* ---------- Wards ---------- */

function loadWards() {

    fetch(WARD_API)
        .then(res => {
            if (!res.ok) throw new Error("Failed to load wards");
            return res.json();
        })
        .then(data => {
            usingFallbackWards = false;
            renderWards(data);
        })
        .catch(err => {
            console.log("Ward API unavailable, using local demo data:", err);
            usingFallbackWards = true;
            showMessage("Backend not reachable — showing demo ward data.", "error");
            renderWards(fallbackWards);
        });

}

function renderWards(data) {

    wardsCache = data;

    let table = document.getElementById("wardTable");
    table.innerHTML = "";

    if (data.length === 0) {
        table.innerHTML = `<tr><td colspan="6">No wards yet. Add one above.</td></tr>`;
    }

    data.forEach(w => {

        const available = w.capacity - w.occupiedBeds;

        table.innerHTML += `
<tr>
<td>${escapeHtml(w.wardId)}</td>
<td>${escapeHtml(w.wardName)}</td>
<td>${escapeHtml(w.capacity)}</td>
<td>${escapeHtml(w.occupiedBeds)}</td>
<td>${escapeHtml(available)}</td>
<td>
<button type="button" class="edit-button" onclick="editWard(${w.wardId})">Edit</button>
<button type="button" class="delete-button" onclick="deleteWard(${w.wardId})">Delete</button>
</td>
</tr>
`;
    });

    populateWardSelect(data);
}

function populateWardSelect(wards) {

    const select = document.getElementById("wardSelect");
    const previousValue = select.value;

    select.innerHTML = `<option value="">Select Ward</option>`;

    wards.forEach(w => {
        const option = document.createElement("option");
        option.value = w.wardId;
        option.textContent = w.wardName;
        select.appendChild(option);
    });

    if (previousValue) select.value = previousValue;
}

function saveWard(e) {

    e.preventDefault();

    const wardId = document.getElementById("wardId").value;
    const capacity = Number(document.getElementById("capacity").value);
    const occupiedBeds = Number(document.getElementById("occupiedBeds").value);

    if (occupiedBeds > capacity) {
        showMessage("Occupied beds cannot exceed capacity.", "error");
        return;
    }

    const ward = {
        wardName: document.getElementById("wardName").value,
        capacity,
        occupiedBeds
    };

    const isEdit = Boolean(wardId);

    if (usingFallbackWards) {
        if (isEdit) {
            const existing = fallbackWards.find(w => w.wardId === Number(wardId));
            if (existing) Object.assign(existing, ward);
        } else {
            const nextId = fallbackWards.length
                ? Math.max(...fallbackWards.map(w => w.wardId)) + 1 : 1;
            fallbackWards.push({ wardId: nextId, ...ward });
        }
        showMessage(isEdit ? "Ward updated (demo mode)." : "Ward saved (demo mode).");
        clearWardForm();
        renderWards(fallbackWards);
        return;
    }

    const url = isEdit ? `${WARD_API}/${wardId}` : WARD_API;
    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ward)
    })
        .then(res => {
            if (!res.ok) throw new Error("Save failed");
            return res.json();
        })
        .then(() => {
            showMessage(isEdit ? "Ward updated." : "Ward saved.");
            clearWardForm();
            loadWards();
        })
        .catch(err => {
            console.log(err);
            showMessage("Unable to save ward.", "error");
        });

}

function editWard(wardId) {

    const ward = wardsCache.find(w => w.wardId === wardId);
    if (!ward) return;

    document.getElementById("wardId").value = ward.wardId;
    document.getElementById("wardName").value = ward.wardName;
    document.getElementById("capacity").value = ward.capacity;
    document.getElementById("occupiedBeds").value = ward.occupiedBeds;

    document.getElementById("wardTitle").textContent = "Edit Ward";

    document.getElementById("wardForm").scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteWard(wardId) {

    if (!confirm("Delete this ward? This cannot be undone.")) return;

    if (usingFallbackWards) {
        const idx = fallbackWards.findIndex(w => w.wardId === wardId);
        if (idx !== -1) fallbackWards.splice(idx, 1);
        showMessage("Ward deleted (demo mode).");
        renderWards(fallbackWards);
        return;
    }

    fetch(`${WARD_API}/${wardId}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            showMessage("Ward deleted.");
            loadWards();
        })
        .catch(err => {
            console.log(err);
            showMessage("Unable to delete ward.", "error");
        });

}

function clearWardForm() {

    document.getElementById("wardForm").reset();
    document.getElementById("wardId").value = "";
    document.getElementById("occupiedBeds").value = 0;
    document.getElementById("wardTitle").textContent = "Add Ward";

}

/* ---------- Allocations ---------- */

function loadAllocations() {

    fetch(ALLOCATION_API)
        .then(res => {
            if (!res.ok) throw new Error("Failed to load allocations");
            return res.json();
        })
        .then(data => {
            usingFallbackAllocations = false;
            renderAllocations(data);
        })
        .catch(err => {
            console.log("Allocation API unavailable, using local demo data:", err);
            usingFallbackAllocations = true;
            renderAllocations(fallbackAllocations);
        });

}

function renderAllocations(data) {

    allocationsCache = data;

    let table = document.getElementById("allocationTable");
    table.innerHTML = "";

    if (data.length === 0) {
        table.innerHTML = `<tr><td colspan="7">No allocations yet.</td></tr>`;
        return;
    }

    data.forEach(a => {

        const ward = wardsCache.find(w => w.wardId === a.wardId);
        const wardLabel = ward ? ward.wardName : a.wardId;

        table.innerHTML += `
<tr>
<td>${escapeHtml(a.allocationId)}</td>
<td>${escapeHtml(a.patientId)}</td>
<td>${escapeHtml(wardLabel)}</td>
<td>${escapeHtml(a.bedNumber)}</td>
<td>${formatDateTime(a.admissionDate)}</td>
<td>${formatDateTime(a.dischargeDate)}</td>
<td>
<button type="button" class="edit-button" onclick="editAllocation(${a.allocationId})">Edit</button>
<button type="button" class="delete-button" onclick="deleteAllocation(${a.allocationId})">Delete</button>
</td>
</tr>
`;
    });

}

function saveAllocation(e) {

    e.preventDefault();

    const allocationId = document.getElementById("allocationId").value;
    const wardId = document.getElementById("wardSelect").value;

    if (!wardId) {
        showMessage("Please select a ward.", "error");
        return;
    }

    const admissionDate = document.getElementById("admissionDate").value;
    const dischargeDate = document.getElementById("dischargeDate").value;

    if (dischargeDate && admissionDate && new Date(dischargeDate) < new Date(admissionDate)) {
        showMessage("Discharge date cannot be before admission date.", "error");
        return;
    }

    const allocation = {
        patientId: Number(document.getElementById("patientId").value),
        wardId: Number(wardId),
        bedNumber: document.getElementById("bedNumber").value,
        admissionDate: admissionDate || null,
        dischargeDate: dischargeDate || null
    };

    const isEdit = Boolean(allocationId);

    if (usingFallbackAllocations) {
        if (isEdit) {
            const existing = fallbackAllocations.find(a => a.allocationId === Number(allocationId));
            if (existing) Object.assign(existing, allocation);
        } else {
            fallbackAllocations.push({ allocationId: fallbackNextAllocationId++, ...allocation });
        }
        showMessage(isEdit ? "Allocation updated (demo mode)." : "Allocation saved (demo mode).");
        clearAllocationForm();
        renderAllocations(fallbackAllocations);
        return;
    }

    const url = isEdit ? `${ALLOCATION_API}/${allocationId}` : ALLOCATION_API;
    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allocation)
    })
        .then(res => {
            if (!res.ok) throw new Error("Save failed");
            return res.json();
        })
        .then(() => {
            showMessage(isEdit ? "Allocation updated." : "Allocation saved.");
            clearAllocationForm();
            loadAllocations();
            loadWards();
        })
        .catch(err => {
            console.log(err);
            showMessage("Unable to save allocation.", "error");
        });

}

function editAllocation(allocationId) {

    const allocation = allocationsCache.find(a => a.allocationId === allocationId);
    if (!allocation) return;

    document.getElementById("allocationId").value = allocation.allocationId;
    document.getElementById("patientId").value = allocation.patientId;
    document.getElementById("wardSelect").value = allocation.wardId;
    document.getElementById("bedNumber").value = allocation.bedNumber;
    document.getElementById("admissionDate").value = allocation.admissionDate
        ? allocation.admissionDate.slice(0, 16) : "";
    document.getElementById("dischargeDate").value = allocation.dischargeDate
        ? allocation.dischargeDate.slice(0, 16) : "";

    document.getElementById("allocationTitle").textContent = "Edit Room Allocation";

    document.getElementById("allocationForm").scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteAllocation(allocationId) {

    if (!confirm("Delete this allocation? This cannot be undone.")) return;

    if (usingFallbackAllocations) {
        const idx = fallbackAllocations.findIndex(a => a.allocationId === allocationId);
        if (idx !== -1) fallbackAllocations.splice(idx, 1);
        showMessage("Allocation deleted (demo mode).");
        renderAllocations(fallbackAllocations);
        return;
    }

    fetch(`${ALLOCATION_API}/${allocationId}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error("Delete failed");
            showMessage("Allocation deleted.");
            loadAllocations();
            loadWards();
        })
        .catch(err => {
            console.log(err);
            showMessage("Unable to delete allocation.", "error");
        });

}

function clearAllocationForm() {

    document.getElementById("allocationForm").reset();
    document.getElementById("allocationId").value = "";
    document.getElementById("allocationTitle").textContent = "Add Room Allocation";

}