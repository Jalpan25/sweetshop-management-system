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

    // Add a sweet
    public Sweet addSweet(SweetRequest request) {
        if (sweetRepository.existsByName(request.getName())) {
            throw new RuntimeException("Sweet already exists!");
        }

        Sweet sweet = new Sweet();
        sweet.setName(request.getName());
        sweet.setCategory(request.getCategory());
        sweet.setPrice(request.getPrice());
        sweet.setQuantity(request.getQuantity());

        return sweetRepository.save(sweet);
    }

    // Get all sweets
    public List<Sweet> getAllSweets() {
        return sweetRepository.findAll();
    }

    // Search sweets by filters
    public List<Sweet> searchSweets(String name, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        return sweetRepository.findByFilters(
                name != null && !name.isEmpty() ? name : null,
                category != null && !category.isEmpty() ? category : null,
                minPrice,
                maxPrice
        );
    }
}
