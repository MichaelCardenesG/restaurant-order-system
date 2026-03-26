package com.restaurant.restaurant_system.dto;


import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;


@Getter
@Setter
public class ItemPedidoRequest {

    @NotNull(message = "productoId es obligatorio")
    private Long productoId;
    @Min(value = 1, message = "La cantidad debe ser mayor que 0")
    private int cantidad;


}
