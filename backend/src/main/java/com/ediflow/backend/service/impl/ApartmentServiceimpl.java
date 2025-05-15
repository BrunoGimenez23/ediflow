package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.ApartmentDTO;
import com.ediflow.backend.dto.BuildingDTO;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.repository.IBuildingRepository;
import com.ediflow.backend.service.IApartmentService;
import com.ediflow.backend.entity.Apartment;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import com.ediflow.backend.repository.IApartmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class ApartmentServiceimpl implements IApartmentService {

    private IApartmentRepository apartmentRepository;

    private IBuildingRepository buildingRepository;

    @Autowired
    public ApartmentServiceimpl(IApartmentRepository apartmentRepository, IBuildingRepository buildingRepository) {
        this.apartmentRepository = apartmentRepository;
        this.buildingRepository = buildingRepository;
    }


    @Override
    @Transactional
    public ResponseEntity<String> createApartment(ApartmentDTO newApartment) {
        if (newApartment.getBuildingDTO() == null || newApartment.getBuildingDTO().getId() == null) {
            return new ResponseEntity<>("Falta ID del edificio", HttpStatus.BAD_REQUEST);
        }

        Optional<Building> buildingOpt = buildingRepository.findById(newApartment.getBuildingDTO().getId());
        if (!buildingOpt.isPresent()) {
            return new ResponseEntity<>("Edificio no encontrado", HttpStatus.NOT_FOUND);
        }

        Building building = buildingOpt.get();

        try {
            Apartment apartment = new Apartment();
            apartment.setNumber(newApartment.getNumber());
            apartment.setFloor(newApartment.getFloor());
            apartment.setBuilding(building);

            apartmentRepository.save(apartment);

            return new ResponseEntity<>("Apartamento creado con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear el apartamento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Optional<Apartment> findById(Long id) {
        return apartmentRepository.findById(id);
    }

    @Override
    public void update(Apartment apartment) {
        apartmentRepository.save(apartment);
    }

    @Override
    public void delete(Long id) {
        apartmentRepository.deleteById(id);
    }

    @Override
    public List<ApartmentDTO> findAll() {
        List<Apartment> apartments = apartmentRepository.findAll();
        List<ApartmentDTO> apartmentsDTO = new ArrayList<>();

        for (Apartment apartment : apartments) {
            ApartmentDTO apartmentDTO = new ApartmentDTO();

            apartmentDTO.setId(apartment.getId());
            apartmentDTO.setNumber(apartment.getNumber());
            apartmentDTO.setFloor(apartment.getFloor());

            if (apartment.getBuilding() != null) {
                BuildingDTO buildingDTO = new BuildingDTO();
                buildingDTO.setId(apartment.getBuilding().getId());
                buildingDTO.setName(apartment.getBuilding().getName());
                buildingDTO.setAddress(apartment.getBuilding().getAddress());

                apartmentDTO.setBuildingDTO(buildingDTO);
            }

            apartmentsDTO.add(apartmentDTO);
        }

        return apartmentsDTO;
    }
}
