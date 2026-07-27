package com.hospital.sys.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "wards")
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ward_id")
    private Long wardId;

    @Column(name = "ward_name")
    private String wardName;

    @Column(name = "capacity")
    private int capacity;

    @Column(name = "occupied_beds")
    private int occupiedBeds;

    public Ward() {
    }

    public Long getWardId() {
        return wardId;
    }

    public void setWardId(Long wardId) {
        this.wardId = wardId;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getOccupiedBeds() {
        return occupiedBeds;
    }

    public void setOccupiedBeds(int occupiedBeds) {
        this.occupiedBeds = occupiedBeds;
    }
}