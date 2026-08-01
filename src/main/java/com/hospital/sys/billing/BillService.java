package com.hospital.sys.billing;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    // Loads the existing bill first, then only overwrites fields that were
    // actually provided in the request — avoids wiping other fields to null
    public Bill updateBill(Long id, Bill updatedBill) {
        Bill existingBill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));

        if (updatedBill.getPatientId() != null) {
            existingBill.setPatientId(updatedBill.getPatientId());
        }
        if (updatedBill.getTotalAmount() != null) {
            existingBill.setTotalAmount(updatedBill.getTotalAmount());
        }
        if (updatedBill.getPaymentStatus() != null) {
            existingBill.setPaymentStatus(updatedBill.getPaymentStatus());
        }
        if (updatedBill.getBillingDate() != null) {
            existingBill.setBillingDate(updatedBill.getBillingDate());
        }

        return billRepository.save(existingBill);
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }
}