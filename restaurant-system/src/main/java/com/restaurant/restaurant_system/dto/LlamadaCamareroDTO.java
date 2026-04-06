package com.restaurant.restaurant_system.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LlamadaCamareroDTO {
    private String tipo;
    private int mesaNumero;
    private Long mesaId;
}