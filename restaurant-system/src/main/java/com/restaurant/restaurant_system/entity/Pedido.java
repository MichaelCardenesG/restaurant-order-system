package com.restaurant.restaurant_system.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@JsonPropertyOrder({
        "id",
        "estado",
        "horaCreacion",
        "mesa",
        "detalles"
})
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    private LocalDateTime horaCreacion;

    @ManyToOne
    @JoinColumn(name = "mesa_id")
    private Mesa mesa;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PedidoDetalle> detalles;

    public Pedido(){
        this.horaCreacion = LocalDateTime.now();
        this.estado = EstadoPedido.valueOf("PENDIENTE");
    }


}
