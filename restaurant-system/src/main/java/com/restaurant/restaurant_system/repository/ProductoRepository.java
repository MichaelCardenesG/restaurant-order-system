package com.restaurant.restaurant_system.repository;

import com.restaurant.restaurant_system.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByDisponibleTrue();
}
