package com.hospital.sys.ehr;

import com.hospital.sys.auth.entity.User;
import com.hospital.sys.auth.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService service;
    private final UserRepository userRepository;

    public MedicalRecordController(MedicalRecordService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    // CREATE: POST /api/medical-records
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicalRecord createRecord(@RequestBody MedicalRecord record) {
        return service.createRecord(record);
    }

    // READ ALL: GET /api/medical-records
    // ADMIN sees every record. A logged-in DOCTOR only sees records where
    // they are the doctor -- looked up via their linked staffId on their
    // User account (see AuthController/User.staffId). If a DOCTOR account
    // has no staffId linked yet, they see nothing rather than everything,
    // since showing all records would defeat the point of this restriction.
    @GetMapping
    public List<MedicalRecord> getAllRecords(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return service.getAllRecords();
        }

        Long doctorStaffId = userRepository.findByUsername(authentication.getName())
                .map(User::getStaffId)
                .orElse(null);

        if (doctorStaffId == null) {
            return List.of(); // no linked staff record -> nothing to show
        }

        return service.getRecordsForDoctor(doctorStaffId);
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