package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
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
        if (buildingOpt.isEmpty()) {
            return new ResponseEntity<>("Edificio no encontrado", HttpStatus.NOT_FOUND);
        }

        Building building = buildingOpt.get();

        Apartment apartment = new Apartment();
        apartment.setNumber(newApartment.getNumber());
        apartment.setFloor(newApartment.getFloor());
        apartment.setBuilding(building);

        apartmentRepository.save(apartment);

        return new ResponseEntity<>("Apartamento creado con éxito", HttpStatus.CREATED);
    }

    @Override
    public Optional<Apartment> findById(Long id) {
        return apartmentRepository.findById(id);
    }

    @Override
    public ResponseEntity<String> updateApartment(Long id, ApartmentDTO apartmentDTO) {
        if (apartmentDTO == null) {
            return new ResponseEntity<>("Datos del apartamento requeridos", HttpStatus.BAD_REQUEST);
        }

        Optional<Apartment> optionalApartment = apartmentRepository.findById(id);

        if (optionalApartment.isEmpty()) {
            return new ResponseEntity<>("Apartamento no encontrado", HttpStatus.BAD_REQUEST);
        }

        Apartment apartment = optionalApartment.get();

        if (apartmentDTO.getNumber() != null) {
            apartment.setNumber(apartmentDTO.getNumber());
        }

        if (apartmentDTO.getFloor() != null) {
            apartment.setFloor(apartmentDTO.getFloor());
        }

        try {
            apartmentRepository.save(apartment);
            return new ResponseEntity<>("Apartamento actualizado correctamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar el apartamento: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> deleteApartment(Long id) {
        if (!apartmentRepository.existsById(id)){
            return new ResponseEntity<>("Apartamento no encontrado",HttpStatus.BAD_REQUEST);
        }
        apartmentRepository.deleteById(id);
        return new ResponseEntity<>("Apartamento eliminado correctamente",HttpStatus.OK);
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

    @Override
    public List<ApartmentSummaryDTO> findByBuildingId(Long id) {
       List<Apartment> apartments = apartmentRepository.findByBuildingId(id);
       List<ApartmentSummaryDTO> apartamentsDTO = new ArrayList<>();

       for (Apartment apartment : apartments){
           ApartmentSummaryDTO dto = new ApartmentSummaryDTO();

           dto.setId(apartment.getId());
           dto.setNumber(apartment.getNumber());
           dto.setFloor(apartment.getFloor());

           apartamentsDTO.add(dto);
       }
       return apartamentsDTO;
    }
}
