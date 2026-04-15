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
        return repository.findByDisponibleTrue();
    }

    public Producto crearProducto(Producto producto) {
        return repository.save(producto);
    }

    public Producto editarProducto(Long id, Producto producto) {
        // Find existing product and update its fields
        Producto existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        existing.setNombre(producto.getNombre());
        existing.setDescripcion(producto.getDescripcion());
        existing.setPrecio(producto.getPrecio());
        existing.setCategoria(producto.getCategoria());
        existing.setDisponible(producto.isDisponible());
        return repository.save(existing);
    }

    public void eliminarProducto(Long id) {
        Producto producto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setDisponible(false);
        repository.save(producto);
    }
}