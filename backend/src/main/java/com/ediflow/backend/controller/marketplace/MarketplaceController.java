package com.ediflow.backend.controller.marketplace;

import com.ediflow.backend.dto.marketplace.*;
import com.ediflow.backend.entity.marketplace.Quote;
import com.ediflow.backend.entity.marketplace.ServiceOrder;
import com.ediflow.backend.enums.marketplace.OrderStatus;
import com.ediflow.backend.enums.marketplace.QuoteStatus;
import com.ediflow.backend.repository.marketplace.OrderRepository;
import com.ediflow.backend.repository.marketplace.QuoteRepository;
import com.ediflow.backend.service.marketplace.IProviderService;
import com.ediflow.backend.service.marketplace.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private static final Logger log = LoggerFactory.getLogger(MarketplaceController.class); // Declarar el logger

    private final MarketplaceService marketplaceService;
    private final IProviderService providerService;
    private final OrderRepository orderRepository;
    private final QuoteRepository quoteRepository;

    // === Providers ===
    @PostMapping("/providers")
    public ResponseEntity<ProviderResponseDTO> createProvider(@RequestBody ProviderRequestDTO dto) {
        try {
            return ResponseEntity.ok(marketplaceService.createProvider(dto));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/providers")
    public ResponseEntity<List<ProviderResponseDTO>> getProviders(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        try {
            return ResponseEntity.ok(marketplaceService.getAllProviders(category, location));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // === Orders ===
    @PostMapping("/orders")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO dto) {
        try {
            return ResponseEntity.ok(marketplaceService.createOrder(dto));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        try {
            return ResponseEntity.ok(marketplaceService.getAllOrders());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/orders/provider/{providerId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByProvider(@PathVariable Long providerId) {
        try {
            return ResponseEntity.ok(marketplaceService.getOrdersByProvider(providerId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/orders/my")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders() {
        try {
            return ResponseEntity.ok(marketplaceService.getOrdersByLoggedProvider());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        try {
            return ResponseEntity.ok(marketplaceService.updateOrderStatus(id,
                    OrderStatus.valueOf(status.toUpperCase())));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // === Quotes ===

    @PostMapping("/quotes")
    public ResponseEntity<QuoteResponseDTO> createQuote(@Valid @RequestBody QuoteRequestDTO dto) {
        log.debug("Recibido QuoteRequestDTO: {}", dto);
        try {
            QuoteResponseDTO response = marketplaceService.createQuote(dto);
            log.debug("Cotización creada: {}", response);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error al crear cotización: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(new QuoteResponseDTO(e.getMessage()));
        } catch (Exception e) {
            log.error("Error inesperado al crear cotización: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new QuoteResponseDTO("Error inesperado: " + e.getMessage()));
        }
    }

    @GetMapping("/quotes")
    public ResponseEntity<List<QuoteResponseDTO>> getAllQuotes() {
        try {
            return ResponseEntity.ok(marketplaceService.getAllQuotes());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/quotes/provider/{providerId}")
    public ResponseEntity<List<QuoteResponseDTO>> getQuotesByProvider(@PathVariable Long providerId) {
        try {
            return ResponseEntity.ok(marketplaceService.getQuotesByProvider(providerId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    @GetMapping("/quotes/admin")
    public ResponseEntity<List<QuoteResponseDTO>> getQuotesByLoggedAdmin() {
        return ResponseEntity.ok(marketplaceService.getQuotesByLoggedAdmin());
    }

    @GetMapping("/quotes/my")
    public ResponseEntity<List<QuoteResponseDTO>> getMyQuotes() {
        try {
            return ResponseEntity.ok(marketplaceService.getQuotesByLoggedProvider());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/quotes/{id}/accept")
    public ResponseEntity<QuoteResponseDTO> acceptQuote(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(marketplaceService.acceptQuote(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PutMapping("/quotes/{id}/reject")
    public ResponseEntity<QuoteResponseDTO> rejectQuote(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(marketplaceService.rejectQuote(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping("/quotes/request")
    public ResponseEntity<Void> requestQuote(@RequestBody RequestQuoteDTO dto) {
        try {
            marketplaceService.requestQuote(dto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/quotes/requests")
    public ResponseEntity<List<RequestQuoteDTO>> getQuoteRequestsByProvider() {
        try {
            return ResponseEntity.ok(marketplaceService.getQuoteRequestsByProvider());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // === Reviews ===
    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponseDTO> createReview(@RequestBody ReviewRequestDTO dto) {
        try {
            return ResponseEntity.ok(marketplaceService.createReview(dto));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/reviews/provider/{providerId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByProvider(@PathVariable Long providerId) {
        try {
            return ResponseEntity.ok(marketplaceService.getReviewsByProvider(providerId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(marketplaceService.getOrderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}