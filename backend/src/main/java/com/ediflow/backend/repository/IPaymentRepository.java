package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByResident_Apartment_Building_Admin_Id(Long adminId);
    List<Payment> findByResident_Id(Long residentId);
}
