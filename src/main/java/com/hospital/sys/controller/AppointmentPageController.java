package com.hospital.sys.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;



@Controller
public class AppointmentPageController {



    @GetMapping("/appointments")
    public String page(){

        return "forward:/pages/appointment.html";

    }


}