package com.restaurant.restaurant_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nombre;

    private String descripcion;

    private double precio;

    private String categoria;

    private boolean disponible;

    public Producto(){}
}
