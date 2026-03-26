package com.restaurant.restaurant_system.repository;

import com.restaurant.restaurant_system.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
