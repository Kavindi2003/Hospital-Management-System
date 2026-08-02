package com.hospital.sys.appointment.repository;

import com.hospital.sys.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByReasonContainingIgnoreCase(String reason);

}