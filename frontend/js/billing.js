const API_BASE = "http://localhost:8080/api/bills";

// Load and display all bills
async function loadBills() {
    try {
        const res = await fetch(API_BASE);
        const bills = await res.json();
        const tbody = document.getElementById("billsTableBody");
        tbody.innerHTML = "";

        bills.forEach(bill => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${bill.billId}</td>
                <td>${bill.patientId}</td>
                <td>${bill.totalAmount.toFixed(2)}</td>
                <td class="status-${bill.paymentStatus}">${bill.paymentStatus}</td>
                <td>${bill.billingDate}</td>
                <td>
                    <button onclick="markAsPaid(${bill.billId}, ${bill.patientId}, ${bill.totalAmount}, '${bill.billingDate}')">Mark Paid</button>
                    <button class="danger" onclick="deleteBill(${bill.billId})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        alert("Error loading bills. Is the backend running?");
        console.error(err);
    }
}

// Create a new bill
async function createBill() {
    const patientId = document.getElementById("patientId").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const paymentStatus = document.getElementById("paymentStatus").value;
    const billingDate = document.getElementById("billingDate").value;

    if (!patientId || !totalAmount || !billingDate) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: Number(patientId),
                totalAmount: Number(totalAmount),
                paymentStatus: paymentStatus,
                billingDate: billingDate
            })
        });

        document.getElementById("patientId").value = "";
        document.getElementById("totalAmount").value = "";
        document.getElementById("billingDate").value = "";

        loadBills();
    } catch (err) {
        alert("Error creating bill.");
        console.error(err);
    }
}

// Mark a bill as paid (update)
async function markAsPaid(billId, patientId, totalAmount, billingDate) {
    try {
        await fetch(`${API_BASE}/${billId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: patientId,
                totalAmount: totalAmount,
                paymentStatus: "PAID",
                billingDate: billingDate
            })
        });
        loadBills();
    } catch (err) {
        alert("Error updating bill.");
        console.error(err);
    }
}

// Delete a bill
async function deleteBill(billId) {
    if (!confirm("Are you sure you want to delete this bill?")) return;

    try {
        await fetch(`${API_BASE}/${billId}`, { method: "DELETE" });
        loadBills();
    } catch (err) {
        alert("Error deleting bill.");
        console.error(err);
    }
}

// Load bills when the page opens
window.onload = loadBills;