package com.sweetshop.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.backend.entity.User;
import com.sweetshop.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import jakarta.transaction.Transactional;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class JwtAuthIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void loginReturnsJwt() throws Exception {
        User u = new User("Test User", "test@example.com", passwordEncoder.encode("secret"), "USER");
        userRepository.save(u);

        String loginJson = "{\"email\":\"test@example.com\",\"password\":\"secret\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString());
    }

    @Test
    void protectedEndpoint_requiresToken_and_allowsWithToken() throws Exception {
        User u = new User("Me", "me@example.com", passwordEncoder.encode("p"), "USER");
        userRepository.save(u);

        String loginJson = "{\"email\":\"me@example.com\",\"password\":\"p\"}";

        // get token
        String resp = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(resp).get("token").asText();

        // without token -> 401
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());

        // with token -> 200
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("me@example.com"));
    }
}
