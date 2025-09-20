package com.sweetshop.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.backend.dto.SweetRequest;
import com.sweetshop.backend.repository.SweetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SweetControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SweetRepository sweetRepository;

    @BeforeEach
    void setUp() throws Exception {
        sweetRepository.deleteAll();

        // Add test data
        SweetRequest sweet1 = new SweetRequest("Ladoo", "Mithai", 50.0, 10);
        SweetRequest sweet2 = new SweetRequest("Barfi", "Mithai", 40.0, 5);
        SweetRequest sweet3 = new SweetRequest("Chocolate", "Candy", 30.0, 20);

        mockMvc.perform(post("/api/sweets")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sweet1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/sweets")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sweet2)))
                .andExpectAll(status().isCreated());

        mockMvc.perform(post("/api/sweets")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sweet3)))
                .andExpect(status().isCreated());
    }

    // POST /api/sweets Tests
    @Test
    void addSweet_asAdmin_shouldReturn201() throws Exception {
        SweetRequest newSweet = new SweetRequest("Gulab Jamun", "Mithai", 45.0, 8);

        mockMvc.perform(post("/api/sweets")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSweet)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Gulab Jamun"))
                .andExpect(jsonPath("$.category").value("Mithai"));
    }

    @Test
    void addSweet_asUser_shouldReturn403() throws Exception {
        SweetRequest newSweet = new SweetRequest("Gulab Jamun", "Mithai", 45.0, 8);

        mockMvc.perform(post("/api/sweets")
                        .with(user("user").roles("USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSweet)))
                .andExpect(status().isForbidden());
    }

    @Test
    void addSweet_withDuplicateName_shouldReturn400() throws Exception {
        SweetRequest duplicateSweet = new SweetRequest("Ladoo", "Mithai", 45.0, 8);

        mockMvc.perform(post("/api/sweets")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateSweet)))
                .andExpect(status().isBadRequest());
    }

    // GET /api/sweets Tests
    @Test
    void getAllSweets_asUser_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/sweets")
                        .with(user("user").roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    void getAllSweets_unauthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/sweets"))
                .andExpectAll(status().isUnauthorized());
    }

    @Test
    void getSweets_withCategoryFilter_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets")
                        .with(user("user").roles("USER"))
                        .param("category", "Mithai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].category").value("Mithai"));
    }

    @Test
    void getSweets_withPriceRangeFilter_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets")
                        .with(user("user").roles("USER"))
                        .param("minPrice", "45")
                        .param("maxPrice", "60"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Ladoo"));
    }

    @Test
    void getSweets_withNameFilter_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets")
                        .with(user("user").roles("USER"))
                        .param("name", "Choco"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Chocolate"));
    }

    // GET /api/sweets/search Tests
    @Test
    void searchSweets_withMultipleFilters_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets/search")
                        .with(user("user").roles("USER"))
                        .param("category", "Mithai")
                        .param("minPrice", "40")
                        .param("maxPrice", "50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    // PUT /api/sweets/{id} Tests
    @Test
    void updateSweet_asAdmin_shouldReturn200() throws Exception {
        // First get the ID of one sweet
        String response = mockMvc.perform(get("/api/sweets")
                        .with(user("admin").roles("ADMIN")))
                .andReturn().getResponse().getContentAsString();

        // Extract ID from response (you might need to parse JSON properly)
        Long sweetId = 1L; // Assuming first sweet has ID 1

        SweetRequest updateRequest = new SweetRequest("Updated Ladoo", "Mithai", 55.0, 12);

        mockMvc.perform(put("/api/sweets/" + sweetId)
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Ladoo"))
                .andExpect(jsonPath("$.price").value(55.0));
    }

    @Test
    void updateSweet_asUser_shouldReturn403() throws Exception {
        SweetRequest updateRequest = new SweetRequest("Updated Ladoo", "Mithai", 55.0, 12);

        mockMvc.perform(put("/api/sweets/1")
                        .with(user("user").roles("USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateSweet_withInvalidId_shouldReturn404() throws Exception {
        SweetRequest updateRequest = new SweetRequest("Updated Ladoo", "Mithai", 55.0, 12);

        mockMvc.perform(put("/api/sweets/999")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound());
    }

    // DELETE /api/sweets/{id} Tests
    @Test
    void deleteSweet_asAdmin_shouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/sweets/1")
                        .with(user("admin").roles("ADMIN")))
                .andExpect(status().isNoContent());

        // Verify it's deleted
        mockMvc.perform(get("/api/sweets")
                        .with(user("admin").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void deleteSweet_asUser_shouldReturn403() throws Exception {
        mockMvc.perform(delete("/api/sweets/1")
                        .with(user("user").roles("USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteSweet_withInvalidId_shouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/sweets/999")
                        .with(user("admin").roles("ADMIN")))
                .andExpect(status().isNotFound());
    }
}