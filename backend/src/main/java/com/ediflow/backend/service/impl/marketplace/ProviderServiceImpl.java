package com.ediflow.backend.service.impl.marketplace;

import com.ediflow.backend.entity.marketplace.Provider;
import com.ediflow.backend.repository.marketplace.ProviderRepository;
import com.ediflow.backend.service.marketplace.IProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements IProviderService {

    private final ProviderRepository providerRepository;

    @Override
    public Long getLoggedProviderId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // asumimos que el username es el email

        return providerRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado para el usuario logueado"))
                .getId();
    }
}
