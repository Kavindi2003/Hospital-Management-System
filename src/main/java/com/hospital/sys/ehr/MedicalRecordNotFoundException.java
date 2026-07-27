package com.hospital.sys.ehr;

// Thrown when a medical record cannot be found for a given ID.
// Kept separate from generic RuntimeException so the exception handler
// can return the correct HTTP status (404) without accidentally catching
// unrelated errors like DB validation failures (which should be 400/500).
public class MedicalRecordNotFoundException extends RuntimeException {

    public MedicalRecordNotFoundException(Long id) {
        super("Medical record not found with id: " + id);
    }

    public MedicalRecordNotFoundException(String message) {
        super(message);
    }
}