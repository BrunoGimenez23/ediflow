package com.ediflow.backend.service.impl;
import com.ediflow.backend.dto.commonarea.CommonAreaDTO;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.CommonArea;
import com.ediflow.backend.repository.IBuildingRepository;
import com.ediflow.backend.repository.ICommonAreaRepository;
import com.ediflow.backend.service.ICommonAreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommonAreaServiceImpl implements ICommonAreaService {

    @Autowired
    private ICommonAreaRepository commonAreaRepo;

    @Autowired
    private IBuildingRepository buildingRepo;

    @Override
    public CommonAreaDTO create(CommonAreaDTO dto) {
        Building building = buildingRepo.findById(dto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Edificio no encontrado"));

        CommonArea area = CommonArea.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .capacity(dto.getCapacity())
                .building(building)
                .build();

        CommonArea saved = commonAreaRepo.save(area);

        dto.setId(saved.getId());
        return dto;
    }


    public List<CommonAreaDTO> findAllByBuilding(Long buildingId) {
        return commonAreaRepo.findAll().stream()
                .filter(area -> area.getBuilding().getId().equals(buildingId))
                .map(area -> CommonAreaDTO.builder()
                        .id(area.getId())
                        .name(area.getName())
                        .description(area.getDescription())
                        .buildingId(area.getBuilding().getId())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        commonAreaRepo.deleteById(id);
    }

    @Override
    public List<CommonAreaDTO> findAll() {
        List<CommonArea> commonAreas = commonAreaRepo.findAll();

        return commonAreas.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private CommonAreaDTO mapToDTO(CommonArea commonArea) {
        CommonAreaDTO dto = new CommonAreaDTO();
        dto.setId(commonArea.getId());
        dto.setName(commonArea.getName());
        dto.setDescription(commonArea.getDescription());
        dto.setCapacity(commonArea.getCapacity());
        dto.setBuildingId(commonArea.getBuilding().getId()); // agregalo si querés
        return dto;
    }

    @Override
    public CommonAreaDTO findById(Long id) {
        CommonArea commonArea = commonAreaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Common area no encontrada"));
        return mapToDTO(commonArea);
    }

    @Override
    public CommonAreaDTO update(Long id, CommonAreaDTO dto) {
        CommonArea existing = commonAreaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Common area no encontrada"));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setCapacity(dto.getCapacity());


        commonAreaRepo.save(existing);

        return mapToDTO(existing);
    }
}
