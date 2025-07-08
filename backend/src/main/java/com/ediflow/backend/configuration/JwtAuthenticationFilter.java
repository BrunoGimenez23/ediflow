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
import java.util.Map;
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


        if (path.equals("/auth/login") || path.equals("/auth/register-admin") || path.equals("/auth/register-resident")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                Claims claims = jwtService.extractAllClaims(jwt);
                Object rawRoles = claims.get("roles");
                List<SimpleGrantedAuthority> authorities = Collections.emptyList();

                if (rawRoles instanceof List<?>) {
                    List<?> rawList = (List<?>) rawRoles;

                    if (!rawList.isEmpty()) {
                        Object first = rawList.get(0);

                        if (first instanceof String) {
                            authorities = rawList.stream()
                                    .map(Object::toString)
                                    .map(SimpleGrantedAuthority::new)
                                    .collect(Collectors.toList());

                        } else if (first instanceof Map) {
                            authorities = rawList.stream()
                                    .map(r -> (Map<?, ?>) r)
                                    .map(m -> m.get("authority"))
                                    .filter(a -> a instanceof String)
                                    .map(a -> new SimpleGrantedAuthority((String) a))
                                    .collect(Collectors.toList());
                        }
                    }
                }

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
