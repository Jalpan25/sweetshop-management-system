package com.sweetshop.backend.service;

import com.sweetshop.backend.dto.SweetRequest;
import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.repository.SweetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addSweet_withValidRequest_shouldReturnSweet() {
        // Arrange
        SweetRequest request = new SweetRequest("Ladoo", "Mithai", 50.0, 10);
        Sweet sweet = new Sweet("Ladoo", "Mithai", 50.0, 10);

        when(sweetRepository.existsByName("Ladoo")).thenReturn(false);
        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweet);

        // Act
        Sweet result = sweetService.addSweet(request);

        // Assert
        assertThat(result.getName()).isEqualTo("Ladoo");
        assertThat(result.getCategory()).isEqualTo("Mithai");
        verify(sweetRepository).save(any(Sweet.class));
    }

    @Test
    void addSweet_withDuplicateName_shouldThrowException() {
        // Arrange
        SweetRequest request = new SweetRequest("Ladoo", "Mithai", 50.0, 10);
        when(sweetRepository.existsByName("Ladoo")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> sweetService.addSweet(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void getAllSweets_shouldReturnListOfSweets() {
        // Arrange
        List<Sweet> sweets = Arrays.asList(
                new Sweet("Ladoo", "Mithai", 50.0, 10),
                new Sweet("Chocolate", "Candy", 30.0, 20)
        );
        when(sweetRepository.findAll()).thenReturn(sweets);

        // Act
        List<Sweet> result = sweetService.getAllSweets();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Ladoo");
    }

    @Test
    void getSweetById_withValidId_shouldReturnSweet() {
        // Arrange
        Sweet sweet = new Sweet("Ladoo", "Mithai", 50.0, 10);
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        // Act
        Sweet result = sweetService.getSweetById(1L);

        // Assert
        assertThat(result.getName()).isEqualTo("Ladoo");
    }

    @Test
    void getSweetById_withInvalidId_shouldThrowException() {
        // Arrange
        when(sweetRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> sweetService.getSweetById(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Sweet not found");
    }

    @Test
    void updateSweet_withValidData_shouldReturnUpdatedSweet() {
        // Arrange
        Sweet existingSweet = new Sweet("Ladoo", "Mithai", 50.0, 10);
        SweetRequest updateRequest = new SweetRequest("Updated Ladoo", "Mithai", 60.0, 15);

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(existingSweet));
        when(sweetRepository.existsByName("Updated Ladoo")).thenReturn(false);
        when(sweetRepository.save(any(Sweet.class))).thenReturn(existingSweet);

        // Act
        Sweet result = sweetService.updateSweet(1L, updateRequest);

        // Assert
        assertThat(result.getName()).isEqualTo("Updated Ladoo");
        assertThat(result.getPrice()).isEqualTo(60.0);
    }

    @Test
    void deleteSweet_withValidId_shouldDeleteSweet() {
        // Arrange
        Sweet sweet = new Sweet("Ladoo", "Mithai", 50.0, 10);
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        // Act
        sweetService.deleteSweet(1L);

        // Assert
        verify(sweetRepository).delete(sweet);
    }

    @Test
    void searchSweets_withFilters_shouldReturnFilteredSweets() {
        // Arrange
        List<Sweet> filteredSweets = Arrays.asList(
                new Sweet("Ladoo", "Mithai", 50.0, 10)
        );
        when(sweetRepository.findByFilters("Ladoo", "Mithai", BigDecimal.valueOf(40), BigDecimal.valueOf(60)))
                .thenReturn(filteredSweets);

        // Act
        List<Sweet> result = sweetService.searchSweets("Ladoo", "Mithai",
                BigDecimal.valueOf(40), BigDecimal.valueOf(60));

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Ladoo");
    }
}
