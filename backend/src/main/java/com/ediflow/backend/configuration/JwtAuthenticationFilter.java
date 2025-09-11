package com.ediflow.backend.configuration;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();

        // Saltarse autenticación para login y registro
        if (path.equals("/auth/login") || path.equals("/auth/register-admin") || path.equals("/auth/register-resident")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[JWT Filter] ❌ No se encontró el header Authorization o no empieza con 'Bearer '");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        System.out.println("[JWT Filter] ✅ Header Authorization recibido");
        System.out.println("[JWT Filter] 📧 Username extraído del token: " + username);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            boolean isValid = jwtService.isTokenValid(jwt, userDetails);
            System.out.println("[JWT Filter] 🔐 Token válido: " + isValid);

            if (isValid) {
                Claims claims = jwtService.extractAllClaims(jwt);
                Object rawRoles = claims.get("roles");
                List<SimpleGrantedAuthority> authorities = Collections.emptyList();

                if (rawRoles instanceof List<?>) {
                    authorities = ((List<?>) rawRoles).stream()
                            .filter(r -> r instanceof String)
                            .map(Object::toString)
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                }

                System.out.println("[JWT Filter] ✅ Authorities extraídas: " + authorities);

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                System.out.println("[JWT Filter] ✅ SecurityContextHolder seteado correctamente.");
            }
        }

        filterChain.doFilter(request, response);
    }
}
