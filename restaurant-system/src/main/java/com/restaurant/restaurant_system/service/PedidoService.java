package com.restaurant.restaurant_system.service;

import com.restaurant.restaurant_system.dto.ItemCocinaDTO;
import com.restaurant.restaurant_system.dto.PedidoRequest;
import com.restaurant.restaurant_system.dto.ItemPedidoRequest;
import com.restaurant.restaurant_system.entity.*;
import com.restaurant.restaurant_system.exception.ResourceNotFoundException;
import com.restaurant.restaurant_system.repository.*;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import com.restaurant.restaurant_system.dto.PedidoCocinaDTO;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final MesaRepository mesaRepository;
    private final ProductoRepository productoRepository;
    private final WebSocketService webSocketService;

    public PedidoService(
            PedidoRepository pedidoRepository,
            MesaRepository mesaRepository,
            ProductoRepository productoRepository,
            WebSocketService webSocketService
    ) {
        this.pedidoRepository = pedidoRepository;
        this.mesaRepository = mesaRepository;
        this.productoRepository = productoRepository;
        this.webSocketService = webSocketService;
    }
    public List<Pedido> listarPedidos(){
        return pedidoRepository.findAll();
    }

    public Pedido crearPedido(PedidoRequest request) {

        Mesa mesa = mesaRepository.findById(request.getMesaId())
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada"));

        Pedido pedido = new Pedido();
        pedido.setMesa(mesa);

        List<PedidoDetalle> detalles = new ArrayList<>();



        for (ItemPedidoRequest item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

            PedidoDetalle detalle = new PedidoDetalle();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());

            detalles.add(detalle);

        }
        pedido.setDetalles(detalles);
        //save
        Pedido saved = pedidoRepository.save(pedido);
        //send to websocket
        webSocketService.enviarPedido(saved, "NUEVO_PEDIDO");

        return saved;
    }
    public Pedido cambiarEstado(Long id,EstadoPedido estado){
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
        pedido.setEstado(estado);

        Pedido actualizado = pedidoRepository.save(pedido);

        webSocketService.enviarPedido(actualizado,"ACTUALIZACION_ESTADO");

        return actualizado;
    }
    @Transactional
    public List<PedidoCocinaDTO> pedidosPendientes() {
        return pedidoRepository.findByEstado(EstadoPedido.PENDIENTE)
                .stream()
                .map(pedido -> new PedidoCocinaDTO(
                        pedido.getId(),
                        pedido.getMesa().getNumero(),
                        pedido.getDetalles().stream()
                                .map(d -> new ItemCocinaDTO(
                                        d.getProducto().getNombre(),
                                        d.getCantidad()
                                ))
                                .toList(),
                        pedido.getEstado().toString(),
                        "PENDIENTE"

                ))
                .toList();
    }
    @Transactional
    public List<PedidoCocinaDTO> pedidosActivos() {
        // Return all orders that are not delivered
        return pedidoRepository.findByEstadoNot(EstadoPedido.ENTREGADO)
                .stream()
                .map(pedido -> new PedidoCocinaDTO(
                        pedido.getId(),
                        pedido.getMesa().getNumero(),
                        pedido.getDetalles().stream()
                                .map(d -> new ItemCocinaDTO(
                                        d.getProducto().getNombre(),
                                        d.getCantidad()
                                ))
                                .toList(),
                        pedido.getEstado().toString(),
                        "ACTIVO"
                ))
                .toList();
    }


}


