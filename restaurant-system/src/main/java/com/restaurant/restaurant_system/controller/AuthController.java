package com.restaurant.restaurant_system.controller;

import com.restaurant.restaurant_system.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;

    // Hardcoded admin credentials for now
    // These will be moved to the database later
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Validate credentials
        if (ADMIN_USERNAME.equals(username) && ADMIN_PASSWORD.equals(password)) {
            String token = jwtService.generateToken(username);
            return ResponseEntity.ok(Map.of("token", token));
        }

        // Return 401 if credentials are wrong
        return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
    }
}