package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {
    List<Payment> findByResident_Apartment_Building_Admin_Id(Long adminId);
    List<Payment> findByResident_Id(Long residentId);
    @Query(
            value = "SELECT p FROM Payment p " +
                    "JOIN FETCH p.resident r " +
                    "JOIN FETCH r.apartment a " +
                    "JOIN FETCH a.building b " +
                    "WHERE b.admin.id = :adminId",
            countQuery = "SELECT COUNT(p) FROM Payment p " +
                    "JOIN p.resident r " +
                    "JOIN r.apartment a " +
                    "JOIN a.building b " +
                    "WHERE b.admin.id = :adminId"
    )
    Page<Payment> findAllWithJoinsByAdminId(@Param("adminId") Long adminId, org.springframework.data.domain.Pageable pageable);
    Page<Payment> findByResident_Apartment_Building_Admin_Id(Long adminId, Pageable pageable);
    Page<Payment> findByResident_Apartment_Building_Admin_IdAndResident_Apartment_Building_Id(
            Long adminId, Long buildingId, Pageable pageable);

    List<Payment> findByResident_User_AdminAccount_Id(Long adminAccountId);



}
