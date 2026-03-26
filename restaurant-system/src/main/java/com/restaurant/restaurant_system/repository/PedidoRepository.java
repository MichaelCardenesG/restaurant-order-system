package com.restaurant.restaurant_system.repository;

import java.util.List;
import com.restaurant.restaurant_system.entity.EstadoPedido;


import com.restaurant.restaurant_system.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PedidoRepository  extends JpaRepository<Pedido,Long>{
    List<Pedido> findByEstado(EstadoPedido estado);
}
