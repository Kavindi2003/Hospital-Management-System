package com.hospital.sys.billing;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Long billId;

    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "billing_date")
    private LocalDate billingDate;

    public Bill() {
    }

    public Long getBillId() {
        return billId;
    }

    public void setBillId(Long billId) {
        this.billId = billId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getBillingDate() {
        return billingDate;
    }

    public void setBillingDate(LocalDate billingDate) {
        this.billingDate = billingDate;
    }
}