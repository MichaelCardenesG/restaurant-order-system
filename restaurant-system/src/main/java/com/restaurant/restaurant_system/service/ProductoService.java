package com.restaurant.restaurant_system.service;

import com.restaurant.restaurant_system.entity.Producto;
import com.restaurant.restaurant_system.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {
    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> listarProductos() {
        return repository.findAll();
    }

    public Producto crearProducto(Producto producto) {
        return repository.save(producto);
    }
}