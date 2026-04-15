package com.restaurant.restaurant_system.repository;

import com.restaurant.restaurant_system.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}