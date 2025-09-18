package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.resident.RegisterOrReplaceResidentRequest;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.*;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.mapper.ResidentMapper;
import com.ediflow.backend.repository.IApartmentRepository;
import com.ediflow.backend.repository.IBuildingRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.IResidentService;
import com.ediflow.backend.service.IUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Autowired
    private IUserService userService;

    @Autowired
    private ResidentMapper residentMapper;
    private static final Logger logger = LoggerFactory.getLogger(ResidentServiceimpl.class);



    private final PasswordEncoder passwordEncoder;

    public ResidentServiceimpl(IUserRepository userRepository, IResidentRepository residentRepository, IApartmentRepository apartmentRepository, IBuildingRepository buildingRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.residentRepository = residentRepository;
        this.apartmentRepository = apartmentRepository;
        this.buildingRepository = buildingRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    public ResponseEntity<Map<String, String>> createResident(ResidentDTO newResident) {

        logger.debug("👉 Iniciando creación de residente: {}", newResident);

        if (newResident == null || newResident.getUserDTO() == null) {
            return new ResponseEntity<>(Map.of("error", "Datos del usuario requeridos"), HttpStatus.BAD_REQUEST);
        }

        if (newResident.getCi() == null) {
            return new ResponseEntity<>(Map.of("error", "El CI es obligatorio"), HttpStatus.BAD_REQUEST);
        }

        if (residentRepository.existsByCi(newResident.getCi())) {
            logger.debug("❌ El CI {} ya está registrado", newResident.getCi());
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

        if (userRepository.existsByUsername(username)) {
            logger.debug("❌ El username '{}' ya está en uso", username);
            return new ResponseEntity<>(Map.of("error", "El username ya está en uso"), HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(email)) {
            logger.debug("❌ El email '{}' ya está registrado", email);
            return new ResponseEntity<>(Map.of("error", "El email ya está registrado"), HttpStatus.BAD_REQUEST);
        }

        Long adminAccountId = getAdminAccountIdOfLoggedUser();
        logger.debug("🔐 adminAccountId obtenido del usuario logueado: {}", adminAccountId);

        if (adminAccountId == null) {
            return new ResponseEntity<>(Map.of("error", "No se pudo determinar el AdminAccount del usuario actual"), HttpStatus.UNAUTHORIZED);
        }

        AdminAccount adminAccount = userService.getAdminAccountById(adminAccountId)
                .orElseThrow(() -> new RuntimeException("AdminAccount no encontrado"));

        logger.debug("✅ AdminAccount recuperado con ID: {}", adminAccount.getId());

        try {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(newResident.getUserDTO().getRole());
            user.setFullName(
                    newResident.getUserDTO().getFullName() != null && !newResident.getUserDTO().getFullName().isBlank()
                            ? newResident.getUserDTO().getFullName()
                            : username
            );
            user.setAdminAccount(adminAccount);

            logger.debug("📌 Usuario listo para guardar con adminAccountId={}",
                    user.getAdminAccount() != null ? user.getAdminAccount().getId() : "NULL");

            userRepository.save(user);
            logger.debug("💾 Usuario guardado con ID: {}", user.getId());

            Resident resident = new Resident();
            resident.setUser(user);
            resident.setCi(newResident.getCi());

            if (newResident.getApartmentId() != null) {
                Apartment apartment = apartmentRepository.findById(newResident.getApartmentId())
                        .orElseThrow(() -> new RuntimeException("Apartamento no encontrado"));
                resident.setApartment(apartment);
                resident.setBuilding(apartment.getBuilding());
                logger.debug("🏠 Apartamento asignado ID: {}, Edificio: {}", apartment.getId(), apartment.getBuilding().getId());
            }

            residentRepository.save(resident);
            logger.debug("✅ Residente guardado con ID: {}", resident.getId());

            return new ResponseEntity<>(Map.of("message", "Residente creado exitosamente"), HttpStatus.CREATED);

        } catch (Exception e) {
            logger.error("❌ Error al crear el residente", e);
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


        Resident existingResident = residentRepository.findByApartmentId(apartmentId).orElse(null);
        if (existingResident != null) {
            residentRepository.delete(existingResident);
            userRepository.delete(existingResident.getUser());
        }


        UserDTO userDTO = residentDTO.getUserDTO();
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFullName(userDTO.getFullName());
        user.setRole(Role.RESIDENT);
        userRepository.save(user);


        Resident newResident = new Resident();
        newResident.setCi(residentDTO.getCi());
        newResident.setUser(user);
        newResident.setApartment(apartment);
        residentRepository.save(newResident);


        return mapToDTO(newResident);
    }


    private ResidentDTO mapToDTO(Resident resident) {
        ResidentDTO dto = new ResidentDTO();
        dto.setCi(resident.getCi());
        dto.setApartmentId(resident.getApartment().getId());

        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(resident.getUser().getUsername());
        userDTO.setEmail(resident.getUser().getEmail());
        userDTO.setFullName(resident.getUser().getFullName());
        userDTO.setRole(resident.getUser().getRole());


        dto.setUserDTO(userDTO);

        return dto;
    }

    public ResidentDTO findByUserEmail(String email) {
        Resident resident = residentRepository.findByUserEmailWithApartmentAndBuilding(email)
                .orElseThrow(() -> new UsernameNotFoundException("Residente no encontrado"));

        ResidentDTO dto = new ResidentDTO();
        dto.setId(resident.getId());
        dto.setCi(resident.getCi());


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


        if (resident.getUser() != null) {
            if (dto.getUserDTO() == null) {
                dto.setUserDTO(new UserDTO());
            }
            dto.getUserDTO().setFullName(resident.getUser().getFullName());
            dto.getUserDTO().setEmail(resident.getUser().getEmail());
        }


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

        // 🔹 Guardar teléfono si viene en el DTO
        if (residentDTO.getPhone() != null) {
            resident.setPhone(residentDTO.getPhone());
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

                userRepository.save(user);

                resident.setUser(user);
            } else {
                return ResponseEntity.badRequest().body("Usuario con ID " + residentDTO.getUserDTO().getId() + " no encontrado");
            }
        }

        if (residentDTO.getBuildingId() != null) {
            Optional<Building> optionalBuilding = buildingRepository.findById(residentDTO.getBuildingId());
            if (optionalBuilding.isPresent()) {
                resident.setBuilding(optionalBuilding.get());
            } else {
                return ResponseEntity.badRequest().body("Edificio con ID " + residentDTO.getBuildingId() + " no encontrado");
            }
        }

        if (residentDTO.getApartmentId() != null) {
            Optional<Apartment> optionalApartment = apartmentRepository.findById(residentDTO.getApartmentId());
            if (optionalApartment.isPresent()) {
                Apartment apartment = optionalApartment.get();
                resident.setApartment(apartment);
                resident.setBuilding(apartment.getBuilding());
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
        Long adminAccountId = getAdminAccountIdOfLoggedUser();
        logger.debug("AdminAccountId del usuario logueado: {}", adminAccountId);
        if (adminAccountId == null) return new ArrayList<>();


        List<Resident> residents = residentRepository.findByUser_AdminAccount_IdWithApartmentAndBuilding(adminAccountId);

        logger.debug("Residentes encontrados: {}", residents.size());

        List<ResidentDTO> residentDTOS = new ArrayList<>();

        for (Resident resident : residents) {
            logger.debug("Residente ID: {}, CI: {}, User: {}, Apartment: {}, Building: {}",
                    resident.getId(),
                    resident.getCi(),
                    resident.getUser() != null ? resident.getUser().getEmail() : "null",
                    resident.getApartment() != null ? resident.getApartment().getNumber() : "null",
                    resident.getBuilding() != null ? resident.getBuilding().getName() : "null");

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
            residentDTO.setPhone(resident.getPhone());
            residentDTO.setUserDTO(userDTO);


            if (resident.getApartment() != null) {
                Apartment apartment = resident.getApartment();
                ApartmentDTO apartmentDTO = new ApartmentDTO();
                apartmentDTO.setId(apartment.getId());
                apartmentDTO.setFloor(apartment.getFloor());
                apartmentDTO.setNumber(apartment.getNumber());
                residentDTO.setApartmentDTO(apartmentDTO);
                residentDTO.setApartmentId(apartment.getId());

                Building building = apartment.getBuilding();
                if (building != null) {
                    BuildingDTO buildingDTO = new BuildingDTO();
                    buildingDTO.setId(building.getId());
                    buildingDTO.setName(building.getName());
                    buildingDTO.setAddress(building.getAddress());
                    residentDTO.setBuildingDTO(buildingDTO);
                    residentDTO.setBuildingId(building.getId());
                }
            }


            if (residentDTO.getBuildingDTO() == null && resident.getBuilding() != null) {
                Building building = resident.getBuilding();
                BuildingDTO buildingDTO = new BuildingDTO();
                buildingDTO.setId(building.getId());
                buildingDTO.setName(building.getName());
                buildingDTO.setAddress(building.getAddress());
                residentDTO.setBuildingDTO(buildingDTO);
                residentDTO.setBuildingId(building.getId());
            }

            residentDTOS.add(residentDTO);
        }

        return residentDTOS;
    }

    @Override
    public Page<ResidentDTO> findAllPaginated(Long buildingId, Pageable pageable) {
        logger.debug("findAllPaginated llamado con buildingId={}, pageable={}", buildingId, pageable);

        User loggedUser = adminService.getLoggedUser();
        Page<Long> residentIdsPage;

        // Filtrado según si el admin tiene AdminAccount
        if (loggedUser.getAdminAccount() != null) {
            Long accountId = loggedUser.getAdminAccount().getId();

            if (buildingId != null) {
                residentIdsPage = residentRepository.findIdsByAdminAccountIdAndBuildingIdAndRoleResident(accountId, buildingId, pageable);
            } else {
                residentIdsPage = residentRepository.findIdsByAdminAccountIdAndRoleResident(accountId, pageable);
            }

        } else {
            Long adminId = adminService.getLoggedAdminId();

            if (buildingId != null) {
                residentIdsPage = residentRepository.findIdsByAdminIdAndBuildingIdAndRoleResident(adminId, buildingId, pageable);
            } else {
                residentIdsPage = residentRepository.findIdsByAdminIdAndRoleResident(adminId, pageable);
            }
        }

        if (residentIdsPage.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<Resident> residents = residentRepository.findByIdsWithApartmentBuildingUser(residentIdsPage.getContent());

        List<ResidentDTO> dtoList = residents.stream().map(resident -> {
            ResidentDTO dto = new ResidentDTO();
            dto.setId(resident.getId());
            dto.setCi(resident.getCi());
            dto.setPhone(resident.getPhone()); // ✅ teléfono agregado

            // Mapeo UserDTO
            if (resident.getUser() != null) {
                UserDTO userDTO = UserDTO.builder()
                        .id(resident.getUser().getId())
                        .email(resident.getUser().getEmail())
                        .username(resident.getUser().getUsername())
                        .fullName(resident.getUser().getFullName())
                        .role(resident.getUser().getRole())
                        .build();
                dto.setUserDTO(userDTO);
            }

            // Mapeo ApartmentDTO y BuildingDTO
            if (resident.getApartment() != null) {
                ApartmentDTO apartmentDTO = ApartmentDTO.builder()
                        .id(resident.getApartment().getId())
                        .floor(resident.getApartment().getFloor())
                        .number(resident.getApartment().getNumber())
                        .build();
                dto.setApartmentDTO(apartmentDTO);
                dto.setApartmentId(apartmentDTO.getId());

                if (resident.getApartment().getBuilding() != null) {
                    BuildingDTO buildingDTO = BuildingDTO.builder()
                            .id(resident.getApartment().getBuilding().getId())
                            .name(resident.getApartment().getBuilding().getName())
                            .address(resident.getApartment().getBuilding().getAddress()) // opcional si quieres
                            .build();
                    dto.setBuildingDTO(buildingDTO);
                    dto.setBuildingId(buildingDTO.getId());
                }
            }

            return dto;
        }).collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, residentIdsPage.getTotalElements());
    }


    private Long getAdminAccountIdOfLoggedUser() {

        String email = adminService.getLoggedUserEmail();
        if (email == null) return null;

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getAdminAccount() == null) return null;

        return user.getAdminAccount().getId();
    }


    @Override
    public List<ResidentDTO> findAllByAdminAccount(Long adminAccountId) {
        List<Resident> residents = residentRepository.findByUser_AdminAccount_Id(adminAccountId);
        List<ResidentDTO> residentDTOs = new ArrayList<>();

        for (Resident resident : residents) {
            ResidentDTO dto = new ResidentDTO();
            dto.setId(resident.getId());
            dto.setCi(resident.getCi());


            User user = resident.getUser();
            if (user != null) {
                UserDTO userDTO = new UserDTO();
                userDTO.setId(user.getId());
                userDTO.setUsername(user.getUsername());
                userDTO.setEmail(user.getEmail());
                userDTO.setFullName(user.getFullName());
                userDTO.setRole(user.getRole());
                dto.setUserDTO(userDTO);
            }

            residentDTOs.add(dto);
        }

        return residentDTOs;
    }
    @Override
    public Long getAdminAccountIdByUserEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && user.getAdminAccount() != null) {
            return user.getAdminAccount().getId();
        }
        return null;
    }

    @Override
    public Page<ResidentDTO> findByBuildingId(Long buildingId, Pageable pageable) {
        Page<Resident> residentsPage = residentRepository.findByApartmentBuildingId(buildingId, pageable);

        List<ResidentDTO> dtoList = residentsPage.stream()
                .map(resident -> {
                    ResidentDTO dto = new ResidentDTO();
                    dto.setId(resident.getId());
                    dto.setCi(resident.getCi());

                    if (resident.getUser() != null) {
                        UserDTO userDTO = UserDTO.builder()
                                .id(resident.getUser().getId())
                                .email(resident.getUser().getEmail())
                                .username(resident.getUser().getUsername())
                                .fullName(resident.getUser().getFullName())
                                .role(resident.getUser().getRole())
                                .build();
                        dto.setUserDTO(userDTO);
                    }

                    if (resident.getApartment() != null) {
                        ApartmentDTO apartmentDTO = ApartmentDTO.builder()
                                .id(resident.getApartment().getId())
                                .floor(resident.getApartment().getFloor())
                                .number(resident.getApartment().getNumber())
                                .build();
                        dto.setApartmentDTO(apartmentDTO);

                        if (resident.getApartment().getBuilding() != null) {
                            BuildingDTO buildingDTO = BuildingDTO.builder()
                                    .id(resident.getApartment().getBuilding().getId())
                                    .name(resident.getApartment().getBuilding().getName())
                                    .build();
                            dto.setBuildingDTO(buildingDTO);
                            dto.setBuildingId(buildingDTO.getId());
                        }
                        dto.setApartmentId(apartmentDTO.getId());
                    }

                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, residentsPage.getTotalElements());
    }

    @Override
    @Transactional
    public ResponseEntity<String> assignAdminAccountToExistingResidents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User loggedUser = userRepository.findByEmail(email).orElse(null);

        if (loggedUser == null || loggedUser.getAdminAccount() == null) {
            return ResponseEntity.badRequest().body("El usuario logueado no tiene una cuenta de administrador válida");
        }

        Long adminAccountId = loggedUser.getAdminAccount().getId();
        List<Resident> residentsWithoutAccount = residentRepository.findByUser_AdminAccountIsNull();

        for (Resident resident : residentsWithoutAccount) {
            User user = resident.getUser();
            if (user != null) {
                user.setAdminAccount(loggedUser.getAdminAccount());
                userRepository.save(user);
            }
        }

        return ResponseEntity.ok("Se asignó el adminAccount a " + residentsWithoutAccount.size() + " residentes.");
    }
    public void replaceResident(Long apartmentId, Long userId) {
        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException("Apartamento no encontrado"));

        User newUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (newUser.getRole() != Role.RESIDENT) {
            throw new IllegalArgumentException("El usuario no tiene rol RESIDENT");
        }

        residentRepository.findByApartment(apartment)
                .ifPresent(residentRepository::delete);

        Resident newResident = new Resident();
        newResident.setUser(newUser);
        newResident.setApartment(apartment);
        newResident.setBuilding(apartment.getBuilding());

        residentRepository.save(newResident);
    }
    @Transactional
    public Resident registerOrReplaceResident(RegisterOrReplaceResidentRequest request) {
        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new RuntimeException("Apartamento no encontrado"));

        Admin admin = Optional.ofNullable(apartment.getBuilding())
                .map(Building::getAdmin)
                .orElseThrow(() -> new RuntimeException("No se pudo determinar el Admin desde el apartamento"));

        User adminUser = Optional.ofNullable(admin.getUser())
                .orElseThrow(() -> new RuntimeException("No se pudo determinar el usuario del admin"));

        User user;

        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();

            if (user.getRole() != Role.RESIDENT) {
                throw new IllegalArgumentException("El usuario ya existe y no es residente");
            }

            // Validación: si el usuario ya tiene un residente distinto, no se puede usar este email
            boolean userAlreadyAssigned = residentRepository.existsByUser(user);
            if (userAlreadyAssigned) {
                throw new IllegalArgumentException("El email ya está registrado para otro residente");
            }

            // Nueva validación para username
            Optional<User> usernameUserOpt = userRepository.findByUsername(request.getUsername());
            if (usernameUserOpt.isPresent() && !usernameUserOpt.get().getId().equals(user.getId())) {
                throw new IllegalArgumentException("El username ya está en uso. Elige otro.");
            }

        } else {
            validatePassword(request.getPassword());

            // Validación de username para nuevos usuarios
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new IllegalArgumentException("El username ya está en uso. Elige otro.");
            }

            user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.RESIDENT)
                    .fullName(request.getFullName())
                    .adminAccount(adminUser.getAdminAccount())
                    .build();

            userRepository.save(user);
        }

        Resident resident = residentRepository.findByApartment(apartment)
                .orElse(new Resident());

        resident.setUser(user);
        resident.setApartment(apartment);
        resident.setBuilding(apartment.getBuilding());
        resident.setCi(request.getCi());

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            String digits = request.getPhone().replaceAll("[^\\d]", "");
            if (digits.startsWith("0")) digits = digits.substring(1);
            resident.setPhone("+598" + digits);
        }

        return residentRepository.save(resident);
    }



    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres.");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("La contraseña debe contener al menos una letra mayúscula.");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("La contraseña debe contener al menos una letra minúscula.");
        }
        if (!password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("La contraseña debe contener al menos un número.");
        }
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new IllegalArgumentException("La contraseña debe contener al menos un carácter especial.");
        }
    }

    public List<ResidentDTO> findByBuildingIdForPorter(Long buildingId) {
        List<Resident> residents = residentRepository.findByBuildingIdWithUser(buildingId);
        return residents.stream()
                .map(resident -> ResidentDTO.builder()
                        .id(resident.getId())
                        .ci(resident.getCi())
                        .userDTO(UserDTO.builder()
                                .id(resident.getUser().getId())
                                .username(resident.getUser().getUsername())
                                .email(resident.getUser().getEmail())
                                .build())
                        .apartmentId(resident.getApartment().getId())
                        .buildingId(resident.getApartment().getBuilding().getId())
                        .build())
                .collect(Collectors.toList());
    }




}
