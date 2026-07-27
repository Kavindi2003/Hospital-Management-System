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

    public Bill updateBill(Long id, Bill updatedBill) {
        updatedBill.setBillId(id);
        return billRepository.save(updatedBill);
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }
}