package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.ResidentDTO;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

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

        if (newResident.getUserDTO().getRole() == null) {
            return new ResponseEntity<>("El campo role es obligatorio", HttpStatus.BAD_REQUEST);
        }

        try {
            // Asegurarse de que el role recibido sea un valor válido del enum
            user.setRole(newResident.getUserDTO().getRole());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Valor de role inválido", HttpStatus.BAD_REQUEST);
        }

        Resident resident = new Resident();
        resident.setUser(user);
        resident.setCi(newResident.getCi());

        try {
            // Guardar el User y el Resident
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
            if (resident.getUser() != null) {

                UserDTO userDTO = new UserDTO(
                        resident.getUser().getId(),
                        resident.getUser().getUsername(),
                        resident.getUser().getEmail(),
                        resident.getUser().getRole()
                );

                ResidentDTO residentDTO = new ResidentDTO();
                residentDTO.setCi(resident.getCi());
                residentDTO.setUserDTO(userDTO);

                residentDTOS.add(residentDTO);


            }
        }
        return residentDTOS;
    }
}
