package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Apartment;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.repository.IApartmentRepository;
import com.ediflow.backend.repository.IBuildingRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IResidentService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class ResidentServiceimpl implements IResidentService {
    private IUserRepository userRepository;
    private IResidentRepository residentRepository;
    private IApartmentRepository apartmentRepository;
    private IBuildingRepository buildingRepository;

    public ResidentServiceimpl(IUserRepository userRepository, IResidentRepository residentRepository, IApartmentRepository apartmentRepository, IBuildingRepository buildingRepository) {
        this.userRepository = userRepository;
        this.residentRepository = residentRepository;
        this.apartmentRepository = apartmentRepository;
        this.buildingRepository = buildingRepository;
    }

    @Override
    public ResponseEntity<String> createResident(ResidentDTO newResident) {
        if (residentRepository.existsByCi(newResident.getCi())) {
            return new ResponseEntity<>("El residente ya existe", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(newResident.getUserDTO().getUsername());
        user.setEmail(newResident.getUserDTO().getEmail());
        user.setPassword(newResident.getUserDTO().getPassword());

        if (newResident.getUserDTO().getRole() == null) {
            return new ResponseEntity<>("El campo role es obligatorio", HttpStatus.BAD_REQUEST);
        }

        try {
            user.setRole(newResident.getUserDTO().getRole());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Valor de role inválido", HttpStatus.BAD_REQUEST);
        }

        Resident resident = new Resident();
        resident.setUser(user);
        resident.setCi(newResident.getCi());

        // ✅ Vincular departamento y edificio si vienen en el DTO
        if (newResident.getApartmentDTO() != null && newResident.getApartmentDTO().getId() != null) {
            Optional<Apartment> apartmentOptional = apartmentRepository.findById(newResident.getApartmentDTO().getId());
            if (apartmentOptional.isPresent()) {
                Apartment apartment = apartmentOptional.get();
                resident.setApartment(apartment);
                resident.setBuilding(apartment.getBuilding());
            } else {
                return new ResponseEntity<>("Apartamento no encontrado", HttpStatus.BAD_REQUEST);
            }
        }

        try {
            userRepository.save(user);
            residentRepository.save(resident);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear el residente: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("Residente creado", HttpStatus.OK);
    }

    @Override
    public Optional<Resident> findById(Long id) {
        return residentRepository.findById(id);
    }



    @Override
    @Transactional
    public ResponseEntity<String> updateResident(Long id, ResidentDTO residentDTO) {
        Optional<Resident> optionalResident = residentRepository.findById(id);
        if (optionalResident.isEmpty()) {
            return ResponseEntity.badRequest().body("Residente no encontrado");
        }

        Resident resident = optionalResident.get();

        if (residentDTO.getCi() != null) {
            resident.setCi(residentDTO.getCi());
        }

        if (residentDTO.getUserDTO() != null && residentDTO.getUserDTO().getId() != null) {
            Optional<User> optionalUser = userRepository.findById(residentDTO.getUserDTO().getId());
            if (optionalUser.isPresent()) {
                resident.setUser(optionalUser.get());
            } else {
                return ResponseEntity.badRequest().body("Usuario con ID " + residentDTO.getUserDTO().getId() + " no encontrado");
            }
        }

        if (residentDTO.getBuildingDTO() != null && residentDTO.getBuildingDTO().getId() != null) {
            Optional<Building> optionalBuilding = buildingRepository.findById(residentDTO.getBuildingDTO().getId());
            if (optionalBuilding.isPresent()) {
                resident.setBuilding(optionalBuilding.get());
            } else {
                return ResponseEntity.badRequest().body("Edificio con ID " + residentDTO.getBuildingDTO().getId() + " no encontrado");
            }
        }

        if (residentDTO.getApartmentDTO() != null && residentDTO.getApartmentDTO().getId() != null) {
            Optional<Apartment> optionalApartment = apartmentRepository.findById(residentDTO.getApartmentDTO().getId());
            if (optionalApartment.isPresent()) {
                resident.setApartment(optionalApartment.get());
            } else {
                return ResponseEntity.badRequest().body("Apartamento con ID " + residentDTO.getApartmentDTO().getId() + " no encontrado");
            }
        }

        try {
            residentRepository.save(resident);
            return ResponseEntity.ok("El Residente se actualizó correctamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar el residente: " + e.getMessage());
        }

    }


    @Override
    public ResponseEntity<String> deleteResident(Long id) {
        boolean residentExist = residentRepository.findById(id).isPresent();
        if (residentExist) {
            residentRepository.deleteById(id);
            return new ResponseEntity<>("Residente eliminado correctamente",HttpStatus.OK);
        } else {

                return new ResponseEntity<>("Residente no encontrado",HttpStatus.BAD_REQUEST);
        }

    }

    @Override
    public List<ResidentDTO> findAll() {
        List<Resident> residents = residentRepository.findAll();
        List<ResidentDTO> residentDTOS = new ArrayList<>();

        for (Resident resident : residents) {
            if (resident.getUser() == null) continue; // Si no tiene usuario, lo saltamos

            // Crear UserDTO
            User user = resident.getUser();
            UserDTO userDTO = new UserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole()
            );

            // Crear ResidentDTO base
            ResidentDTO residentDTO = new ResidentDTO();
            residentDTO.setId(resident.getId());
            residentDTO.setCi(resident.getCi());
            residentDTO.setUserDTO(userDTO);

            // Obtener apartment y armar ApartmentDTO si existe
            Apartment apartment = resident.getApartment();
            if (apartment != null) {
                ApartmentDTO apartmentDTO = new ApartmentDTO();
                apartmentDTO.setId(apartment.getId());
                apartmentDTO.setNumber(apartment.getNumber());
                apartmentDTO.setFloor(apartment.getFloor());
                residentDTO.setApartmentDTO(apartmentDTO);

                // Obtener building desde apartment y armar BuildingDTO si existe
                Building building = apartment.getBuilding();
                if (building != null) {
                    BuildingDTO buildingDTO = new BuildingDTO();
                    buildingDTO.setId(building.getId());
                    buildingDTO.setName(building.getName());
                    buildingDTO.setAddress(building.getAddress());
                    residentDTO.setBuildingDTO(buildingDTO);
                }
            }

            residentDTOS.add(residentDTO);
        }

        return residentDTOS;
    }
}
