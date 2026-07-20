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
    category VARCHAR(50) NOT NULL, -- e.g., 'MEDICINE', 'EQUIPMENT'
    quantity_in_stock INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
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