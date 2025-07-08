package com.ediflow.backend.repository;


import com.ediflow.backend.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IBuildingRepository extends JpaRepository<Building, Long> {
    List<Building> findByAdminId(Long adminId);

    List<Building> findByAdmin_User_AdminAccount_Id(Long adminAccountId);
    @Query("""
        select distinct b from Building b
        join b.admin a
        where a.user.adminAccount.id = :adminAccountId
    """)
    List<Building> findBuildingsByAdminAccountId(@Param("adminAccountId") Long adminAccountId);

}
