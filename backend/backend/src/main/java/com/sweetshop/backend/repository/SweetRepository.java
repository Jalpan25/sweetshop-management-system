package com.sweetshop.backend.repository;

import com.sweetshop.backend.entity.Sweet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface SweetRepository extends JpaRepository<Sweet, Long> {

    boolean existsByName(String name);

    @Query("SELECT s FROM Sweet s " +
            "WHERE (:name IS NULL OR s.name LIKE %:name%) " +
            "AND (:category IS NULL OR s.category = :category) " +
            "AND (:minPrice IS NULL OR s.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR s.price <= :maxPrice)")
    List<Sweet> findByFilters(@Param("name") String name,
                              @Param("category") String category,
                              @Param("minPrice") BigDecimal minPrice,
                              @Param("maxPrice") BigDecimal maxPrice);
}
