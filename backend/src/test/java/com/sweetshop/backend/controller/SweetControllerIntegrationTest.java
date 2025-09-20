package com.sweetshop.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.backend.dto.SweetRequest;
import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.repository.SweetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class SweetControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SweetRepository sweetRepository;

    private Sweet testSweet1;
    private Sweet testSweet2;
    private Sweet testSweet3;

    @BeforeEach
    void setUp() {
        sweetRepository.deleteAll();

        testSweet1 = new Sweet("Ladoo", "Mithai", 50.0, 10);
        testSweet2 = new Sweet("Barfi", "Mithai", 40.0, 5);
        testSweet3 = new Sweet("Chocolate", "Candy", 30.0, 20);

        testSweet1 = sweetRepository.save(testSweet1);
        testSweet2 = sweetRepository.save(testSweet2);
        testSweet3 = sweetRepository.save(testSweet3);
    }

    // POST /api/sweets Tests
    @Test
    @WithMockUser(roles = "ADMIN")
    void addSweet_asAdmin_shouldReturn201() throws Exception {
        SweetRequest newSweet = new SweetRequest("Gulab Jamun", "Mithai", 45.0, 8);

        mockMvc.perform(post("/api/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSweet)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Gulab Jamun"))
                .andExpect(jsonPath("$.category").value("Mithai"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void addSweet_asUser_shouldReturn403() throws Exception {
        SweetRequest newSweet = new SweetRequest("Gulab Jamun", "Mithai", 45.0, 8);

        mockMvc.perform(post("/api/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSweet)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void addSweet_withDuplicateName_shouldReturn400() throws Exception {
        SweetRequest duplicateSweet = new SweetRequest("Ladoo", "Mithai", 45.0, 8);

        mockMvc.perform(post("/api/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateSweet)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void addSweet_withInvalidData_shouldReturn400() throws Exception {
        SweetRequest invalidSweet = new SweetRequest("", "", -10.0, -5);

        mockMvc.perform(post("/api/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidSweet)))
                .andExpect(status().isBadRequest());
    }

    // GET /api/sweets Tests
    @Test
    @WithMockUser(roles = "USER")
    void getAllSweets_asUser_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/sweets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllSweets_asAdmin_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/sweets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    void getAllSweets_unauthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/sweets"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void getSweets_withCategoryFilter_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets")
                        .param("category", "Mithai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getSweets_withPriceRangeFilter_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets")
                        .param("minPrice", "45")
                        .param("maxPrice", "60"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Ladoo"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getSweets_withNameFilter_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets")
                        .param("name", "Choco"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Chocolate"));
    }

    // GET /api/sweets/search Tests
    @Test
    @WithMockUser(roles = "USER")
    void searchSweets_withMultipleFilters_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets/search")
                        .param("category", "Mithai")
                        .param("minPrice", "40")
                        .param("maxPrice", "50"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @WithMockUser(roles = "USER")
    void searchSweets_withNameFilter_shouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/sweets/search")
                        .param("name", "Ladoo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Ladoo"));
    }

    // PUT /api/sweets/{id} Tests
    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSweet_asAdmin_shouldReturn200() throws Exception {
        SweetRequest updateRequest = new SweetRequest("Updated Ladoo", "Mithai", 55.0, 12);

        mockMvc.perform(put("/api/sweets/" + testSweet1.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Ladoo"))
                .andExpect(jsonPath("$.price").value(55.0));
    }

    @Test
    @WithMockUser(roles = "USER")
    void updateSweet_asUser_shouldReturn403() throws Exception {
        SweetRequest updateRequest = new SweetRequest("Updated Ladoo", "Mithai", 55.0, 12);

        mockMvc.perform(put("/api/sweets/" + testSweet1.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSweet_withInvalidId_shouldReturn404() throws Exception {
        SweetRequest updateRequest = new SweetRequest("Updated Ladoo", "Mithai", 55.0, 12);

        mockMvc.perform(put("/api/sweets/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSweet_withDuplicateName_shouldReturn400() throws Exception {
        SweetRequest updateRequest = new SweetRequest("Barfi", "Mithai", 55.0, 12);

        mockMvc.perform(put("/api/sweets/" + testSweet1.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    // DELETE /api/sweets/{id} Tests
    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteSweet_asAdmin_shouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/sweets/" + testSweet1.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/sweets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @WithMockUser(roles = "USER")
    void deleteSweet_asUser_shouldReturn403() throws Exception {
        mockMvc.perform(delete("/api/sweets/" + testSweet1.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteSweet_withInvalidId_shouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/sweets/999"))
                .andExpect(status().isNotFound());
    }
}