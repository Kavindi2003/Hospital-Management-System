package com.hospital.sys.ehr;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository repository;

    // Dependency Injection via constructor
    public MedicalRecordService(MedicalRecordRepository repository) {
        this.repository = repository;
    }

    // Create a new medical record
    public MedicalRecord createRecord(MedicalRecord record) {
        return repository.save(record);
    }

    // Get all medical records
    public List<MedicalRecord> getAllRecords() {
        return repository.findAll();
    }

    // Get record by ID
    public Optional<MedicalRecord> getRecordById(Long recordId) {
        return repository.findById(recordId);
    }

    // Get all medical records for a specific patient
    public List<MedicalRecord> getRecordsByPatientId(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    // Update an existing record
    public MedicalRecord updateRecord(Long recordId, MedicalRecord updatedRecord) {
        return repository.findById(recordId)
                .map(existingRecord -> {
                    existingRecord.setDiagnosis(updatedRecord.getDiagnosis());
                    existingRecord.setTreatmentPlan(updatedRecord.getTreatmentPlan());
                    if (updatedRecord.getDoctorId() != null) {
                        existingRecord.setDoctorId(updatedRecord.getDoctorId());
                    }
                    return repository.save(existingRecord);
                })
                .orElseThrow(() -> new MedicalRecordNotFoundException(recordId));
    }

    // Delete a medical record by ID
    public void deleteRecord(Long recordId) {
        if (!repository.existsById(recordId)) {
            throw new MedicalRecordNotFoundException(recordId);
        }
        repository.deleteById(recordId);
    }
}