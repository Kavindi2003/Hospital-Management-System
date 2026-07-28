// ==========================================================================
// ehr.js — Electronic Health Records module
// Talks to /api/medical-records (MedicalRecordController)
// Self-contained: no shared/common JS, per team convention (each module
// stands on its own for viva explainability).
// ==========================================================================

const API_BASE = '/api/medical-records';

const els = {
    recordsBody: document.getElementById('recordsBody'),
    emptyState: document.getElementById('emptyState'),
    loadingBar: document.getElementById('loadingBar'),
    statTotal: document.getElementById('statTotal'),
    statView: document.getElementById('statView'),
    panelTitle: document.getElementById('panelTitle'),
    apiBadge: document.getElementById('apiBadge'),
    formOverlay: document.getElementById('formOverlay'),
    viewOverlay: document.getElementById('viewOverlay'),
    deleteOverlay: document.getElementById('deleteOverlay'),
    recordForm: document.getElementById('recordForm'),
    viewDetails: document.getElementById('viewDetails'),
    toastContainer: document.getElementById('toastContainer'),
};

let pendingDeleteId = null;
let lastViewedRecord = null;
let currentRecords = [];

// ---------- small helpers ----------

function setLoading(on) {
    els.loadingBar.classList.toggle('active', on);
}

function toast(message, type = 'success') {
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.textContent = message;
    els.toastContainer.appendChild(node);
    setTimeout(() => node.remove(), 4500);
}

async function parseErrorResponse(res) {
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        return json.message || json.error || text || res.statusText;
    } catch {
        return text || res.statusText;
    }
}

async function api(path, options = {}) {
    setLoading(true);
    try {
        const res = await fetch(API_BASE + path, {
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            ...options,
        });
        if (res.status === 204) return null;
        if (!res.ok) {
            const msg = await parseErrorResponse(res);
            throw new Error(msg);
        }
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return res.json();
        }
        return null;
    } finally {
        setLoading(false);
    }
}

// Returns a real dash character for empty values — NOT an HTML entity.
// (Passing '&mdash;' through escapeHtml would double-escape it into
// literal visible text "&amp;mdash;" on the page — this avoids that.)
function formatDate(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch {
        return iso;
    }
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Escape a value, or fall back to a plain dash if it's empty —
// fallback is NOT run through escapeHtml since it's already safe plain text.
function displayOr(val, fallback = '—') {
    return val ? escapeHtml(val) : fallback;
}

// ---------- rendering ----------

function renderTable(records) {
    currentRecords = Array.isArray(records) ? records : [records];
    els.recordsBody.innerHTML = '';

    if (!currentRecords.length) {
        els.emptyState.hidden = false;
        els.statTotal.textContent = '0';
        return;
    }

    els.emptyState.hidden = true;
    els.statTotal.textContent = String(currentRecords.length);

    for (const r of currentRecords) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="badge">#${escapeHtml(r.recordId)}</span></td>
            <td>${escapeHtml(r.patientId)}</td>
            <td>${escapeHtml(r.doctorId)}</td>
            <td class="cell-truncate" title="${escapeHtml(r.diagnosis)}">${escapeHtml(r.diagnosis)}</td>
            <td class="cell-truncate" title="${escapeHtml(r.treatmentPlan || '')}">${displayOr(r.treatmentPlan)}</td>
            <td>${displayOr(formatDate(r.createdAt))}</td>
            <td>
                <div class="row-actions">
                    <button type="button" class="btn btn-ghost btn-sm" data-action="view" data-id="${r.recordId}">View</button>
                    <button type="button" class="btn btn-ghost btn-sm" data-action="edit" data-id="${r.recordId}">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${r.recordId}">Delete</button>
                </div>
            </td>
        `;
        els.recordsBody.appendChild(tr);
    }
}

function setViewContext(label, badge) {
    els.statView.textContent = label;
    els.apiBadge.textContent = badge;
    els.panelTitle.textContent = label;
}

// ---------- data loading ----------

async function loadAll() {
    setViewContext('All records', 'GET /api/medical-records');
    try {
        const data = await api('');
        renderTable(data);
        toast('Loaded all medical records');
    } catch (e) {
        toast(e.message, 'error');
        renderTable([]);
    }
}

async function loadByPatient(patientId) {
    setViewContext(`Patient #${patientId}`, `GET /api/medical-records/patient/${patientId}`);
    try {
        const data = await api(`/patient/${patientId}`);
        renderTable(data);
        toast(`Found ${data.length} record(s) for patient ${patientId}`);
    } catch (e) {
        toast(e.message, 'error');
        renderTable([]);
    }
}

async function loadByRecordId(id) {
    setViewContext(`Record #${id}`, `GET /api/medical-records/${id}`);
    try {
        const data = await api(`/${id}`);
        renderTable([data]);
        toast(`Loaded record #${id}`);
    } catch (e) {
        toast(e.message, 'error');
        renderTable([]);
    }
}

// ---------- modals ----------

function openModal(overlay) {
    overlay.classList.add('open');
}

function closeModal(overlay) {
    overlay.classList.remove('open');
}

function openCreateForm() {
    document.getElementById('formModalTitle').textContent = 'New medical record';
    document.getElementById('editRecordId').value = '';
    document.getElementById('patientField').hidden = false;
    document.getElementById('doctorField').hidden = false;
    document.getElementById('patientId').required = true;
    document.getElementById('doctorId').required = true;
    els.recordForm.reset();
    openModal(els.formOverlay);
}

function openEditForm(record) {
    document.getElementById('formModalTitle').textContent = `Edit record #${record.recordId}`;
    document.getElementById('editRecordId').value = record.recordId;
    document.getElementById('patientId').value = record.patientId;
    document.getElementById('doctorId').value = record.doctorId;
    document.getElementById('diagnosis').value = record.diagnosis || '';
    document.getElementById('treatmentPlan').value = record.treatmentPlan || '';
    document.getElementById('patientField').hidden = true;
    document.getElementById('doctorField').hidden = false;
    document.getElementById('patientId').required = false;
    document.getElementById('doctorId').required = false;
    openModal(els.formOverlay);
}

function showRecordDetails(record) {
    lastViewedRecord = record;
    document.getElementById('viewModalTitle').textContent = `Record #${record.recordId}`;
    els.viewDetails.innerHTML = `
        <div><dt>Record ID</dt><dd>${escapeHtml(record.recordId)}</dd></div>
        <div><dt>Patient ID</dt><dd>${escapeHtml(record.patientId)}</dd></div>
        <div><dt>Doctor ID</dt><dd>${escapeHtml(record.doctorId)}</dd></div>
        <div><dt>Diagnosis</dt><dd>${escapeHtml(record.diagnosis)}</dd></div>
        <div><dt>Treatment plan</dt><dd>${displayOr(record.treatmentPlan)}</dd></div>
        <div><dt>Created at</dt><dd>${displayOr(formatDate(record.createdAt))}</dd></div>
    `;
    openModal(els.viewOverlay);
}

function findRecordById(id) {
    return currentRecords.find(r => String(r.recordId) === String(id));
}

// ---------- event wiring ----------

els.recordsBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    let record = findRecordById(id);

    if (action === 'view') {
        if (!record) {
            try {
                record = await api(`/${id}`);
            } catch (err) {
                toast(err.message, 'error');
                return;
            }
        }
        showRecordDetails(record);
        return;
    }

    if (action === 'edit') {
        if (!record) {
            try {
                record = await api(`/${id}`);
            } catch (err) {
                toast(err.message, 'error');
                return;
            }
        }
        openEditForm(record);
        return;
    }

    if (action === 'delete') {
        pendingDeleteId = id;
        document.getElementById('deleteRecordLabel').textContent = `#${id}`;
        openModal(els.deleteOverlay);
    }
});

els.recordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('editRecordId').value;
    const diagnosis = document.getElementById('diagnosis').value.trim();
    const treatmentPlan = document.getElementById('treatmentPlan').value.trim();

    if (!diagnosis) {
        toast('Diagnosis is required', 'error');
        return;
    }

    try {
        if (editId) {
            const body = {
                diagnosis,
                treatmentPlan: treatmentPlan || null,
            };
            const doctorId = document.getElementById('doctorId').value;
            if (doctorId) body.doctorId = Number(doctorId);

            await api(`/${editId}`, { method: 'PUT', body: JSON.stringify(body) });
            toast(`Record #${editId} updated`);
        } else {
            const body = {
                patientId: Number(document.getElementById('patientId').value),
                doctorId: Number(document.getElementById('doctorId').value),
                diagnosis,
                treatmentPlan: treatmentPlan || null,
            };
            await api('', { method: 'POST', body: JSON.stringify(body) });
            toast('Record created', 'success');
        }
        closeModal(els.formOverlay);
        await loadAll();
    } catch (err) {
        toast(err.message, 'error');
    }
});

document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
    if (!pendingDeleteId) return;
    try {
        await api(`/${pendingDeleteId}`, { method: 'DELETE' });
        toast(`Record #${pendingDeleteId} deleted`);
        closeModal(els.deleteOverlay);
        pendingDeleteId = null;
        await loadAll();
    } catch (err) {
        toast(err.message, 'error');
    }
});

document.getElementById('btnNewRecord').addEventListener('click', openCreateForm);
document.getElementById('btnRefresh').addEventListener('click', loadAll);
document.getElementById('btnCancelForm').addEventListener('click', () => closeModal(els.formOverlay));
document.getElementById('btnCloseView').addEventListener('click', () => closeModal(els.viewOverlay));
document.getElementById('btnCancelDelete').addEventListener('click', () => {
    pendingDeleteId = null;
    closeModal(els.deleteOverlay);
});

document.getElementById('btnEditFromView').addEventListener('click', () => {
    closeModal(els.viewOverlay);
    if (lastViewedRecord) openEditForm(lastViewedRecord);
});

document.getElementById('btnLookupRecord').addEventListener('click', () => {
    const id = document.getElementById('filterRecordId').value;
    if (!id) {
        toast('Enter a record ID', 'error');
        return;
    }
    loadByRecordId(id);
});

document.getElementById('btnFilterPatient').addEventListener('click', () => {
    const pid = document.getElementById('filterPatientId').value;
    if (!pid) {
        toast('Enter a patient ID', 'error');
        return;
    }
    loadByPatient(pid);
});

[els.formOverlay, els.viewOverlay, els.deleteOverlay].forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeModal(els.formOverlay);
    closeModal(els.viewOverlay);
    closeModal(els.deleteOverlay);
});

loadAll();