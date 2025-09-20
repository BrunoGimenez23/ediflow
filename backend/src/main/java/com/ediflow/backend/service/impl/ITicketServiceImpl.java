package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.tickets.TicketRequestDTO;
import com.ediflow.backend.dto.tickets.TicketResponseDTO;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.Ticket;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.enums.tikets.TicketStatus;
import com.ediflow.backend.enums.tikets.TicketType;
import com.ediflow.backend.mapper.TicketMapper;
import com.ediflow.backend.repository.IBuildingRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.ITicketRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.ITicketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ITicketServiceImpl implements ITicketService {

    private final ITicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final IUserRepository userRepository;
    private final IBuildingRepository buildingRepository;
    private final IResidentRepository residentRepository;


    @Override
    public TicketResponseDTO createTicket(TicketRequestDTO dto) {
        User user = userRepository.findById(dto.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Building building = buildingRepository.findById(dto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));

        Ticket ticket = ticketMapper.toEntity(dto, user, building);

        // ✅ Asignar fechas si el mapper no lo hace
        if (ticket.getCreatedAt() == null) ticket.setCreatedAt(java.time.LocalDateTime.now());
        ticket.setUpdatedAt(java.time.LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);

        // ✅ Enviar aviso por WhatsApp solo si es un aviso (NOTICE)
        if (ticket.getType() == TicketType.NOTICE) {
            List<Resident> residents = residentRepository.findByBuilding(building);

            Set<String> phoneNumbers = residents.stream()
                    .map(Resident::getPhone)
                    .filter(Objects::nonNull)
                    .map(this::formatPhoneForWhatsapp)
                    .collect(Collectors.toSet());

            for (String phone : phoneNumbers) {
                if (!phone.isEmpty()) {
                    sendWhatsappMessage(phone, ticket.getTitle(), ticket.getDescription());
                }
            }
        }

        return ticketMapper.toDTO(saved);
    }

    // Formateo más robusto de números
    private String formatPhoneForWhatsapp(String phone) {
        if (phone == null || phone.isBlank()) return "";
        String digits = phone.replaceAll("\\D", "");

        if (digits.startsWith("0")) digits = digits.substring(1);
        if (!digits.startsWith("598")) digits = "598" + digits;

        return digits;
    }

    // Envío de WhatsApp con logging de errores
    private void sendWhatsappMessage(String phoneNumber, String title, String description) {
        try {
            String accessToken = "EAAbjl17ZBIKsBPQAWwhpA5ZCPUR18ZCvQTqJi7vX3mOKV9qpsZByxzpyP7g0UZAXCH9IS27vYQ2ZCRjMygF49wTpuXhnFVtfgMN9EDNHuuYOJcm5FoyjWhMEVcDgTAgGWLtZApbNeHwiEYbG0g7zupDx2X5BAlCQbZCk8Y2AvEmuEEpQoJCuLoQXoMJ3vWHRcioq8lpcSP2mTfmUsZBneluGWqZCJzWI9bYUXUXT1rYv1nrR3BOgZDZD";
            String phoneId = "843616918826271";

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "to", phoneNumber,
                    "type", "text",
                    "text", Map.of("body", "Nuevo aviso: " + title + " - " + description)
            );

            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(payload);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://graph.facebook.com/v17.0/" + phoneId + "/messages"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        System.out.println("WhatsApp response: " + response.body());
                        // Opcional: parsear JSON y loggear errores específicos
                    });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(ticketMapper::toDTO)
                .toList();
    }

    @Override
    public List<TicketResponseDTO> getTicketsByBuilding(Long buildingId, User loggedUser) {
        List<Ticket> tickets;

        if (loggedUser.getRole() == Role.RESIDENT) {
            tickets = ticketRepository.findByBuildingIdAndTypeOrCreatedById(
                    buildingId,
                    TicketType.NOTICE,
                    loggedUser.getId()
            );
        } else {
            tickets = ticketRepository.findByBuildingId(buildingId);
        }

        return tickets.stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponseDTO> getTicketsByUser(Long userId) {
        return ticketRepository.findByCreatedById(userId).stream()
                .map(ticketMapper::toDTO)
                .toList();
    }

    @Override
    public TicketResponseDTO updateTicketStatus(Long id, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticket.setUpdatedAt(java.time.LocalDateTime.now()); 
        return ticketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found");
        }
        ticketRepository.deleteById(id);
    }
}

