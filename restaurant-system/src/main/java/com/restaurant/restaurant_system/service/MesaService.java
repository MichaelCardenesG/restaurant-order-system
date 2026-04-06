package com.restaurant.restaurant_system.service;

import com.restaurant.restaurant_system.entity.Mesa;
import com.restaurant.restaurant_system.repository.MesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaService {
    private final MesaRepository repository;
    private final WebSocketService webSocketService;

    public MesaService(MesaRepository repository, WebSocketService webSocketService) {
        this.repository = repository;
        this.webSocketService = webSocketService;
    }

    /*public MesaService(MesaRepository repository) {
        this.repository = repository;
    }*/
    public void llamarCamarero(Long id) {
        Mesa mesa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
        webSocketService.llamarCamarero(mesa);
    }

    public List<Mesa> obtenerMesas() {
        return repository.findAll();
    }

    public Mesa crearMesa(Mesa mesa) {
        return repository.save(mesa);
    }

    public Mesa editarMesa(Long id, Mesa mesa) {
        // Find existing table and update its fields
        Mesa existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
        existing.setNumero(mesa.getNumero());
        existing.setEstado(mesa.getEstado());
        return repository.save(existing);
    }

    public void eliminarMesa(Long id) {
        // Delete table by id
        repository.deleteById(id);
    }

}