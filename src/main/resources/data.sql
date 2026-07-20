-- Sample Wards
INSERT INTO wards (ward_name, capacity, occupied_beds) VALUES ('Emergency Ward', 20, 0);
INSERT INTO wards (ward_name, capacity, occupied_beds) VALUES ('ICU', 10, 0);

-- Sample Staff
INSERT INTO staff (first_name, last_name, role, specialization, email)
VALUES ('John', 'Doe', 'DOCTOR', 'Cardiology', 'john.doe@hospital.com');

-- Insert 1 Patient
INSERT INTO patients (first_name, last_name, dob, gender, phone_number, email, address)
VALUES ('John', 'Doe', '1990-05-15', 'Male', '1234567890', 'john@example.com', '123 Main St');

-- Insert 1 Doctor
INSERT INTO staff (first_name, last_name, role, specialization, phone_number, email)
VALUES ('Sarah', 'Smith', 'DOCTOR', 'Cardiology', '0987654321', 'dr.smith@hospital.com');

-- Insert 1 Appointment
INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason_for_visit)
VALUES (1, 1, '2026-08-10 10:00:00', 'Routine Heart Checkup');

-- Insert 1 Item in Inventory
INSERT INTO inventory (item_name, category, quantity, unit_price, expiry_date, batch_number)
VALUES ('Amoxicillin 500mg', 'Medicine', 150, 12.50, '2027-12-31', 'BATCH-882');