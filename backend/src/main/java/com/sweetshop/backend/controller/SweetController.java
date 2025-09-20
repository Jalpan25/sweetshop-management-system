package com.sweetshop.backend.controller;

import com.sweetshop.backend.dto.SweetRequest;
import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.service.SweetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetService sweetService;

    public SweetController(SweetService sweetService) {
        this.sweetService = sweetService;
    }

    // POST: Add sweet (ADMIN only)
    @PostMapping
    public ResponseEntity<Sweet> addSweet(@RequestBody SweetRequest request) {
        Sweet sweet = sweetService.addSweet(request);
        return ResponseEntity.status(201).body(sweet);
    }

    // GET: All sweets (authenticated users)
    @GetMapping
    public ResponseEntity<List<Sweet>> getAllSweets() {
        return ResponseEntity.ok(sweetService.getAllSweets());
    }

    // GET: Search sweets
    @GetMapping("/search")
    public ResponseEntity<List<Sweet>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<Sweet> sweets = sweetService.searchSweets(name, category, minPrice, maxPrice);
        return ResponseEntity.ok(sweets);
    }
}
