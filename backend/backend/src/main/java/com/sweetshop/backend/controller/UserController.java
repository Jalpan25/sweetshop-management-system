package com.sweetshop.backend.controller;

import com.sweetshop.backend.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of(
                "id", currentUser.getId(),
                "email", currentUser.getUsername(),
                "name", currentUser.getName(),
                "role", currentUser.getRole()
        ));
    }
}
