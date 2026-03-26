package com.restaurant.restaurant_system.service;

import com.restaurant.restaurant_system.entity.Mesa;
import com.restaurant.restaurant_system.repository.MesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaService {
    private final MesaRepository repository;

    public MesaService(MesaRepository repository) {
        this.repository = repository;
    }

    public List<Mesa> obtenerMesas() {
        return repository.findAll();
    }

    public Mesa crearMesa(Mesa mesa) {
        return repository.save(mesa);
    }
}