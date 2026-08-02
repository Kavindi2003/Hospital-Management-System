package com.hospital.sys.appointment.controller;

import com.hospital.sys.appointment.entity.Appointment;
import com.hospital.sys.appointment.service.AppointmentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin("*")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    // READ ALL
    @GetMapping
    public List<Appointment> getAll() {
        return service.getAll();
    }

    // CREATE
    @PostMapping
    public Appointment create(@RequestBody Appointment appointment) {
        return service.save(appointment);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id,
                              @RequestBody Appointment appointment) {

        return service.update(id, appointment);

    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        service.delete(id);

        return "Appointment Deleted Successfully";

    }

    // SEARCH
    @GetMapping("/search")
    public List<Appointment> search(@RequestParam String keyword) {

        try {

            Long patientId = Long.parseLong(keyword);

            return service.searchPatient(patientId);

        } catch (NumberFormatException e) {

            return service.searchReason(keyword);

        }

    }

}