package com.ediflow.backend.repository;

import com.ediflow.backend.entity.CommonArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICommonAreaRepository extends JpaRepository<CommonArea, Long> {

    List<CommonArea> findByBuildingId(Long buildingId);
    List<CommonArea> findByBuilding_Admin_User_AdminAccount_Id(Long adminAccountId);
    List<CommonArea> findByBuilding_Admin_Id(Long adminId);

}

