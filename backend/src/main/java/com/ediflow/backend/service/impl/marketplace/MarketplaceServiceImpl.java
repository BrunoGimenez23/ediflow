package com.ediflow.backend.service.impl.marketplace;

import com.ediflow.backend.dto.marketplace.*;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.entity.marketplace.*;
import com.ediflow.backend.enums.marketplace.OrderStatus;
import com.ediflow.backend.enums.marketplace.QuoteStatus;
import com.ediflow.backend.repository.IBuildingRepository;
import com.ediflow.backend.repository.marketplace.*;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.impl.UserServiceImpl;
import com.ediflow.backend.service.marketplace.IProviderService;
import com.ediflow.backend.service.marketplace.MarketplaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.ediflow.backend.entity.Building;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketplaceServiceImpl implements MarketplaceService {

    private final ProviderRepository providerRepository;
    private final OrderRepository orderRepository;
    private final QuoteRepository quoteRepository;
    private final ReviewRepository reviewRepository;
    private final IAdminService adminService;
    private final IBuildingRepository buildingRepository;
    private final IProviderService providerService;
    private final UserServiceImpl authService;


    // === Providers ===
    @Override
    public ProviderResponseDTO createProvider(ProviderRequestDTO dto) {
        Provider provider = new Provider();
        provider.setName(dto.getName());
        provider.setEmail(dto.getEmail());
        provider.setPhone(dto.getPhone());
        provider.setCategory(dto.getCategory());
        provider.setLocation(dto.getLocation());
        provider = providerRepository.save(provider);

        return mapProvider(provider);
    }

    @Override
    public List<ProviderResponseDTO> getAllProviders(String category, String location) {
        List<Provider> providers;
        if (category != null) {
            providers = providerRepository.findByCategoryContainingIgnoreCase(category);
        } else if (location != null) {
            providers = providerRepository.findByLocationContainingIgnoreCase(location);
        } else {
            providers = providerRepository.findAll();
        }

        return providers.stream().map(this::mapProvider).collect(Collectors.toList());
    }

    // === Orders ===
    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {
        ServiceOrder serviceOrder = new ServiceOrder();

        Long adminId = adminService.getLoggedAdminId();
        serviceOrder.setAdminId(adminId);

        serviceOrder.setBuildingId(dto.getBuildingId());
        serviceOrder.setProviderId(dto.getProviderId());
        serviceOrder.setDescription(dto.getDescription());
        serviceOrder.setCategory(dto.getCategory());
        serviceOrder.setStatus(OrderStatus.REQUESTED);
        serviceOrder.setCreatedAt(LocalDateTime.now());

        serviceOrder = orderRepository.save(serviceOrder);
        return mapOrder(serviceOrder);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByProvider(Long providerId) {
        return orderRepository.findByProviderId(providerId)
                .stream().map(this::mapOrder).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapOrder)
                .collect(Collectors.toList());
    }

    // === Quotes ===
    @Override
    public QuoteResponseDTO createQuote(QuoteRequestDTO dto) {
        if (dto.getOrderId() == null) {
            throw new IllegalArgumentException("El orderId no puede ser nulo");
        }

        ServiceOrder serviceOrder = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Orden no encontrada: " + dto.getOrderId()));

        Long providerId = providerService.getLoggedProviderId();

        Quote quote = new Quote();
        quote.setOrderId(dto.getOrderId());
        quote.setProviderId(providerId);
        quote.setAmount(dto.getAmount());
        quote.setMessage(dto.getMessage());
        quote.setStatus(QuoteStatus.SENT);

        quote = quoteRepository.save(quote);

        return mapQuote(quote); // mapQuote está definido en MarketplaceServiceImpl
    }


    @Override
    public QuoteResponseDTO acceptQuote(Long quoteId) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote no encontrada: " + quoteId));

        ServiceOrder serviceOrder = orderRepository.findById(quote.getOrderId())
                .orElseThrow(() -> new RuntimeException("Orden no encontrada: " + quote.getOrderId()));

        List<Quote> allQuotes = quoteRepository.findByOrderId(serviceOrder.getId());
        for (Quote q : allQuotes) {
            if (!q.getId().equals(quoteId)) {
                q.setStatus(QuoteStatus.REJECTED);
                quoteRepository.save(q);
            }
        }

        quote.setStatus(QuoteStatus.ACCEPTED);
        quoteRepository.save(quote);

        serviceOrder.setStatus(OrderStatus.ACCEPTED);
        serviceOrder.setProviderId(quote.getProviderId());
        serviceOrder.setTotalAmount(quote.getAmount());
        orderRepository.save(serviceOrder);

        return mapQuote(quote);
    }


    @Override
    public List<QuoteResponseDTO> getQuotesByProvider(Long providerId) {
        return quoteRepository.findAll()
                .stream()
                .filter(q -> q.getProviderId().equals(providerId))
                .map(this::mapQuote)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteResponseDTO> getAllQuotes() {
        return quoteRepository.findAll()
                .stream()
                .map(this::mapQuote)
                .collect(Collectors.toList());
    }

    // === Reviews ===
    @Override
    public ReviewResponseDTO createReview(ReviewRequestDTO dto) {
        ServiceOrder order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Orden no encontrada: " + dto.getOrderId()));

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new RuntimeException("Solo se pueden dejar reviews de órdenes COMPLETED");
        }

        Review review = new Review();
        review.setProviderId(dto.getProviderId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());
        review = reviewRepository.save(review);

        return mapReview(review);
    }


    @Override
    public List<ReviewResponseDTO> getReviewsByProvider(Long providerId) {
        return reviewRepository.findAll()
                .stream()
                .filter(r -> r.getProviderId().equals(providerId))
                .map(this::mapReview)
                .collect(Collectors.toList());
    }

    // === Mapping helpers ===
    private ProviderResponseDTO mapProvider(Provider provider) {
        ProviderResponseDTO dto = new ProviderResponseDTO();
        dto.setId(provider.getId());
        dto.setName(provider.getName());
        dto.setEmail(provider.getEmail());
        dto.setPhone(provider.getPhone());
        dto.setCategory(provider.getCategory());
        dto.setLocation(provider.getLocation());

        if (provider.getUser() != null) {
            dto.setUserEmail(provider.getUser().getEmail());
        }

        Double avgRating = reviewRepository.findAverageRatingByProviderId(provider.getId());
        Integer totalReviews = reviewRepository.countReviewsByProviderId(provider.getId());

        dto.setRating(avgRating != null ? avgRating : 0.0);
        dto.setTotalReviews(totalReviews != null ? totalReviews : 0);

        return dto;
    }



    private OrderResponseDTO mapOrder(ServiceOrder serviceOrder) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(serviceOrder.getId());
        dto.setProviderId(serviceOrder.getProviderId());
        dto.setProviderName(providerRepository.findById(serviceOrder.getProviderId())
                .map(Provider::getName).orElse("—"));
        dto.setBuildingId(serviceOrder.getBuildingId());
        dto.setBuildingName(buildingRepository.findById(serviceOrder.getBuildingId())
                .map(Building::getName).orElse("—"));
        dto.setDescription(serviceOrder.getDescription());
        dto.setCategory(serviceOrder.getCategory());
        dto.setStatus(serviceOrder.getStatus().name());
        dto.setCreatedAt(serviceOrder.getCreatedAt());
        dto.setTotalAmount(serviceOrder.getTotalAmount());

        return dto;
    }

    private QuoteResponseDTO mapQuote(Quote quote) {
        QuoteResponseDTO dto = new QuoteResponseDTO();
        dto.setId(quote.getId());
        dto.setOrderId(quote.getOrderId());
        dto.setAmount(quote.getAmount());
        dto.setMessage(quote.getMessage() != null ? quote.getMessage() : "");
        dto.setStatus(quote.getStatus() != null ? quote.getStatus().name() : "UNKNOWN");

        ServiceOrder order = orderRepository.findById(quote.getOrderId()).orElse(null);
        if (order != null) {
            dto.setOrderDescription(order.getDescription() != null ? order.getDescription() : "—");

            Building building = buildingRepository.findById(order.getBuildingId()).orElse(null);
            dto.setBuildingName(building != null ? building.getName() : "—");
        } else {
            dto.setOrderDescription("—");
            dto.setBuildingName("—");
        }

        // Nombre del proveedor
        Provider provider = providerRepository.findById(quote.getProviderId()).orElse(null);
        dto.setProviderName(provider != null && provider.getName() != null ? provider.getName() : "—");

        return dto;
    }


    private ReviewResponseDTO mapReview(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setProviderId(review.getProviderId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        return dto;
    }

    // === Helpers para usuario logueado ===
    private User getLoggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }
        return (User) auth.getPrincipal();
    }

    @Override
    public List<OrderResponseDTO> getOrdersByLoggedProvider() {
        Long providerId = providerService.getLoggedProviderId();
        return orderRepository.findByProviderId(providerId)
                .stream()
                .map(this::mapOrder)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteResponseDTO> getQuotesByLoggedProvider() {
        Long providerId = providerService.getLoggedProviderId();
        System.out.println("Logged provider ID: " + providerId);

        List<Quote> quotes = quoteRepository.findByProviderId(providerId);
        System.out.println("Quotes encontradas en DB: " + quotes.size());

        return quotes.stream().map(quote -> {
                    try {
                        QuoteResponseDTO dto = new QuoteResponseDTO();
                        dto.setId(quote.getId());
                        dto.setOrderId(quote.getOrderId());
                        dto.setAmount(quote.getAmount());
                        dto.setMessage(quote.getMessage());
                        dto.setStatus(quote.getStatus() != null ? quote.getStatus().name() : "UNKNOWN");

                        // Nombre del edificio
                        dto.setBuildingName(
                                quote.getOrderId() != null
                                        ? orderRepository.findById(quote.getOrderId())
                                        .map(order -> {
                                            if (order.getBuildingId() != null) {
                                                return buildingRepository.findById(order.getBuildingId())
                                                        .map(building -> building.getName() != null ? building.getName() : "—")
                                                        .orElse("—");
                                            } else {
                                                return "—";
                                            }
                                        })
                                        .orElse("—")
                                        : "—"
                        );

                        // Descripción del pedido
                        dto.setOrderDescription(
                                quote.getOrderId() != null
                                        ? orderRepository.findById(quote.getOrderId())
                                        .map(order -> order.getDescription() != null ? order.getDescription() : "—")
                                        .orElse("—")
                                        : "—"
                        );

                        // Nombre del proveedor
                        dto.setProviderName(
                                providerRepository.findById(quote.getProviderId())
                                        .map(provider -> provider.getName() != null ? provider.getName() : "—")
                                        .orElse("—")
                        );

                        return dto;
                    } catch (Exception e) {
                        // Evita que una cotización rota rompa todo
                        System.err.println("Error mapeando cotización ID " + quote.getId() + ": " + e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull) // eliminamos cotizaciones que fallaron
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteResponseDTO> getQuotesByLoggedAdmin() {
        Long adminId;
        try {
            adminId = adminService.getLoggedAdminId();
        } catch (Exception e) {
            throw new RuntimeException("No se pudo obtener el admin logueado: " + e.getMessage());
        }

        List<ServiceOrder> adminOrders = orderRepository.findByAdminId(adminId);
        if (adminOrders == null || adminOrders.isEmpty()) {
            return List.of(); // devolvemos lista vacía si no hay órdenes
        }

        List<Long> orderIds = adminOrders.stream()
                .map(ServiceOrder::getId)
                .toList();

        List<Quote> quotes = orderIds.isEmpty() ? List.of() : quoteRepository.findByOrderIdIn(orderIds);

        return quotes.stream()
                .map(quote -> {
                    try {
                        return mapQuote(quote);
                    } catch (Exception e) {
                        System.err.println("Error mapeando cotización ID " + quote.getId() + ": " + e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }



    @Override
    public QuoteResponseDTO rejectQuote(Long quoteId) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote no encontrada: " + quoteId));

        quote.setStatus(QuoteStatus.REJECTED);
        quoteRepository.save(quote);

        return mapQuote(quote);
    }
    @Override
    public OrderResponseDTO updateOrderStatus(Long orderId, OrderStatus newStatus) {
        ServiceOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada: " + orderId));

        // Validaciones de transición
        switch (newStatus) {
            case PAID -> {
                if (order.getStatus() != OrderStatus.ACCEPTED) {
                    throw new RuntimeException("La orden debe estar ACCEPTED antes de marcarla como PAID");
                }
            }
            case SCHEDULED -> {
                if (order.getStatus() != OrderStatus.PAID) {
                    throw new RuntimeException("Debe estar PAID antes de agendar");
                }
            }
            case IN_PROGRESS -> {
                if (order.getStatus() != OrderStatus.SCHEDULED) {
                    throw new RuntimeException("Debe estar SCHEDULED antes de iniciarla");
                }
            }
            case COMPLETED -> {
                if (order.getStatus() != OrderStatus.IN_PROGRESS) {
                    throw new RuntimeException("Debe estar IN_PROGRESS antes de completarla");
                }
            }
            default -> {}
        }

        order.setStatus(newStatus);
        orderRepository.save(order);

        return mapOrder(order);
    }
    @Override
    public void requestQuote(RequestQuoteDTO dto) {
        Provider provider = providerRepository.findById(dto.getProviderId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        ServiceOrder order = new ServiceOrder();
        order.setProviderId(provider.getId());
        order.setAdminId(adminService.getLoggedAdminId());
        order.setBuildingId(dto.getBuildingId());
        order.setDescription(dto.getMessage());
        order.setCategory(dto.getCategory());
        order.setStatus(OrderStatus.REQUESTED);
        order.setCreatedAt(LocalDateTime.now());

        orderRepository.save(order);
    }

    @Override
    public List<RequestQuoteDTO> getQuoteRequestsByProvider() {
        User loggedUser = authService.getLoggedUser();

        Provider provider = providerRepository.findByUserId(loggedUser.getId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado para este usuario"));

        return orderRepository.findByStatusAndProviderId(OrderStatus.REQUESTED, provider.getId())
                .stream()
                .map(order -> {
                    RequestQuoteDTO dto = new RequestQuoteDTO();
                    dto.setProviderId(provider.getId());
                    dto.setBuildingId(order.getBuildingId());
                    dto.setMessage(order.getDescription());
                    dto.setOrderId(order.getId());
                    return dto;
                }).collect(Collectors.toList());
    }


}
