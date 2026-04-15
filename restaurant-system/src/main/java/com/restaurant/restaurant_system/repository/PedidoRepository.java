package com.restaurant.restaurant_system.repository;

import java.time.LocalDateTime;
import java.util.List;
import com.restaurant.restaurant_system.entity.EstadoPedido;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.restaurant.restaurant_system.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PedidoRepository  extends JpaRepository<Pedido,Long>{

    List<Pedido> findByEstado(EstadoPedido estado);
    List<Pedido> findByEstadoNot(EstadoPedido estado); // Returns all orders except the given status

    // Filter delivered orders by date range and table number
    @Query("SELECT p FROM Pedido p WHERE p.estado = com.restaurant.restaurant_system.entity.EstadoPedido.ENTREGADO " +
            "AND (:fechaInicio IS NULL OR p.horaCreacion >= :fechaInicio) " +
            "AND (:fechaFin IS NULL OR p.horaCreacion <= :fechaFin) " +
            "AND (:mesaNumero IS NULL OR p.mesa.numero = :mesaNumero)")
    List<Pedido> findHistorial(@Param("fechaInicio") LocalDateTime fechaInicio,
                               @Param("fechaFin") LocalDateTime fechaFin,
                               @Param("mesaNumero") Integer mesaNumero);
}
