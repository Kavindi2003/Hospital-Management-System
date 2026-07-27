package com.hospital.sys.ehr;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService service;

    public MedicalRecordController(MedicalRecordService service) {
        this.service = service;
    }

    // CREATE: POST /api/medical-records
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicalRecord createRecord(@RequestBody MedicalRecord record) {
        return service.createRecord(record);
    }

    // READ ALL: GET /api/medical-records
    @GetMapping
    public List<MedicalRecord> getAllRecords() {
        return service.getAllRecords();
    }

    // READ BY RECORD ID: GET /api/medical-records/{id}
    @GetMapping("/{id}")
    public MedicalRecord getRecordById(@PathVariable Long id) {
        return service.getRecordById(id)
                .orElseThrow(() -> new MedicalRecordNotFoundException(id));
    }

    // READ BY PATIENT ID: GET /api/medical-records/patient/{patientId}
    @GetMapping("/patient/{patientId}")
    public List<MedicalRecord> getRecordsByPatientId(@PathVariable Long patientId) {
        return service.getRecordsByPatientId(patientId);
    }

    // UPDATE: PUT /api/medical-records/{id}
    @PutMapping("/{id}")
    public MedicalRecord updateRecord(@PathVariable Long id, @RequestBody MedicalRecord updatedRecord) {
        return service.updateRecord(id, updatedRecord);
    }

    // DELETE: DELETE /api/medical-records/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecord(@PathVariable Long id) {
        service.deleteRecord(id);
    }
}