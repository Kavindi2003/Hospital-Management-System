-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
                                        patient_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 2. Staff / Doctors Table
CREATE TABLE IF NOT EXISTS staff (
                                     staff_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(30) NOT NULL, -- e.g., 'DOCTOR', 'NURSE', 'RECEPTIONIST'
    specialization VARCHAR(50),
    phone_number VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
                                            appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                            patient_id BIGINT NOT NULL,
                                            doctor_id BIGINT NOT NULL,
                                            appointment_date DATETIME NOT NULL,
                                            status VARCHAR(20) DEFAULT 'SCHEDULED', -- e.g., 'SCHEDULED', 'COMPLETED', 'CANCELLED'
    reason TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES staff(staff_id) ON DELETE CASCADE
    );

-- 4. Electronic Health Records (EHR)
CREATE TABLE IF NOT EXISTS health_records (
                                              record_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              patient_id BIGINT NOT NULL,
                                              doctor_id BIGINT NOT NULL,
                                              diagnosis TEXT NOT NULL,
                                              treatment_plan TEXT,
                                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                              FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES staff(staff_id) ON DELETE CASCADE
    );

-- 5. Wards & Rooms Allocation
CREATE TABLE IF NOT EXISTS wards (
                                     ward_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     ward_name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    occupied_beds INT DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS room_allocations (
                                                allocation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                patient_id BIGINT NOT NULL,
                                                ward_id BIGINT NOT NULL,
                                                bed_number INT NOT NULL,
                                                admission_date DATETIME NOT NULL,
                                                discharge_date DATETIME,
                                                FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id) ON DELETE CASCADE
    );

-- 6. Pharmacy & Inventory Module
CREATE TABLE IF NOT EXISTS inventory_items (
                                               item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    batch_number VARCHAR(50),
    expiration_date DATE
    );

-- 7. Billing Module
CREATE TABLE IF NOT EXISTS bills (
                                     bill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     patient_id BIGINT NOT NULL,
                                     total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'UNPAID', -- e.g., 'UNPAID', 'PAID', 'PARTIAL'
    billing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
    );

-- Users table (login accounts) — added for authentication/authorization.
-- staff_id links a login account to a row in the staff table, so the system
-- can answer "which doctor is this logged-in user" for scoping their view
-- of medical records to only their own patients.
--
-- Nullable: only DOCTOR accounts need this link today (ADMIN/NURSE/
-- RECEPTIONIST accounts leave it NULL).
--
-- ON DELETE SET NULL (not CASCADE): if a staff member is ever removed from
-- the staff table, their login account should NOT be deleted along with
-- them -- just unlinked. Deleting someone's login as a side effect of an
-- unrelated staff-table change would be a surprising, destructive default.
CREATE TABLE IF NOT EXISTS users (
                                     user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,          -- stored as a BCrypt hash, never plain text
    role VARCHAR(20) NOT NULL,               -- one of: ADMIN, DOCTOR, NURSE, RECEPTIONIST
    staff_id BIGINT NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
    );