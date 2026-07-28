package com.hospital.sys.controller;


import com.hospital.sys.entity.Appointment;
import com.hospital.sys.service.AppointmentService;


import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {



    private final AppointmentService service;



    public AppointmentController(AppointmentService service){

        this.service = service;

    }




// READ

    @GetMapping
    public List<Appointment> getAll(){

        return service.getAll();

    }






// CREATE

    @PostMapping
    public Appointment create(
            @RequestBody Appointment appointment){


        return service.save(appointment);

    }





// UPDATE

    @PutMapping("/{id}")
    public Appointment update(
            @PathVariable Long id,
            @RequestBody Appointment appointment){


        appointment.setAppointmentId(id);


        return service.save(appointment);

    }






// DELETE

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){


        service.delete(id);


        return "Deleted Successfully";

    }





// SEARCH

    @GetMapping("/search")
    public List<Appointment> search(
            @RequestParam String keyword){



        try{


            Long id = Long.parseLong(keyword);


            return service.searchPatient(id);


        }

        catch(Exception e){


            return service.searchReason(keyword);


        }



    }


}