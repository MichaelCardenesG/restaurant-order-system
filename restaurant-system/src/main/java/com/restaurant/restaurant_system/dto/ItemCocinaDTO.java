package com.restaurant.restaurant_system.dto;

public class ItemCocinaDTO {

    private String producto;
    private int cantidad;

    public ItemCocinaDTO(String producto, int cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }

    public String getProducto() {
        return producto;
    }

    public int getCantidad() {
        return cantidad;
    }
}