// File: src/test/java/com/sweetshop/backend/controller/InventoryControllerTest.java
// SUPER SIMPLE - Basic integration tests only

package com.sweetshop.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(authorities = "ROLE_USER")
    void purchaseSweet_ReturnsResponse() throws Exception {
        mockMvc.perform(post("/api/inventory/sweets/1/purchase")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()); // Expect 404 since sweet doesn't exist
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void restockSweet_ReturnsResponse() throws Exception {
        String requestBody = "{\"quantity\": 5}";

        mockMvc.perform(post("/api/inventory/sweets/1/restock")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound()); // Expect 404 since sweet doesn't exist
    }
}
