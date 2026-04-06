import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BACKEND_URL = "http://localhost:8080";

function Cocina() {
  const [pedidos, setPedidos] = useState([]);

  const colorPorEstado = (estado) => {
              if (estado === "PENDIENTE") return "#fff8e1";       // amarillo
              if (estado === "EN_PREPARACION") return "#e3f2fd";  // azul
              if (estado === "ENTREGADO") return "#e8f5e9";       // verde
              return "#ffffff";
            };

  useEffect(() => {
    // Cargar pedidos pendientes al inicio
    fetch(`${BACKEND_URL}/pedidos/pendientes`)
      .then((res) => res.json())
      .then((data) => setPedidos(data));

    // Conectar WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
      onConnect: () => {
        client.subscribe("/topic/pedidos", (message) => {
          const data = JSON.parse(message.body);

          if (data.tipo === "NUEVO_PEDIDO") {
            setPedidos((prev) => [...prev, data]);
          } else if (data.tipo === "ACTUALIZACION_ESTADO") {
            setPedidos((prev) =>
              prev.map((p) =>
              p.pedidoId === data.pedidoId ? { ...p, estado: data.estado } : p
            )
            );
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  const cambiarEstado = (pedidoId, nuevoEstado) => {
    fetch(`${BACKEND_URL}/pedidos/${pedidoId}/estado?estado=${nuevoEstado}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🍳 Vista Cocina</h1>
      {pedidos.length === 0 ? (
        <p>No hay pedidos pendientes.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {pedidos.map((pedido) => (
            <div
              key={pedido.pedidoId}
              style={{
                border: "2px solid #333",
                borderRadius: "8px",
                padding: "16px",
                width: "250px",
                background: colorPorEstado(pedido.estado),
              }}
            >
              <h2>Mesa #{pedido.mesa}</h2>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <ul>
                {pedido.items.map((item, i) => (
                  <li key={i}>
                    {item.cantidad}x {item.producto}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={() => cambiarEstado(pedido.pedidoId, "EN_PREPARACION")}>
                  👨‍🍳 Preparando
                </button>
                <button onClick={() => cambiarEstado(pedido.pedidoId, "ENTREGADO")}>
                  ✅ Entregado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cocina;