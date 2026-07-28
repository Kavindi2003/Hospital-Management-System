package com.hospital.sys.appointment.service;

import com.hospital.sys.appointment.entity.Appointment;
import com.hospital.sys.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    // READ ALL
    public List<Appointment> getAll() {
        return repository.findAll();
    }

    // CREATE
    public Appointment save(Appointment appointment) {
        return repository.save(appointment);
    }

    // UPDATE
    public Appointment update(Long id, Appointment appointment) {

        Appointment existing = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Appointment Not Found"));

        existing.setPatientId(appointment.getPatientId());
        existing.setDoctorId(appointment.getDoctorId());
        existing.setAppointmentDate(appointment.getAppointmentDate());
        existing.setReason(appointment.getReason());

        return repository.save(existing);
    }

    // DELETE
    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Appointment Not Found");
        }

        repository.deleteById(id);

    }

    // SEARCH BY PATIENT ID
    public List<Appointment> searchPatient(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    // SEARCH BY REASON
    public List<Appointment> searchReason(String reason) {
        return repository.findByReasonContainingIgnoreCase(reason);
    }

}