package com.sweetshop.backend.service;

import com.sweetshop.backend.entity.User;
import com.sweetshop.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void registerThrowsWhenEmailExists() {
        userRepository.deleteAll();
        User u = new User();
        u.setName("Test");
        u.setEmail("test@example.com");
        u.setPassword("pass");
        authService.register(u); // first register should work

        Exception ex = assertThrows(RuntimeException.class, () -> {
            authService.register(u); // second should throw
        });
        assertTrue(ex.getMessage().toLowerCase().contains("email"));
    }
    @Test
    void loginSucceedsWithValidCredentials() {
        userRepository.deleteAll();

        User u = new User();
        u.setName("Test");
        u.setEmail("login@example.com");
        u.setPassword("secret");
        authService.register(u);

        User loggedIn = authService.login("login@example.com", "secret");

        assertNotNull(loggedIn);
        assertEquals("login@example.com", loggedIn.getEmail());
    }

    @Test
    void loginFailsWithWrongPassword() {
        userRepository.deleteAll();

        User u = new User();
        u.setName("Test");
        u.setEmail("loginfail@example.com");
        u.setPassword("rightpass");
        authService.register(u);

        Exception ex = assertThrows(RuntimeException.class, () -> {
            authService.login("loginfail@example.com", "wrongpass");
        });

        assertTrue(ex.getMessage().toLowerCase().contains("invalid"));
    }

}
