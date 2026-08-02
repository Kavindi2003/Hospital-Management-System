-- ==========================================================================
-- 1. Staff Members (Must be inserted before users & appointments)
-- ==========================================================================
INSERT IGNORE INTO staff (staff_id, first_name, last_name, role, specialization, phone_number, email)
VALUES
    (1, 'John',  'Smith',   'DOCTOR',       'General Medicine', '555-0101', 'dr.smith@hospital.com'),
    (2, 'Joy',   'Martinez','NURSE',        NULL,                '555-0102', 'nurse.joy@hospital.com'),
    (3, 'Alex',  'Reyes',   'RECEPTIONIST', NULL,                '555-0103', 'frontdesk@hospital.com');

-- ==========================================================================
-- 2. Login Accounts (References staff_id)
-- ==========================================================================
INSERT IGNORE INTO users (user_id, username, password, role, staff_id)
VALUES
    (1, 'admin',     '$2b$04$U/PQ/bZUVaZRBleA4/NZTujXNy0LXNPYEjTXt1yfLJKbL94i9Xxxa', 'ADMIN',        NULL),
    (2, 'dr.smith',  '$2b$04$O3OPBwi9JMezQ1uIAZtKT.q9KtzvTMRfdmMsu41SZKSGkR6uBUgv.', 'DOCTOR',       1),
    (3, 'nurse.joy', '$2b$04$Drg4PTzVzbPbq0IAlo0mmuJ9uywljGpWXRRDxduVab3Jstidkj4k.', 'NURSE',        2),
    (4, 'frontdesk', '$2b$04$/sENjrmAoYvbu2wXF3.02.uPlnhnCGiiGi06DkvvQfCOK1G1s2kmW', 'RECEPTIONIST', 3);

-- ==========================================================================
-- 3. Patients (Explicitly setting patient_id = 1 for accurate FK referencing)
-- ==========================================================================
INSERT IGNORE INTO patients (patient_id, first_name, last_name, date_of_birth, age, gender, blood_group, phone_number, email, address)
VALUES (1, 'John', 'Doe', '1990-05-15', 35, 'Male', 'O-', '1234567890', 'john@example.com', '123 Main St');

-- ==========================================================================
-- 4. Appointments (References patient_id = 1 and doctor_id = 1 [Dr. John Smith])
-- ==========================================================================
INSERT IGNORE INTO appointments (patient_id, doctor_id, appointment_date, status, reason)
VALUES (1, 1, '2026-08-10 10:00:00', 'SCHEDULED', 'Routine Heart Checkup');

-- ==========================================================================
-- 5. Wards
-- ==========================================================================
INSERT IGNORE INTO wards (ward_name, capacity, occupied_beds) VALUES ('Emergency Ward', 20, 0);
INSERT IGNORE INTO wards (ward_name, capacity, occupied_beds) VALUES ('ICU', 10, 0);

-- ==========================================================================
-- 6. Inventory Items
-- ==========================================================================
INSERT IGNORE INTO inventory_items (item_name, category, quantity_in_stock, unit_price, expiration_date, batch_number)
VALUES ('Amoxicillin 500mg', 'Medicine', 150, 12.50, '2027-12-31', 'BATCH-882');