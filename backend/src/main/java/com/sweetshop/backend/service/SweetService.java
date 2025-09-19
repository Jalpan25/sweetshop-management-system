package com.sweetshop.backend.service;

import com.sweetshop.backend.dto.SweetRequest;
import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.repository.SweetRepository;
import org.springframework.stereotype.Service;

@Service
public class SweetService {

    private final SweetRepository sweetRepository;

    public SweetService(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

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
}
