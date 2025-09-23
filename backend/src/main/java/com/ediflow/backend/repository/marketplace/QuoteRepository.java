package com.ediflow.backend.repository.marketplace;

import com.ediflow.backend.dto.marketplace.QuoteRequestDTO;
import com.ediflow.backend.entity.marketplace.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByOrderId(Long orderId);
    List<Quote> findByProviderId(Long providerId);
    List<Quote> findByProviderIdAndStatus(Long providerId, String status);
    List<Quote> findByOrderIdIn(List<Long> orderIds);

}
