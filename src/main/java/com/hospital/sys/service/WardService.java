package com.hospital.sys.service;

import com.hospital.sys.entity.Ward;
import com.hospital.sys.repository.WardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WardService {

    private final WardRepository wardRepository;

    public WardService(WardRepository wardRepository) {
        this.wardRepository = wardRepository;
    }

    public List<Ward> getAllWards() {
        return wardRepository.findAll();
    }

    public Optional<Ward> getWardById(Long id) {
        return wardRepository.findById(id);
    }

    public Ward saveWard(Ward ward) {
        return wardRepository.save(ward);
    }

    public void deleteWard(Long id) {
        wardRepository.deleteById(id);
    }
}