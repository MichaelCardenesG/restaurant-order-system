package com.restaurant.restaurant_system.controller;
import com.restaurant.restaurant_system.entity.Mesa;
import com.restaurant.restaurant_system.repository.MesaRepository;
import com.restaurant.restaurant_system.service.MesaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/mesas")
public class MesaController {
    private final MesaService mesaService;

    public MesaController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @GetMapping
    public List<Mesa> getMesas() {
        return mesaService.obtenerMesas();
    }

    @PostMapping
    public Mesa crearMesa(@RequestBody Mesa mesa) {
        return mesaService.crearMesa(mesa);
    }
}