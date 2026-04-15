package com.restaurant.restaurant_system.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }
    // CORS configuration - allow requests from the React frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Apply CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF - not needed for REST APIs with JWT
                .csrf(csrf -> csrf.disable())

                // Stateless session - no server-side sessions
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - no authentication required
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/productos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/mesas").permitAll()
                        .requestMatchers(HttpMethod.POST, "/pedidos").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/pedidos/*/estado").permitAll()
                        .requestMatchers(HttpMethod.GET, "/pedidos/pendientes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/pedidos/activos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/pedidos/historial").permitAll()
                        .requestMatchers(HttpMethod.POST, "/mesas/*/llamar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categorias").permitAll()


                        // Admin endpoints - require authentication
                        .requestMatchers(HttpMethod.POST, "/productos").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/productos/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/productos/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/mesas").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/mesas/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/mesas/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/categorias/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/categorias").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/categorias/**").authenticated()

                )

                // Add JWT filter before the default authentication filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}