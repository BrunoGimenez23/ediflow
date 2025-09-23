package com.ediflow.backend.repository.marketplace;

import com.ediflow.backend.entity.marketplace.ServiceOrder;
import com.ediflow.backend.enums.marketplace.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<ServiceOrder, Long> {
    List<ServiceOrder> findByProviderId(Long providerId);
    List<ServiceOrder> findByStatus(OrderStatus status);
    List<ServiceOrder> findByStatusAndProviderId(OrderStatus status, Long providerId);
    List<ServiceOrder> findByProviderIdAndStatus(Long providerId, OrderStatus status);
    List<ServiceOrder> findByAdminId(Long adminId);
}
