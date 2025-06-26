package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IResidentRepository extends JpaRepository<Resident, Long> {


    boolean existsByCi(Long ci);
    List<Resident> findByApartment_Building_Admin_Id(Long adminId);

    Optional<Resident> findByApartmentId(Long apartmentId);
    @Query("SELECT r FROM Resident r JOIN FETCH r.apartment a JOIN FETCH a.building WHERE r.user.email = :email")
    Optional<Resident> findByUserEmailWithApartmentAndBuilding(@Param("email") String email);

    Optional<Resident> findByUserEmail(String email);
    Optional<Resident> findByUserId(Long userId);
}
