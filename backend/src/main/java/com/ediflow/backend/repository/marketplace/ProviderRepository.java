package com.ediflow.backend.repository.marketplace;

import com.ediflow.backend.entity.marketplace.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    List<Provider> findByCategoryContainingIgnoreCase(String category);
    List<Provider> findByLocationContainingIgnoreCase(String location);
    Optional<Provider> findByUserId(Long userId);
    Optional<Provider> findByUserEmail(String email);

}
