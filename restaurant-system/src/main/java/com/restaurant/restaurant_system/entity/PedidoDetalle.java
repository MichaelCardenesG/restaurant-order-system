package com.restaurant.restaurant_system.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class PedidoDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int cantidad;

    private String notas;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonBackReference
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    public PedidoDetalle(){}




}
