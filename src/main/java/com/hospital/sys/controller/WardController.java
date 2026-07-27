package com.hospital.sys.controller;

import com.hospital.sys.entity.Ward;
import com.hospital.sys.service.WardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wards")
@CrossOrigin(origins = "*")
public class WardController {

    private final WardService wardService;

    public WardController(WardService wardService) {
        this.wardService = wardService;
    }

    @GetMapping
    public List<Ward> getAllWards() {
        return wardService.getAllWards();
    }

    @GetMapping("/{id}")
    public Optional<Ward> getWardById(@PathVariable Long id) {
        return wardService.getWardById(id);
    }

    @PostMapping
    public Ward saveWard(@RequestBody Ward ward) {
        return wardService.saveWard(ward);
    }

    @PutMapping("/{id}")
    public Ward updateWard(@PathVariable Long id, @RequestBody Ward ward) {
        ward.setWardId(id);
        return wardService.saveWard(ward);
    }

    @DeleteMapping("/{id}")
    public void deleteWard(@PathVariable Long id) {
        wardService.deleteWard(id);
    }
}