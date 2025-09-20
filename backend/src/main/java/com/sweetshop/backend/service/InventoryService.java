

package com.sweetshop.backend.service;

import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.exception.SweetNotFoundException;
import com.sweetshop.backend.exception.OutOfStockException;
import com.sweetshop.backend.exception.InvalidQuantityException;
import com.sweetshop.backend.repository.SweetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class responsible for inventory management operations
 * Handles purchase and restocking of sweets
 */
@Service
@Transactional
public class InventoryService {

    private final SweetRepository sweetRepository;

    public InventoryService(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    /**
     * Purchase a sweet by decreasing its quantity by 1
     * @param sweetId Sweet ID to purchase
     * @return Updated Sweet entity
     * @throws SweetNotFoundException if sweet not found
     * @throws OutOfStockException if sweet is out of stock
     */
    public Sweet purchaseSweet(Long sweetId) {
        Sweet sweet = findSweetById(sweetId);

        if (sweet.getQuantity() <= 0) {
            throw new OutOfStockException("Sweet is out of stock");
        }

        sweet.setQuantity(sweet.getQuantity() - 1);
        return sweetRepository.save(sweet);
    }

    /**
     * Restock a sweet by adding the specified quantity
     * @param sweetId Sweet ID to restock
     * @param quantity Quantity to add to current stock
     * @return Updated Sweet entity
     * @throws SweetNotFoundException if sweet not found
     * @throws InvalidQuantityException if quantity is invalid
     */
    public Sweet restockSweet(Long sweetId, Integer quantity) {
        validateQuantity(quantity);

        Sweet sweet = findSweetById(sweetId);
        sweet.setQuantity(sweet.getQuantity() + quantity);

        return sweetRepository.save(sweet);
    }

    /**
     * Check if a sweet is available for purchase
     * @param sweetId Sweet ID to check
     * @return true if available, false otherwise
     */
    public boolean isSweetAvailable(Long sweetId) {
        try {
            Sweet sweet = findSweetById(sweetId);
            return sweet.getQuantity() > 0;
        } catch (SweetNotFoundException e) {
            return false;
        }
    }

    /**
     * Get current stock quantity for a sweet
     * @param sweetId Sweet ID
     * @return Current quantity in stock
     * @throws SweetNotFoundException if sweet not found
     */
    public Integer getCurrentStock(Long sweetId) {
        Sweet sweet = findSweetById(sweetId);
        return sweet.getQuantity();
    }

    // Private helper methods
    private Sweet findSweetById(Long sweetId) {
        return sweetRepository.findById(sweetId)
                .orElseThrow(() -> new SweetNotFoundException("Sweet not found with id: " + sweetId));
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new InvalidQuantityException("Quantity must be positive");
        }
    }
}