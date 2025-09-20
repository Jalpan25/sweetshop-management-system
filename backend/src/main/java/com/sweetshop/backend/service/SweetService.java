// Complete SweetService.java - REPLACE your current service
package com.sweetshop.backend.service;

import com.sweetshop.backend.dto.SweetRequest;
import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.repository.SweetRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SweetService {

    private final SweetRepository sweetRepository;

    public SweetService(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    public Sweet addSweet(SweetRequest request) {
        if (sweetRepository.existsByName(request.getName())) {
            throw new RuntimeException("Sweet with name '" + request.getName() + "' already exists");
        }

        Sweet sweet = new Sweet(
                request.getName(),
                request.getCategory(),
                request.getPrice(),
                request.getQuantity()
        );

        return sweetRepository.save(sweet);
    }

    public List<Sweet> getAllSweets() {
        return sweetRepository.findAll();
    }

    public Sweet getSweetById(Long id) {
        return sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found with id: " + id));
    }

    public Sweet updateSweet(Long id, SweetRequest request) {
        Sweet existingSweet = getSweetById(id);

        // Check if name already exists (excluding current sweet)
        if (!existingSweet.getName().equals(request.getName()) &&
                sweetRepository.existsByName(request.getName())) {
            throw new RuntimeException("Sweet with name '" + request.getName() + "' already exists");
        }

        existingSweet.setName(request.getName());
        existingSweet.setCategory(request.getCategory());
        existingSweet.setPrice(request.getPrice());
        existingSweet.setQuantity(request.getQuantity());

        return sweetRepository.save(existingSweet);
    }

    public void deleteSweet(Long id) {
        Sweet sweet = getSweetById(id);
        sweetRepository.delete(sweet);
    }

    public List<Sweet> searchSweets(String name, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        return sweetRepository.findByFilters(name, category, minPrice, maxPrice);
    }

    // MISSING: Purchase sweet method
    public Sweet purchaseSweet(Long id) {
        Sweet sweet = getSweetById(id);

        if (sweet.getQuantity() <= 0) {
            throw new RuntimeException("Sweet is out of stock");
        }

        sweet.setQuantity(sweet.getQuantity() - 1);
        return sweetRepository.save(sweet);
    }

    // MISSING: Restock sweet method
    public Sweet restockSweet(Long id, Integer quantity) {
        Sweet sweet = getSweetById(id);
        sweet.setQuantity(sweet.getQuantity() + quantity);
        return sweetRepository.save(sweet);
    }
}