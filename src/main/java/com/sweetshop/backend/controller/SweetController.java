package com.sweetshop.backend.controller;

import com.sweetshop.backend.dto.SweetRequest;
import com.sweetshop.backend.entity.Sweet;
import com.sweetshop.backend.service.SweetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Sweet> addSweet(@Valid @RequestBody SweetRequest request) {
        Sweet sweet = sweetService.addSweet(request);
        return ResponseEntity.status(201).body(sweet);
    }

    // GET: All sweets with optional filters (authenticated users)
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Sweet>> getAllSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        List<Sweet> sweets;
        if (name != null || category != null || minPrice != null || maxPrice != null) {
            BigDecimal min = minPrice != null ? BigDecimal.valueOf(minPrice) : null;
            BigDecimal max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : null;
            sweets = sweetService.searchSweets(name, category, min, max);
        } else {
            sweets = sweetService.getAllSweets();
        }
        return ResponseEntity.ok(sweets);
    }

    // GET: Search sweets (kept for backward compatibility)
    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Sweet>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        BigDecimal min = minPrice != null ? BigDecimal.valueOf(minPrice) : null;
        BigDecimal max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : null;
        List<Sweet> sweets = sweetService.searchSweets(name, category, min, max);
        return ResponseEntity.ok(sweets);
    }

    // PUT: Update sweet details (ADMIN only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Sweet> updateSweet(@PathVariable Long id, @Valid @RequestBody SweetRequest request) {
        Sweet updatedSweet = sweetService.updateSweet(id, request);
        return ResponseEntity.ok(updatedSweet);
    }

    // DELETE: Delete sweet (ADMIN only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSweet(@PathVariable Long id) {
        sweetService.deleteSweet(id);
        return ResponseEntity.noContent().build();
    }
}
