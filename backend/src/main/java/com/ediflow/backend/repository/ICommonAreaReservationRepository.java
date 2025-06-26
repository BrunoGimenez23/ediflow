package com.ediflow.backend.repository;

import com.ediflow.backend.entity.CommonAreaReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ICommonAreaReservationRepository extends JpaRepository<CommonAreaReservation, Long> {


    List<CommonAreaReservation> findByCommonAreaId(Long commonAreaId);
    List<CommonAreaReservation> findByCommonAreaIdAndDate(Long commonAreaId, LocalDate date);
    List<CommonAreaReservation> findByResidentId(Long residentId);
}
