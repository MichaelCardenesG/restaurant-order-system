import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BACKEND_URL = "http://localhost:8080";

function Mesa() {
  const [mesaNumero, setMesaNumero] = useState("");
  const [mesaConfirmada, setMesaConfirmada] = useState(false);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [pedidoActual, setPedidoActual] = useState(null); // Current order being tracked

  // Connect to WebSocket to track order status in real time
  useEffect(() => {
    if (!pedidoActual) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
      onConnect: () => {
        client.subscribe("/topic/pedidos", (message) => {
          const data = JSON.parse(message.body);

          // Update order status when kitchen changes it
          if (
            data.tipo === "ACTUALIZACION_ESTADO" &&
            data.pedidoId === pedidoActual.id
          ) {
            setPedidoActual((prev) => ({ ...prev, estado: data.estado }));
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [pedidoActual?.id]);

  // Fetch menu products once table is confirmed
  useEffect(() => {
    if (mesaConfirmada) {
      fetch(`${BACKEND_URL}/productos`)
        .then((res) => res.json())
        .then((data) => setProductos(data));
    }
  }, [mesaConfirmada]);

  // Confirm table number entered by customer
  const confirmarMesa = () => {
    if (mesaNumero.trim() !== "") {
      setMesaConfirmada(true);
    }
  };

  // Add product to cart or increase quantity if already exists
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Decrease product quantity or remove from cart if quantity reaches 0
  const quitarDelCarrito = (productoId) => {
    setCarrito((prev) =>
      prev
        .map((p) => (p.id === productoId ? { ...p, cantidad: p.cantidad - 1 } : p))
        .filter((p) => p.cantidad > 0)
    );
  };

  // Send order to backend
  const confirmarPedido = () => {
    if (carrito.length === 0) return;

    // Find the table by number
    fetch(`${BACKEND_URL}/mesas`)
      .then((res) => res.json())
      .then((mesas) => {
        const mesa = mesas.find((m) => m.numero === parseInt(mesaNumero));
        if (!mesa) {
          alert("Mesa no encontrada");
          return;
        }

        const pedido = {
          mesaId: mesa.id,
          items: carrito.map((p) => ({
            productoId: p.id,
            cantidad: p.cantidad,
          })),
        };

        // Post the order and save the response to track it
        return fetch(`${BACKEND_URL}/pedidos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pedido),
        })
          .then((res) => res.json())
          .then((pedidoCreado) => {
            setCarrito([]);
            setPedidoActual(pedidoCreado); // Start tracking the order
          });
      });
  };

  // Group products by category
  const productosPorCategoria = productos.reduce((acc, producto) => {
    const cat = producto.categoria || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(producto);
    return acc;
  }, {});

  // Status label and color for order tracking screen
  const estadoInfo = (estado) => {
    if (estado === "PENDIENTE")
      return { label: "⏳ Pendiente", color: "#fff8e1" };
    if (estado === "EN_PREPARACION")
      return { label: "👨‍🍳 En preparación", color: "#e3f2fd" };
    if (estado === "ENTREGADO")
      return { label: "✅ Entregado", color: "#e8f5e9" };
    return { label: estado, color: "#fff" };
  };
  // Call waiter by sending a request to the backend
    const llamarCamarero = () => {
      const mesaId = pedidoActual.mesa?.id || pedidoActual.mesaId;
      fetch(`${BACKEND_URL}/mesas/${mesaId}/llamar`, {
        method: "POST",
      }).then(() => alert("¡Camarero llamado!"));
    };

  // --- ORDER TRACKING SCREEN ---
  if (pedidoActual) {
    const { label, color } = estadoInfo(pedidoActual.estado);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "sans-serif",
          background: color,
          transition: "background 0.5s",
        }}
      >
        <h1>Mesa #{mesaNumero}</h1>
        <h2>Estado de tu pedido:</h2>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            padding: "20px 40px",
            borderRadius: "12px",
            border: "2px solid #333",
            background: "#fff",
            marginBottom: "24px",
          }}
        >
          {label}
        </div>

        {/* Call waiter button - always visible during order tracking */}
        <button
          onClick={llamarCamarero}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background: "#ff9800",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "12px",
          }}
        >
          🔔 Llamar al camarero
        </button>

        {/* Allow customer to place a new order once delivered */}
        {pedidoActual.estado === "ENTREGADO" && (
          <button
            onClick={() => setPedidoActual(null)}
            style={{
              padding: "10px 24px",
              fontSize: "16px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Hacer otro pedido
          </button>
        )}
      </div>
    );
  }

  // --- WELCOME SCREEN ---
  if (!mesaConfirmada) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <h1>🍽️ Bienvenido</h1>
        <p>Ingresa el número de tu mesa para ver el menú</p>
        <input
          type="number"
          value={mesaNumero}
          onChange={(e) => setMesaNumero(e.target.value)}
          placeholder="Número de mesa"
          style={{
            padding: "10px",
            fontSize: "18px",
            marginBottom: "12px",
            textAlign: "center",
            width: "200px",
          }}
        />
        <button
          onClick={confirmarMesa}
          style={{
            padding: "10px 24px",
            fontSize: "16px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Ver Menú
        </button>
      </div>
    );
  }

  // --- MENU SCREEN ---
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "16px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>🍽️ Menú - Mesa #{mesaNumero}</h1>

      {/* Products grouped by category */}
      {Object.entries(productosPorCategoria).map(([categoria, items]) => (
        <div key={categoria}>
          <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "4px" }}>
            {categoria}
          </h2>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}
          >
            {items.map((producto) => (
              <div
                key={producto.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "12px",
                  width: "200px",
                }}
              >
                <h3 style={{ margin: "0 0 4px" }}>{producto.nombre}</h3>
                <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#666" }}>
                  {producto.descripcion}
                </p>
                <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>
                  ${producto.precio}
                </p>
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  style={{
                    padding: "6px 12px",
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  + Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Fixed cart at bottom of screen */}
      {carrito.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            background: "#fff",
            borderTop: "2px solid #333",
            padding: "16px",
          }}
        >
          <h3>🛒 Tu pedido</h3>
          {carrito.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span>{item.nombre}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button onClick={() => quitarDelCarrito(item.id)}>-</button>
                <span>{item.cantidad}</span>
                <button onClick={() => agregarAlCarrito(item)}>+</button>
              </div>
            </div>
          ))}
          <button
            onClick={confirmarPedido}
            style={{
              width: "100%",
              padding: "12px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "8px",
              fontSize: "16px",
            }}
          >
            ✅ Confirmar Pedido
          </button>
        </div>
      )}
    </div>
  );
}

export default Mesa;