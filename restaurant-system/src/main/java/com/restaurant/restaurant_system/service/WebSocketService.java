package com.restaurant.restaurant_system.service;

import com.restaurant.restaurant_system.dto.ItemCocinaDTO;
import com.restaurant.restaurant_system.dto.PedidoCocinaDTO;
import com.restaurant.restaurant_system.entity.Pedido;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    public void enviarPedido(Pedido pedido,String tipo) {

        List<ItemCocinaDTO> items = pedido.getDetalles()
                .stream()
                .map(d -> new ItemCocinaDTO(
                        d.getProducto().getNombre(),
                        d.getCantidad()
                ))
                .toList();

        PedidoCocinaDTO dto = new PedidoCocinaDTO(
                pedido.getId(),
                pedido.getMesa().getNumero(),
                items,
                pedido.getEstado().toString(),
                tipo
        );

        messagingTemplate.convertAndSend("/topic/pedidos", dto);
    }
}
