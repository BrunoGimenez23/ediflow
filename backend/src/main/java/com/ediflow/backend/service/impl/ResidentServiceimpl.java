package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Apartment;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.repository.IApartmentRepository;
import com.ediflow.backend.repository.IBuildingRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.IResidentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResidentServiceimpl implements IResidentService {
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IResidentRepository residentRepository;
    @Autowired
    private IApartmentRepository apartmentRepository;
    @Autowired
    private IBuildingRepository buildingRepository;
    @Autowired
    private IAdminService adminService;



    private final PasswordEncoder passwordEncoder;

    public ResidentServiceimpl(IUserRepository userRepository, IResidentRepository residentRepository, IApartmentRepository apartmentRepository, IBuildingRepository buildingRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.residentRepository = residentRepository;
        this.apartmentRepository = apartmentRepository;
        this.buildingRepository = buildingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ResponseEntity<Map<String, String>> createResident(ResidentDTO newResident) {
        // Validaciones básicas
        if (newResident == null || newResident.getUserDTO() == null) {
            return new ResponseEntity<>(Map.of("error", "Datos del usuario requeridos"), HttpStatus.BAD_REQUEST);
        }

        if (newResident.getCi() == null) {
            return new ResponseEntity<>(Map.of("error", "El CI es obligatorio"), HttpStatus.BAD_REQUEST);
        }

        if (residentRepository.existsByCi(newResident.getCi())) {
            return new ResponseEntity<>(Map.of("error", "El residente con ese CI ya existe"), HttpStatus.BAD_REQUEST);
        }

        String username = newResident.getUserDTO().getUsername();
        if (username == null || username.isBlank()) {
            return new ResponseEntity<>(Map.of("error", "El username es obligatorio"), HttpStatus.BAD_REQUEST);
        }

        String email = newResident.getUserDTO().getEmail();
        if (email == null || email.isBlank()) {
            return new ResponseEntity<>(Map.of("error", "El email es obligatorio"), HttpStatus.BAD_REQUEST);
        }

        String password = newResident.getUserDTO().getPassword();
        if (password == null || password.isBlank()) {
            return new ResponseEntity<>(Map.of("error", "La contraseña es obligatoria"), HttpStatus.BAD_REQUEST);
        }

        if (newResident.getUserDTO().getRole() == null) {
            return new ResponseEntity<>(Map.of("error", "El campo role es obligatorio"), HttpStatus.BAD_REQUEST);
        }

        // Validaciones por duplicados en User
        if (userRepository.existsByUsername(username)) {
            return new ResponseEntity<>(Map.of("error", "El username ya está en uso"), HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(email)) {
            return new ResponseEntity<>(Map.of("error", "El email ya está registrado"), HttpStatus.BAD_REQUEST);
        }

        // Crear entidad User
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password); // podés hashearla si aún no lo hacés
        user.setRole(newResident.getUserDTO().getRole());
        user.setFullName(
                newResident.getUserDTO().getFullName() != null && !newResident.getUserDTO().getFullName().isBlank()
                        ? newResident.getUserDTO().getFullName()
                        : username
        );

        // Crear Resident
        Resident resident = new Resident();
        resident.setUser(user);
        resident.setCi(newResident.getCi());

        if (newResident.getApartmentId() != null) {
            Optional<Apartment> apartmentOptional = apartmentRepository.findById(newResident.getApartmentId());
            if (apartmentOptional.isEmpty()) {
                return new ResponseEntity<>(Map.of("error", "Apartamento no encontrado"), HttpStatus.BAD_REQUEST);
            }
            Apartment apartment = apartmentOptional.get();
            resident.setApartment(apartment);
            resident.setBuilding(apartment.getBuilding());
        }

        try {
            residentRepository.save(resident);
            return new ResponseEntity<>(Map.of("message", "Residente creado exitosamente"), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Error al crear el residente: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public Optional<Resident> findById(Long id) {
        return residentRepository.findById(id);
    }

    @Transactional
    public ResidentDTO createOrReplaceResident(ResidentDTO residentDTO) {
        Long apartmentId = residentDTO.getApartmentId();

        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException("Apartamento no encontrado"));

        // Si ya hay un residente, eliminarlo junto a su usuario
        Resident existingResident = residentRepository.findByApartmentId(apartmentId).orElse(null);
        if (existingResident != null) {
            residentRepository.delete(existingResident);
            userRepository.delete(existingResident.getUser());
        }

        // Crear nuevo usuario
        UserDTO userDTO = residentDTO.getUserDTO();
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFullName(userDTO.getFullName());
        user.setRole(Role.RESIDENT);
        userRepository.save(user);

        // Crear nuevo residente
        Resident newResident = new Resident();
        newResident.setCi(residentDTO.getCi());
        newResident.setUser(user);
        newResident.setApartment(apartment);
        residentRepository.save(newResident);

        // Mapear manualmente Resident a ResidentDTO para retornar
        return mapToDTO(newResident);
    }

    // Método privado para mapear Resident a ResidentDTO
    private ResidentDTO mapToDTO(Resident resident) {
        ResidentDTO dto = new ResidentDTO();
        dto.setCi(resident.getCi());
        dto.setApartmentId(resident.getApartment().getId());

        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(resident.getUser().getUsername());
        userDTO.setEmail(resident.getUser().getEmail());
        userDTO.setFullName(resident.getUser().getFullName());
        userDTO.setRole(resident.getUser().getRole());
        // No seteamos password por seguridad

        dto.setUserDTO(userDTO);

        return dto;
    }

    public ResidentDTO findByUserEmail(String email) {
        Resident resident = residentRepository.findByUserEmailWithApartmentAndBuilding(email)
                .orElseThrow(() -> new UsernameNotFoundException("Residente no encontrado"));

        ResidentDTO dto = new ResidentDTO();
        dto.setId(resident.getId());
        dto.setCi(resident.getCi());

        // Mapeo del apartamento y edificio
        if (resident.getApartment() != null) {
            ApartmentDTO apartmentDTO = new ApartmentDTO();
            apartmentDTO.setId(resident.getApartment().getId());
            apartmentDTO.setNumber(resident.getApartment().getNumber());
            apartmentDTO.setFloor(resident.getApartment().getFloor());

            if (resident.getApartment().getBuilding() != null) {
                BuildingDTO buildingDTO = new BuildingDTO();
                buildingDTO.setId(resident.getApartment().getBuilding().getId());
                buildingDTO.setName(resident.getApartment().getBuilding().getName());
                buildingDTO.setAddress(resident.getApartment().getBuilding().getAddress());
                apartmentDTO.setBuildingDTO(buildingDTO);
            }

            dto.setApartmentDTO(apartmentDTO);
        }

        // Mapeo del usuario
        if (resident.getUser() != null) {
            if (dto.getUserDTO() == null) {
                dto.setUserDTO(new UserDTO());
            }
            dto.getUserDTO().setFullName(resident.getUser().getFullName());
            dto.getUserDTO().setEmail(resident.getUser().getEmail());
        }

        // ✅ Mapeo de pagos
        if (resident.getPayment() != null && !resident.getPayment().isEmpty()) {
            List<PaymentDTO> paymentDTOs = resident.getPayment().stream().map(payment -> {
                PaymentDTO pdto = new PaymentDTO();
                pdto.setId(payment.getId());
                pdto.setAmount(payment.getAmount());
                pdto.setIssueDate(payment.getIssueDate());
                pdto.setDueDate(payment.getDueDate());
                pdto.setPaymentDate(payment.getPaymentDate());
                pdto.setStatus(payment.getStatus());
                return pdto;
            }).collect(Collectors.toList());

            dto.setPayment(paymentDTOs);
        }

        return dto;
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
                User user = optionalUser.get();

                // Actualizar campos
                if (residentDTO.getUserDTO().getEmail() != null) {
                    user.setEmail(residentDTO.getUserDTO().getEmail());
                }
                if (residentDTO.getUserDTO().getUsername() != null) {
                    user.setUsername(residentDTO.getUserDTO().getUsername());
                }
                if (residentDTO.getUserDTO().getFullName() != null) {
                    user.setFullName(residentDTO.getUserDTO().getFullName());
                }
                // Si querés actualizar password o rol, hacelo aquí también

                userRepository.save(user); // Guardar cambios usuario

                resident.setUser(user); // reasignar para seguridad, opcional
            } else {
                return ResponseEntity.badRequest().body("Usuario con ID " + residentDTO.getUserDTO().getId() + " no encontrado");
            }
        }

        // Cambiar para usar buildingId directamente
        if (residentDTO.getBuildingId() != null) {
            Optional<Building> optionalBuilding = buildingRepository.findById(residentDTO.getBuildingId());
            if (optionalBuilding.isPresent()) {
                resident.setBuilding(optionalBuilding.get());
            } else {
                return ResponseEntity.badRequest().body("Edificio con ID " + residentDTO.getBuildingId() + " no encontrado");
            }
        }

        // Cambiar para usar apartmentId directamente
        if (residentDTO.getApartmentId() != null) {
            Optional<Apartment> optionalApartment = apartmentRepository.findById(residentDTO.getApartmentId());
            if (optionalApartment.isPresent()) {
                resident.setApartment(optionalApartment.get());
            } else {
                return ResponseEntity.badRequest().body("Apartamento con ID " + residentDTO.getApartmentId() + " no encontrado");
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
        Long adminId = adminService.getLoggedAdminId(); // obtener admin logueado
        if (adminId == null) return new ArrayList<>();

        List<Resident> residents = residentRepository.findByApartment_Building_Admin_Id(adminId);

        List<ResidentDTO> residentDTOS = new ArrayList<>();

        for (Resident resident : residents) {
            if (resident.getUser() == null) continue;

            User user = resident.getUser();
            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .fullName(user.getFullName())
                    .build();

            ResidentDTO residentDTO = new ResidentDTO();
            residentDTO.setId(resident.getId());
            residentDTO.setCi(resident.getCi());
            residentDTO.setUserDTO(userDTO);

            // Mapear ApartmentDTO con piso y número
            if (resident.getApartment() != null) {
                Apartment apartment = resident.getApartment();
                ApartmentDTO apartmentDTO = new ApartmentDTO();
                apartmentDTO.setId(apartment.getId());
                apartmentDTO.setFloor(apartment.getFloor());
                apartmentDTO.setNumber(apartment.getNumber());
                residentDTO.setApartmentDTO(apartmentDTO);

                // Mapear BuildingDTO con nombre
                Building building = apartment.getBuilding();
                if (building != null) {
                    BuildingDTO buildingDTO = new BuildingDTO();
                    buildingDTO.setId(building.getId());
                    buildingDTO.setName(building.getName());
                    residentDTO.setBuildingDTO(buildingDTO);
                }
            } else if (resident.getBuilding() != null) {
                // En caso de que resident tenga directamente el building (si aplica)
                Building building = resident.getBuilding();
                BuildingDTO buildingDTO = new BuildingDTO();
                buildingDTO.setId(building.getId());
                buildingDTO.setName(building.getName());
                residentDTO.setBuildingDTO(buildingDTO);
            }

            residentDTOS.add(residentDTO);
        }

        return residentDTOS;
    }

}
