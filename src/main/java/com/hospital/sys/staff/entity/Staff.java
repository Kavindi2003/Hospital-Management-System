package com.hospital.sys.staff.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity //tells Spring Boot:"This class represents a table in the database."
@Table(name = "staff")//specifies the database table name

@Getter //Automatically creates getter methods
//EX: getID(), getName(), getEmail()
@Setter //Automatically creates setter methods
//EX: setID(), setName()
@NoArgsConstructor //Creates constructor structure(i.e.without arguments) for the Staff class
@AllArgsConstructor //Create constructor, with arguments
@Builder //Allows to create objects

public class Staff {

    @Id //Marks ID as the primary key.
    @GeneratedValue(strategy = GenerationType.IDENTITY) //MySQL generates IDs automatically.(auto increment)

    @Column(name = "staff_id")
    private Long staffId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String role;

    private String specialization;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String email;
}

