package com.restaurant.restaurant_system.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PedidoCocinaDTO {

    private Long pedidoId;
    private int mesa;
    private List<ItemCocinaDTO>items;
    private String estado;
    private String tipo;
    private LocalDateTime horaCreacion;



}
