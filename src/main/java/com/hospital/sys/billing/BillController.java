package com.hospital.sys.billing;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    // Get all bills
    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    // Get bill by ID
    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        return billService.getBillById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new bill
    @PostMapping
    public Bill createBill(@RequestBody Bill bill) {
        return billService.saveBill(bill);
    }

    // Update a bill
    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id,
                                           @RequestBody Bill bill) {
        if (billService.getBillById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Bill updatedBill = billService.updateBill(id, bill);
        return ResponseEntity.ok(updatedBill);
    }

    // Delete a bill
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        if (billService.getBillById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        billService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }
}