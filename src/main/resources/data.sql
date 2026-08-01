-- Sample Wards
INSERT IGNORE INTO wards (ward_name, capacity, occupied_beds) VALUES ('Emergency Ward', 20, 0);
INSERT IGNORE INTO wards (ward_name, capacity, occupied_beds) VALUES ('ICU', 10, 0);

-- Insert Patients
INSERT IGNORE INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address)
VALUES ('John', 'Doe', '1990-05-15', 'Male', '1234567890', 'john@example.com', '123 Main St');

-- Insert Appointments
INSERT IGNORE INTO appointments (patient_id, doctor_id, appointment_date, reason)
VALUES (1, 2, '2026-08-10 10:00:00', 'Routine Heart Checkup');

-- Insert Inventory Items
INSERT IGNORE INTO inventory_items (item_name, category, quantity_in_stock, unit_price, expiration_date,batch_number)
VALUES ('Amoxicillin 500mg', 'Medicine', 150, 12.50, '2027-12-31', 'BATCH-882');

-- ==========================================================================
-- Demo seed data: one login account per role, with DOCTOR/NURSE/RECEPTIONIST
-- linked to a real row in `staff` (so MedicalRecordController's
-- getRecordsForDoctor(doctorStaffId) has something real to filter against).
--
-- Passwords are BCrypt hashes (verified, cost factor 4 -- fine for a demo,
-- Spring Security's BCryptPasswordEncoder reads the cost from the hash
-- itself so this works exactly the same as a higher cost factor):
--   admin      / admin123
--   dr.smith   / doctor123
--   nurse.joy  / nurse123
--   frontdesk  / reception123
--
-- Uses INSERT IGNORE (MySQL) so re-running this on app restart won't throw
-- duplicate-key errors on the fixed IDs below.
-- ==========================================================================

-- Demo staff members (only if your `staff` table is otherwise empty --
-- if your team already has real staff rows, check these IDs (1,2,3) don't
-- collide before running this).
INSERT IGNORE INTO staff (staff_id, first_name, last_name, role, specialization, phone_number, email)
VALUES
    (1, 'John',  'Smith',   'DOCTOR',       'General Medicine', '555-0101', 'dr.smith@hospital.com'),
    (2, 'Joy',   'Martinez','NURSE',        NULL,                '555-0102', 'nurse.joy@hospital.com'),
    (3, 'Alex',  'Reyes',   'RECEPTIONIST', NULL,                '555-0103', 'frontdesk@hospital.com');

-- Login accounts, one per role.
-- staff_id links DOCTOR/NURSE/RECEPTIONIST to the rows above.
-- ADMIN has staff_id = NULL: it's a system account, not a real staff member.
INSERT IGNORE INTO users (user_id, username, password, role, staff_id)
VALUES
    (1, 'admin',     '$2b$04$U/PQ/bZUVaZRBleA4/NZTujXNy0LXNPYEjTXt1yfLJKbL94i9Xxxa', 'ADMIN',        NULL),
    (2, 'dr.smith',  '$2b$04$O3OPBwi9JMezQ1uIAZtKT.q9KtzvTMRfdmMsu41SZKSGkR6uBUgv.', 'DOCTOR',       1),
    (3, 'nurse.joy', '$2b$04$Drg4PTzVzbPbq0IAlo0mmuJ9uywljGpWXRRDxduVab3Jstidkj4k.', 'NURSE',        2),
    (4, 'frontdesk', '$2b$04$/sENjrmAoYvbu2wXF3.02.uPlnhnCGiiGi06DkvvQfCOK1G1s2kmW', 'RECEPTIONIST', 3);