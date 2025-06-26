package com.ediflow.backend.service;

import com.ediflow.backend.dto.commonarea.CommonAreaDTO;
import java.util.List;

public interface ICommonAreaService {
    CommonAreaDTO create(CommonAreaDTO dto);
    CommonAreaDTO update(Long id, CommonAreaDTO dto);
    CommonAreaDTO findById(Long id);
    List<CommonAreaDTO> findAll();
    void delete(Long id);
    List<CommonAreaDTO> findAllByBuilding(Long buildingId);
}
