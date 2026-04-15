package com.restaurant.restaurant_system.dto;

public class ItemCocinaDTO {

    private String producto;
    private int cantidad;
    private String notas;

    public ItemCocinaDTO(String producto, int cantidad, String notas) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.notas = notas;
    }

    public String getProducto() {
        return producto;
    }

    public int getCantidad() {
        return cantidad;
    }
    public String getNotas() { return notas; }
}