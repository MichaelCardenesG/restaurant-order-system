import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BACKEND_URL = "http://localhost:8080";

function Camarero() {
  const [llamadas, setLlamadas] = useState([]);

  // Connect to WebSocket to receive waiter call notifications
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
      onConnect: () => {
        client.subscribe("/topic/camarero", (message) => {
          const data = JSON.parse(message.body);

          // Add new waiter call to the list
          if (data.tipo === "LLAMADA_CAMARERO") {
            setLlamadas((prev) => [
              { ...data, hora: new Date().toLocaleTimeString(), atendida: false },
              ...prev,
            ]);
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  // Mark a call as attended
  const marcarAtendida = (mesaId) => {
    setLlamadas((prev) =>
      prev.map((l) => (l.mesaId === mesaId ? { ...l, atendida: true } : l))
    );
  };

  const pendientes = llamadas.filter((l) => !l.atendida);
  const atendidas = llamadas.filter((l) => l.atendida);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🧑‍🍽️ Vista Camarero</h1>

      {/* Pending calls */}
      <h2>🔔 Llamadas pendientes ({pendientes.length})</h2>
      {pendientes.length === 0 ? (
        <p style={{ color: "#999" }}>No hay llamadas pendientes.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
          {pendientes.map((llamada, i) => (
            <div
              key={i}
              style={{
                border: "2px solid #ff9800",
                borderRadius: "8px",
                padding: "16px",
                width: "200px",
                background: "#fff8e1",
              }}
            >
              <h2 style={{ margin: "0 0 8px" }}>Mesa #{llamada.mesaNumero}</h2>
              <p style={{ margin: "0 0 12px", color: "#666", fontSize: "13px" }}>
                {llamada.hora}
              </p>
              <button
                onClick={() => marcarAtendida(llamada.mesaId)}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#4caf50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ✅ Atendida
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Attended calls */}
      {atendidas.length > 0 && (
        <>
          <h2 style={{ color: "#999" }}>✅ Atendidas ({atendidas.length})</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {atendidas.map((llamada, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  width: "200px",
                  background: "#f5f5f5",
                  opacity: 0.6,
                }}
              >
                <h2 style={{ margin: "0 0 8px" }}>Mesa #{llamada.mesaNumero}</h2>
                <p style={{ margin: "0", color: "#666", fontSize: "13px" }}>
                  {llamada.hora}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Camarero;