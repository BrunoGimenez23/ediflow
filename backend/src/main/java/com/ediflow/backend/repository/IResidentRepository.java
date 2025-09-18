package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Apartment;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
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
    List<Resident> findByUser_AdminAccount_Id(Long adminAccountId);
    Page<Resident> findByUser_AdminAccount_Id(Long adminAccountId, Pageable pageable);

    Page<Resident> findByApartmentBuildingId(Long buildingId, Pageable pageable);
    List<Resident> findByUser_AdminAccountIsNull();
    @Query("SELECT r FROM Resident r JOIN FETCH r.apartment a JOIN FETCH a.building WHERE r.user.adminAccount.id = :adminAccountId")
    List<Resident> findByUser_AdminAccount_IdWithApartmentAndBuilding(@Param("adminAccountId") Long adminAccountId);
    Page<Resident> findByUser_AdminAccount_IdAndApartment_Building_Id(Long adminAccountId, Long buildingId, Pageable pageable);

    @Query("SELECT r FROM Resident r " +
            "JOIN FETCH r.apartment a " +
            "JOIN FETCH a.building b " +
            "JOIN FETCH r.user u " +
            "WHERE r.id IN :ids")
    List<Resident> findByIdsWithApartmentBuildingUser(@Param("ids") List<Long> ids);

    Optional<Resident> findByApartment(Apartment apartment);

    @Query("SELECT r.id FROM Resident r " +
            "WHERE r.user.adminAccount.id = :adminAccountId " +
            "AND r.apartment.building.id = :buildingId " +
            "AND r.user.role = 'RESIDENT'")
    Page<Long> findIdsByAdminAccountIdAndBuildingIdAndRoleResident(
            @Param("adminAccountId") Long adminAccountId,
            @Param("buildingId") Long buildingId,
            Pageable pageable);

    @Query("SELECT r.id FROM Resident r " +
            "WHERE r.user.adminAccount.id = :adminAccountId " +
            "AND r.user.role = 'RESIDENT'")
    Page<Long> findIdsByAdminAccountIdAndRoleResident(
            @Param("adminAccountId") Long adminAccountId,
            Pageable pageable);

    @Query("SELECT r.id FROM Resident r " +
            "WHERE r.apartment.building.admin.id = :adminId " +
            "AND r.user.role = 'RESIDENT'")
    Page<Long> findIdsByAdminIdAndRoleResident(
            @Param("adminId") Long adminId,
            Pageable pageable);

    @Query("SELECT r.id FROM Resident r " +
            "WHERE r.apartment.building.admin.id = :adminId " +
            "AND r.apartment.building.id = :buildingId " +
            "AND r.user.role = 'RESIDENT'")
    Page<Long> findIdsByAdminIdAndBuildingIdAndRoleResident(
            @Param("adminId") Long adminId,
            @Param("buildingId") Long buildingId,
            Pageable pageable);

    @Query("SELECT r FROM Resident r " +
            "JOIN FETCH r.user u " +
            "JOIN FETCH r.apartment a " +
            "JOIN FETCH a.building b " +
            "WHERE b.id = :buildingId")
    List<Resident> findByBuildingIdWithUser(@Param("buildingId") Long buildingId);

    List<Resident> findByBuilding(Building building);
    List<Resident> findByBuildingId(Long buildingId);
    boolean existsByUser(User user);



}