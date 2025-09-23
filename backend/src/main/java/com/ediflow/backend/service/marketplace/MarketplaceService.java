package com.ediflow.backend.service.marketplace;

import com.ediflow.backend.dto.marketplace.*;
import com.ediflow.backend.enums.marketplace.OrderStatus;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface MarketplaceService {

    // Providers
    ProviderResponseDTO createProvider(ProviderRequestDTO dto);
    List<ProviderResponseDTO> getAllProviders(String category, String location);

    // Orders
    OrderResponseDTO createOrder(OrderRequestDTO dto);
    List<OrderResponseDTO> getOrdersByProvider(Long providerId);
    List<OrderResponseDTO> getAllOrders(); // <-- agregado
    OrderResponseDTO updateOrderStatus(Long orderId, OrderStatus newStatus);

    // Quotes

    QuoteResponseDTO acceptQuote(Long quoteId);
    List<QuoteResponseDTO> getQuotesByProvider(Long providerId);
    List<QuoteResponseDTO> getAllQuotes(); // <-- agregado
    QuoteResponseDTO rejectQuote(Long quoteId);
    void requestQuote(RequestQuoteDTO dto);
    List<RequestQuoteDTO> getQuoteRequestsByProvider();
    List<QuoteResponseDTO> getQuotesByLoggedAdmin();


    QuoteResponseDTO createQuote(QuoteRequestDTO dto);



    // Reviews
    ReviewResponseDTO createReview(ReviewRequestDTO dto);
    List<ReviewResponseDTO> getReviewsByProvider(Long providerId);
    List<OrderResponseDTO> getOrdersByLoggedProvider();
    List<QuoteResponseDTO> getQuotesByLoggedProvider();



}
