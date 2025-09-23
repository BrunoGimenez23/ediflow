package com.ediflow.backend.configuration;

import com.ediflow.backend.auth.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration; 
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new CorsConfiguration();

                    // Orígenes permitidos exactos
                    corsConfig.setAllowedOrigins(List.of(
                            "http://localhost:5173",
                            "https://ediflow23.vercel.app",
                            "https://ediflow.uy"
                    ));

                    // Métodos permitidos
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

                    // Headers permitidos (incluyendo Authorization para JWT)
                    corsConfig.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

                    // Permitir envío de cookies y Authorization headers
                    corsConfig.setAllowCredentials(true);

                    return corsConfig;
                }))

                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // endpoints públicos
                        .requestMatchers("/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // === Admin & Employee ===
                        .requestMatchers("/admin/users").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_EMPLOYEE")
                        .requestMatchers("/users/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_EMPLOYEE")
                        .requestMatchers(HttpMethod.POST, "/users").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/payment/all").hasAuthority("ROLE_ADMIN")

                        // === Marketplace ===

                        // Providers (crearse como proveedor, ver lista de proveedores)
                        .requestMatchers(HttpMethod.POST, "/marketplace/providers").hasAuthority("ROLE_PROVIDER")
                        .requestMatchers(HttpMethod.GET, "/marketplace/providers").authenticated() // cualquiera logueado puede verlos

                        // Orders
                        .requestMatchers("/marketplace/orders/my").hasAuthority("ROLE_PROVIDER") // pedidos de un proveedor
                        .requestMatchers("/marketplace/orders/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_EMPLOYEE", "ROLE_PROVIDER")

                        // Quotes
                        .requestMatchers("/marketplace/quotes/my").hasAuthority("ROLE_PROVIDER") // proveedor ve las suyas
                        .requestMatchers("/marketplace/quotes/requests").hasAuthority("ROLE_PROVIDER") // solicitudes que le llegan al proveedor
                        .requestMatchers("/marketplace/quotes").hasAnyAuthority("ROLE_PROVIDER","ROLE_ADMIN", "ROLE_EMPLOYEE") // admin/empleado ven todas
                        .requestMatchers("/marketplace/quotes/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_EMPLOYEE", "ROLE_PROVIDER")

                        // === Otros ===
                        .requestMatchers(HttpMethod.GET, "/buildings/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_EMPLOYEE", "ROLE_RESIDENT")
                        .requestMatchers(HttpMethod.GET, "/reservations/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPPORT", "ROLE_RESIDENT")
                        .requestMatchers("/resident/me").hasAnyAuthority("ROLE_RESIDENT", "ROLE_ADMIN")
                        .requestMatchers("/apartment/me").hasAnyAuthority("ROLE_RESIDENT", "ROLE_ADMIN")
                        .requestMatchers("/payment/by-resident/**").hasAuthority("ROLE_RESIDENT")
                        .requestMatchers(HttpMethod.PUT, "/residents/fix-assign-admin-account").hasAnyAuthority("ROLE_ADMIN", "ROLE_EMPLOYEE")
                        .requestMatchers("/auth/me").authenticated()

                        // catch-all
                        .anyRequest().authenticated()
                )

                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
