package com.restaurant.restaurant_system.controller;

import com.restaurant.restaurant_system.dto.PedidoCocinaDTO;
import com.restaurant.restaurant_system.dto.PedidoRequest;
import com.restaurant.restaurant_system.entity.EstadoPedido;
import com.restaurant.restaurant_system.entity.Pedido;
import com.restaurant.restaurant_system.repository.PedidoRepository;
import com.restaurant.restaurant_system.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {



    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService){
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<Pedido> listarPedidos(){
        return pedidoService.listarPedidos();
    }

    @GetMapping("/pendientes")
    public List<PedidoCocinaDTO> pedidosPendientes(){
        return pedidoService.pedidosPendientes();
    }


    @PatchMapping("/{id}/estado")
    public Pedido cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoPedido estado){
        return pedidoService.cambiarEstado(id,estado);
    }


    @PostMapping
    public Pedido crearPedido(@Valid @RequestBody PedidoRequest request){
        return pedidoService.crearPedido(request);
    }

}
