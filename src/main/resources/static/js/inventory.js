// ==========================================================================
// inventory.js — Pharmacy and Inventory module
// Communicates with InventoryItemController through /api/inventory
// ==========================================================================

const API_BASE = "/api/inventory";
const LOW_STOCK_LIMIT = 10;

const els = {
    itemsBody: document.getElementById("itemsBody"),
    emptyState: document.getElementById("emptyState"),
    loadingBar: document.getElementById("loadingBar"),

    statTotal: document.getElementById("statTotal"),
    statView: document.getElementById("statView"),
    statLowStock: document.getElementById("statLowStock"),
    statExpired: document.getElementById("statExpired"),

    panelTitle: document.getElementById("panelTitle"),
    apiBadge: document.getElementById("apiBadge"),

    formOverlay: document.getElementById("formOverlay"),
    viewOverlay: document.getElementById("viewOverlay"),
    deleteOverlay: document.getElementById("deleteOverlay"),

    itemForm: document.getElementById("itemForm"),
    viewDetails: document.getElementById("viewDetails"),
    toastContainer: document.getElementById("toastContainer")
};

let currentItems = [];
let pendingDeleteId = null;
let lastViewedItem = null;

// ---------- General helpers ----------

function setLoading(isLoading) {
    els.loadingBar.classList.toggle("active", isLoading);
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;

    els.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function displayOr(value, fallback = "—") {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    return escapeHtml(value);
}

function formatMoney(value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return escapeHtml(value);
    }

    return number.toFixed(2);
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return escapeHtml(value);
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function isExpired(dateValue) {
    if (!dateValue) {
        return false;
    }

    const expiration = new Date(`${dateValue}T23:59:59`);
    return expiration < new Date();
}

function isExpiringSoon(dateValue) {
    if (!dateValue || isExpired(dateValue)) {
        return false;
    }

    const expiration = new Date(`${dateValue}T23:59:59`);
    const thirtyDaysFromNow = new Date();

    thirtyDaysFromNow.setDate(
        thirtyDaysFromNow.getDate() + 30
    );

    return expiration <= thirtyDaysFromNow;
}

async function parseErrorResponse(response) {
    const text = await response.text();

    try {
        const json = JSON.parse(text);

        return json.message
            || json.error
            || text
            || response.statusText;
    } catch {
        return text || response.statusText;
    }
}

async function api(path = "", options = {}) {
    setLoading(true);

    try {
        const response = await fetch(API_BASE + path, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            ...options
        });

        if (response.status === 204) {
            return null;
        }

        if (!response.ok) {
            const message = await parseErrorResponse(response);
            throw new Error(message);
        }

        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            return response.json();
        }

        return null;
    } finally {
        setLoading(false);
    }
}

// ---------- Table and statistics ----------

function updateStatistics(items) {
    const lowStockCount = items.filter(item =>
        Number(item.quantityInStock) <= LOW_STOCK_LIMIT
    ).length;

    const expiredCount = items.filter(item =>
        isExpired(item.expirationDate)
    ).length;

    els.statTotal.textContent = String(items.length);
    els.statLowStock.textContent = String(lowStockCount);
    els.statExpired.textContent = String(expiredCount);
}

function renderItems(items) {
    currentItems = Array.isArray(items) ? items : [items];

    els.itemsBody.innerHTML = "";

    updateStatistics(currentItems);

    if (currentItems.length === 0) {
        els.emptyState.hidden = false;
        return;
    }

    els.emptyState.hidden = true;

    for (const item of currentItems) {
        const quantity = Number(item.quantityInStock);

        const stockClass =
            quantity <= LOW_STOCK_LIMIT
                ? "stock-low"
                : "stock-normal";

        let expirationClass = "";

        if (isExpired(item.expirationDate)) {
            expirationClass = "expired";
        } else if (isExpiringSoon(item.expirationDate)) {
            expirationClass = "expiring-soon";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <span class="badge">
                    #${escapeHtml(item.itemId)}
                </span>
            </td>

            <td>${displayOr(item.itemName)}</td>

            <td>
                <span class="badge badge-muted">
                    ${displayOr(item.category)}
                </span>
            </td>

            <td>
                <span class="badge ${stockClass}">
                    ${escapeHtml(item.quantityInStock)}
                </span>
            </td>

            <td>${formatMoney(item.unitPrice)}</td>

            <td>${displayOr(item.batchNumber)}</td>

            <td class="${expirationClass}">
                ${formatDate(item.expirationDate)}
            </td>

            <td>
                <div class="row-actions">

                    <button
                            type="button"
                            class="btn btn-ghost btn-sm"
                            data-action="view"
                            data-id="${item.itemId}">
                        View
                    </button>

                    <button
                            type="button"
                            class="btn btn-ghost btn-sm"
                            data-action="edit"
                            data-id="${item.itemId}">
                        Edit
                    </button>

                    <button
                            type="button"
                            class="btn btn-danger btn-sm"
                            data-action="delete"
                            data-id="${item.itemId}">
                        Delete
                    </button>

                </div>
            </td>
        `;

        els.itemsBody.appendChild(row);
    }
}

function setViewContext(label, endpoint) {
    els.statView.textContent = label;
    els.panelTitle.textContent = label;
    els.apiBadge.textContent = endpoint;
}

function findItemById(id) {
    return currentItems.find(item =>
        String(item.itemId) === String(id)
    );
}

// ---------- GET requests ----------

async function loadAllItems() {
    setViewContext(
        "All items",
        "GET /api/inventory"
    );

    try {
        const items = await api("");

        renderItems(items);
        showToast("Inventory items loaded");
    } catch (error) {
        renderItems([]);
        showToast(error.message, "error");
    }
}

async function loadItemById(id) {
    setViewContext(
        `Item #${id}`,
        `GET /api/inventory/${id}`
    );

    try {
        const item = await api(`/${id}`);

        renderItems([item]);
        showToast(`Item #${id} loaded`);
    } catch (error) {
        renderItems([]);
        showToast(error.message, "error");
    }
}

// ---------- Modal helpers ----------

function openModal(overlay) {
    overlay.classList.add("open");
}

function closeModal(overlay) {
    overlay.classList.remove("open");
}

function openCreateForm() {
    document.getElementById("formModalTitle").textContent =
        "Add inventory item";

    document.getElementById("editItemId").value = "";

    els.itemForm.reset();

    openModal(els.formOverlay);
}

function openEditForm(item) {
    document.getElementById("formModalTitle").textContent =
        `Edit item #${item.itemId}`;

    document.getElementById("editItemId").value =
        item.itemId;

    document.getElementById("itemName").value =
        item.itemName || "";

    document.getElementById("category").value =
        item.category || "";

    document.getElementById("quantityInStock").value =
        item.quantityInStock ?? "";

    document.getElementById("unitPrice").value =
        item.unitPrice ?? "";

    document.getElementById("batchNumber").value =
        item.batchNumber || "";

    document.getElementById("expirationDate").value =
        item.expirationDate || "";

    openModal(els.formOverlay);
}

function showItemDetails(item) {
    lastViewedItem = item;

    document.getElementById("viewModalTitle").textContent =
        `Item #${item.itemId}`;

    els.viewDetails.innerHTML = `
        <div>
            <dt>Item ID</dt>
            <dd>${escapeHtml(item.itemId)}</dd>
        </div>

        <div>
            <dt>Item name</dt>
            <dd>${displayOr(item.itemName)}</dd>
        </div>

        <div>
            <dt>Category</dt>
            <dd>${displayOr(item.category)}</dd>
        </div>

        <div>
            <dt>Quantity in stock</dt>
            <dd>${escapeHtml(item.quantityInStock)}</dd>
        </div>

        <div>
            <dt>Unit price</dt>
            <dd>${formatMoney(item.unitPrice)}</dd>
        </div>

        <div>
            <dt>Batch number</dt>
            <dd>${displayOr(item.batchNumber)}</dd>
        </div>

        <div>
            <dt>Expiration date</dt>
            <dd>${formatDate(item.expirationDate)}</dd>
        </div>
    `;

    openModal(els.viewOverlay);
}

// ---------- Table buttons ----------

els.itemsBody.addEventListener("click", async event => {
    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    let item = findItemById(id);

    if (action === "view") {
        if (!item) {
            try {
                item = await api(`/${id}`);
            } catch (error) {
                showToast(error.message, "error");
                return;
            }
        }

        showItemDetails(item);
        return;
    }

    if (action === "edit") {
        if (!item) {
            try {
                item = await api(`/${id}`);
            } catch (error) {
                showToast(error.message, "error");
                return;
            }
        }

        openEditForm(item);
        return;
    }

    if (action === "delete") {
        pendingDeleteId = id;

        document.getElementById("deleteItemLabel").textContent =
            `#${id}`;

        openModal(els.deleteOverlay);
    }
});

// ---------- POST and PUT ----------

els.itemForm.addEventListener("submit", async event => {
    event.preventDefault();

    const editId =
        document.getElementById("editItemId").value;

    const itemName =
        document.getElementById("itemName").value.trim();

    const category =
        document.getElementById("category").value.trim();

    const quantityInStock =
        Number(
            document.getElementById("quantityInStock").value
        );

    const unitPrice =
        Number(
            document.getElementById("unitPrice").value
        );

    const batchNumber =
        document.getElementById("batchNumber").value.trim();

    const expirationDate =
        document.getElementById("expirationDate").value;

    if (!itemName) {
        showToast("Item name is required", "error");
        return;
    }

    if (!category) {
        showToast("Category is required", "error");
        return;
    }

    if (!Number.isInteger(quantityInStock)
        || quantityInStock < 0) {

        showToast(
            "Quantity must be a non-negative whole number",
            "error"
        );

        return;
    }

    if (Number.isNaN(unitPrice) || unitPrice < 0) {
        showToast(
            "Unit price must be a non-negative number",
            "error"
        );

        return;
    }

    const body = {
        itemName,
        category,
        quantityInStock,
        unitPrice,
        batchNumber: batchNumber || null,
        expirationDate: expirationDate || null
    };

    try {
        if (editId) {
            await api(`/${editId}`, {
                method: "PUT",
                body: JSON.stringify(body)
            });

            showToast(`Item #${editId} updated`);
        } else {
            await api("", {
                method: "POST",
                body: JSON.stringify(body)
            });

            showToast("Inventory item created");
        }

        closeModal(els.formOverlay);

        await loadAllItems();
    } catch (error) {
        showToast(error.message, "error");
    }
});

// ---------- DELETE ----------

document
    .getElementById("btnConfirmDelete")
    .addEventListener("click", async () => {

        if (!pendingDeleteId) {
            return;
        }

        try {
            await api(`/${pendingDeleteId}`, {
                method: "DELETE"
            });

            showToast(
                `Item #${pendingDeleteId} deleted`
            );

            closeModal(els.deleteOverlay);

            pendingDeleteId = null;

            await loadAllItems();
        } catch (error) {
            showToast(error.message, "error");
        }
    });

// ---------- Main buttons ----------

document
    .getElementById("btnNewItem")
    .addEventListener("click", openCreateForm);

document
    .getElementById("btnRefresh")
    .addEventListener("click", loadAllItems);

document
    .getElementById("btnLookupItem")
    .addEventListener("click", () => {

        const id =
            document.getElementById("filterItemId").value;

        if (!id) {
            showToast("Enter an item ID", "error");
            return;
        }

        loadItemById(id);
    });

document
    .getElementById("btnCancelForm")
    .addEventListener("click", () => {
        closeModal(els.formOverlay);
    });

document
    .getElementById("btnCloseView")
    .addEventListener("click", () => {
        closeModal(els.viewOverlay);
    });

document
    .getElementById("btnEditFromView")
    .addEventListener("click", () => {
        closeModal(els.viewOverlay);

        if (lastViewedItem) {
            openEditForm(lastViewedItem);
        }
    });

document
    .getElementById("btnCancelDelete")
    .addEventListener("click", () => {
        pendingDeleteId = null;
        closeModal(els.deleteOverlay);
    });

// Close modals by clicking the dark background
[
    els.formOverlay,
    els.viewOverlay,
    els.deleteOverlay
].forEach(overlay => {

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeModal(overlay);
        }
    });
});

// Close modals with Escape
document.addEventListener("keydown", event => {
    if (event.key !== "Escape") {
        return;
    }

    closeModal(els.formOverlay);
    closeModal(els.viewOverlay);
    closeModal(els.deleteOverlay);
});

// Initial page load
loadAllItems();