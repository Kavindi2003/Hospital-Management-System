-- Sample Wards
INSERT INTO wards (ward_name, capacity, occupied_beds) VALUES ('Emergency Ward', 20, 0);
INSERT INTO wards (ward_name, capacity, occupied_beds) VALUES ('ICU', 10, 0);

-- Insert Patients
INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone_number, email, address)
VALUES ('John', 'Doe', '1990-05-15', 'Male', '1234567890', 'john@example.com', '123 Main St');

-- Insert Staff / Doctors
INSERT INTO staff (first_name, last_name, role, specialization, phone_number, email)
VALUES ('John', 'Doe', 'DOCTOR', 'Cardiology', '1112223333', 'john.doe@hospital.com');

INSERT INTO staff (first_name, last_name, role, specialization, phone_number, email)
VALUES ('Sarah', 'Smith', 'DOCTOR', 'Cardiology', '0987654321', 'dr.smith@hospital.com');

-- Insert Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason)
VALUES (1, 2, '2026-08-10 10:00:00', 'Routine Heart Checkup');

-- Insert Inventory Items
INSERT INTO inventory_items (item_name, category, quantity_in_stock, unit_price, expiration_date)
VALUES ('Amoxicillin 500mg', 'Medicine', 150, 12.50, '2027-12-31');