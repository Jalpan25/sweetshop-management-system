// File: src/test/java/com/sweetshop/backend/service/InventoryServiceTest.java
// SUPER SIMPLE - No complex setup, just basic tests

package com.sweetshop.backend.service;

import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.repository.SweetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    void purchaseSweet_Success() {
        // Given
        Sweet sweet = new Sweet();
        sweet.setId(1L);
        sweet.setQuantity(5);

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(any())).thenReturn(sweet);

        // When
        Sweet result = inventoryService.purchaseSweet(1L);

        // Then
        assertEquals(4, result.getQuantity());
    }

    @Test
    void restockSweet_Success() {
        // Given
        Sweet sweet = new Sweet();
        sweet.setId(1L);
        sweet.setQuantity(5);

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(any())).thenReturn(sweet);

        // When
        Sweet result = inventoryService.restockSweet(1L, 10);

        // Then
        assertEquals(15, result.getQuantity());
    }
}