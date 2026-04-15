package com.restaurant.restaurant_system.controller;

import com.restaurant.restaurant_system.entity.Categoria;
import com.restaurant.restaurant_system.repository.CategoriaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> editar(@PathVariable Long id, @RequestBody Categoria categoria) {
        return categoriaRepository.findById(id)
                .map(c -> {
                    c.setNombre(categoria.getNombre());
                    return ResponseEntity.ok(categoriaRepository.save(c));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        categoriaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}