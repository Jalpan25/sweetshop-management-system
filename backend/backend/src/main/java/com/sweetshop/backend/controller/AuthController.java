package com.sweetshop.backend.controller;

import com.sweetshop.backend.dto.JwtResponse;
import com.sweetshop.backend.entity.User;
import com.sweetshop.backend.security.JwtUtil;
import com.sweetshop.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User saved = authService.register(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User loggedIn = authService.login(user.getEmail(), user.getPassword());
        String token = jwtUtil.generateToken(loggedIn.getEmail());
        JwtResponse resp = new JwtResponse(token, loggedIn.getId(), loggedIn.getEmail(), loggedIn.getName(), loggedIn.getRole());
        return ResponseEntity.ok(resp);
    }
}
