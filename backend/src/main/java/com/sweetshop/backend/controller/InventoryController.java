// File: src/main/java/com/sweetshop/backend/controller/InventoryController.java

package com.sweetshop.backend.controller;

import com.sweetshop.backend.dto.RestockRequest;
import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for inventory management operations
 * Handles purchase and restocking endpoints
 */
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * Purchase a sweet - decreases quantity by 1
     * Available to both USER and ADMIN roles
     */
    @PostMapping("/sweets/{id}/purchase")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> purchaseSweet(@PathVariable Long id) {
        try {
            Sweet sweet = inventoryService.purchaseSweet(id);
            return ResponseEntity.ok(sweet);
        } catch (Exception e) {
            return handleInventoryException(e);
        }
    }

    /**
     * Restock a sweet - increases quantity by specified amount
     * Available only to ADMIN role
     */
    @PostMapping("/sweets/{id}/restock")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> restockSweet(@PathVariable Long id, @Valid @RequestBody RestockRequest request) {
        try {
            Sweet sweet = inventoryService.restockSweet(id, request.getQuantity());
            return ResponseEntity.ok(sweet);
        } catch (Exception e) {
            return handleInventoryException(e);
        }
    }

    /**
     * Check if a sweet is available for purchase
     * Available to both USER and ADMIN roles
     */
    @GetMapping("/sweets/{id}/availability")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> checkAvailability(@PathVariable Long id) {
        try {
            boolean available = inventoryService.isSweetAvailable(id);
            Integer currentStock = inventoryService.getCurrentStock(id);

            Map<String, Object> response = new HashMap<>();
            response.put("sweetId", id);
            response.put("available", available);
            response.put("currentStock", currentStock);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return handleInventoryException(e);
        }
    }

    // Private helper method for exception handling
    private ResponseEntity<?> handleInventoryException(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());

        if (e.getMessage().contains("not found")) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.badRequest().body(error);
    }
}