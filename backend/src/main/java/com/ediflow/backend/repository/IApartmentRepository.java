package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Apartment;
import com.ediflow.backend.entity.Resident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IApartmentRepository extends JpaRepository<Apartment, Long> {
    List<Apartment> findByBuildingId(Long id);
    List<Apartment> findByBuilding_Admin_Id(Long adminId);

    List<Apartment> findByResident(Resident resident);

    List<Apartment> findByResident_User_Email(String email);
    List<Apartment> findByBuilding_Admin_User_AdminAccount_Id(Long adminAccountId);

    @Query("SELECT a FROM Apartment a " +
            "JOIN a.building b " +
            "JOIN b.admin ad " +
            "JOIN ad.user u " +
            "WHERE u.adminAccount.id = :adminAccountId")
    List<Apartment> findByAdminAccountId(@Param("adminAccountId") Long adminAccountId);
    @Query(value = "SELECT DISTINCT a FROM Apartment a " +
            "LEFT JOIN FETCH a.resident r " +
            "LEFT JOIN FETCH r.user ru " +
            "LEFT JOIN FETCH a.building b " +
            "JOIN b.admin ad " +
            "JOIN ad.user u " +
            "WHERE u.email = :email AND (" +
            "CAST(a.number AS string) LIKE %:filter% OR " +
            "CAST(a.floor AS string) LIKE %:filter%)",
            countQuery = "SELECT COUNT(a) FROM Apartment a " +
                    "JOIN a.building b " +
                    "JOIN b.admin ad " +
                    "JOIN ad.user u " +
                    "WHERE u.email = :email AND (" +
                    "CAST(a.number AS string) LIKE %:filter% OR " +
                    "CAST(a.floor AS string) LIKE %:filter%)")
    Page<Apartment> findByUserAndFilter(@Param("email") String email, @Param("filter") String filter, Pageable pageable);


    @Query("SELECT DISTINCT a FROM Apartment a " +
            "LEFT JOIN FETCH a.resident r " +
            "LEFT JOIN FETCH a.building b " +
            "WHERE b.admin.user.adminAccount.id = :adminAccountId")
    List<Apartment> findByAdminAccountIdWithResidentAndBuilding(@Param("adminAccountId") Long adminAccountId);

    @Query(value = "SELECT DISTINCT a FROM Apartment a " +
            "LEFT JOIN FETCH a.resident r " +
            "LEFT JOIN FETCH r.user ru " +
            "LEFT JOIN FETCH a.building b " +
            "JOIN b.admin ad " +
            "JOIN ad.user u " +
            "WHERE u.adminAccount.id = :adminAccountId AND (" +
            "CAST(a.number AS string) LIKE %:filter% OR " +
            "CAST(a.floor AS string) LIKE %:filter%)",
            countQuery = "SELECT COUNT(a) FROM Apartment a " +
                    "JOIN a.building b " +
                    "JOIN b.admin ad " +
                    "JOIN ad.user u " +
                    "WHERE u.adminAccount.id = :adminAccountId AND (" +
                    "CAST(a.number AS string) LIKE %:filter% OR " +
                    "CAST(a.floor AS string) LIKE %:filter%)")
    Page<Apartment> findByAdminAccountIdAndFilter(@Param("adminAccountId") Long adminAccountId,
                                                  @Param("filter") String filter,
                                                  Pageable pageable);

    @Query(value = "SELECT DISTINCT a FROM Apartment a " +
            "LEFT JOIN FETCH a.resident r " +
            "LEFT JOIN FETCH r.user ru " +
            "LEFT JOIN FETCH a.building b " +
            "JOIN b.admin ad " +
            "JOIN ad.user u " +
            "WHERE u.adminAccount.id = :adminAccountId " +
            "AND b.id = :buildingId " +
            "AND (CAST(a.number AS string) LIKE %:filter% OR " +
            "CAST(a.floor AS string) LIKE %:filter%)",
            countQuery = "SELECT COUNT(a) FROM Apartment a " +
                    "JOIN a.building b " +
                    "JOIN b.admin ad " +
                    "JOIN ad.user u " +
                    "WHERE u.adminAccount.id = :adminAccountId " +
                    "AND b.id = :buildingId " +
                    "AND (CAST(a.number AS string) LIKE %:filter% OR " +
                    "CAST(a.floor AS string) LIKE %:filter%)")
    Page<Apartment> findByAdminAccountIdAndBuildingIdAndFilter(
            @Param("adminAccountId") Long adminAccountId,
            @Param("buildingId") Long buildingId,
            @Param("filter") String filter,
            Pageable pageable
    );
}
