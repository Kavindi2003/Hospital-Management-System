package com.hospital.sys.service;


import com.hospital.sys.entity.Appointment;
import com.hospital.sys.repository.AppointmentRepository;

import org.springframework.stereotype.Service;


import java.util.List;



@Service
public class AppointmentService {


    private final AppointmentRepository repository;



    public AppointmentService(AppointmentRepository repository){

        this.repository = repository;

    }




// READ

    public List<Appointment> getAll(){

        return repository.findAll();

    }





// CREATE + UPDATE

    public Appointment save(Appointment appointment){

        return repository.save(appointment);

    }





// DELETE

    public void delete(Long id){

        repository.deleteById(id);

    }





// SEARCH

    public List<Appointment> searchPatient(Long id){

        return repository.findByPatientId(id);

    }




    public List<Appointment> searchReason(String reason){

        return repository.findByReasonContainingIgnoreCase(reason);

    }


}