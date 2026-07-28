package com.hospital.sys.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name="appointments")
public class Appointment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="appointment_id")
    private Long appointmentId;


    @Column(name="patient_id")
    private Long patientId;


    @Column(name="doctor_id")
    private Long doctorId;


    @Column(name="appointment_date")
    private LocalDateTime appointmentDate;


    private String reason;



    public Long getAppointmentId() {
        return appointmentId;
    }


    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }


    public Long getPatientId() {
        return patientId;
    }


    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }


    public Long getDoctorId() {
        return doctorId;
    }


    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }


    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }


    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }


    public String getReason() {
        return reason;
    }


    public void setReason(String reason) {
        this.reason = reason;
    }

}