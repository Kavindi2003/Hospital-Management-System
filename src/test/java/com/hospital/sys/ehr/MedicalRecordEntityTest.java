package com.hospital.sys.ehr;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MedicalRecordEntityTest {

    @Test
    @DisplayName("Should correctly instantiate MedicalRecord and verify getters/setters")
    public void testMedicalRecordEntity() {
        // Arrange
        MedicalRecord record = new MedicalRecord(
                101L,
                202L,
                "Acute Bronchitis",
                "Rest and fluids"
        );
        record.setRecordId(1L);

        // Assert
        assertEquals(1L, record.getRecordId());
        assertEquals(101L, record.getPatientId());
        assertEquals(202L, record.getDoctorId());
        assertEquals("Acute Bronchitis", record.getDiagnosis());
        assertEquals("Rest and fluids", record.getTreatmentPlan());
    }

    @Test
    @DisplayName("Should trigger @PrePersist logic correctly")
    public void testPrePersist() {
        MedicalRecord record = new MedicalRecord();
        assertNull(record.getCreatedAt());

        // Simulate JPA @PrePersist lifecycle event
        record.onCreate();

        assertNotNull(record.getCreatedAt());
    }
}