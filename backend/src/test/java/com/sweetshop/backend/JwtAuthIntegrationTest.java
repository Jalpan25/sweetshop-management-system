package com.sweetshop.backend;

import com.sweetshop.backend.entity.User;
import com.sweetshop.backend.repository.UserRepository;
import com.sweetshop.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class JwtAuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // ensure password is encoded

    @Autowired
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll(); // clean DB before each test

        User user = new User();
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setRole("ROLE_USER");
        // ✅ encode password so authentication succeeds
        user.setPassword(passwordEncoder.encode("password123"));

        userRepository.save(user);
    }

    @Test
    void loginReturnsJwt() throws Exception {
        String jsonRequest = """
            {
              "email": "test@example.com",
              "password": "password123"
            }
            """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists()); // assert JWT exists
    }
}
