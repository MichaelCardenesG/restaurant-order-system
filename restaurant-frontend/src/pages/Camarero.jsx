import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import HistorialPedidos from "../components/HistorialPedidos";

const BACKEND_URL = "http://localhost:8080";

function Camarero() {
  const [tabActiva, setTabActiva] = useState("llamadas");
  const [llamadas, setLlamadas] = useState([]);
  const [pedidosActivos, setPedidosActivos] = useState([]);

  // --- NUEVO PEDIDO STATE ---
  const [mesas, setMesas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");

  // Fetch mesas and productos on load
  useEffect(() => {
    fetch(`${BACKEND_URL}/mesas`)
      .then((res) => res.json())
      .then(setMesas);

    fetch(`${BACKEND_URL}/productos`)
      .then((res) => res.json())
      .then(setProductos);

    fetch(`${BACKEND_URL}/pedidos/activos`)
      .then((res) => res.json())
      .then(setPedidosActivos);
  }, []);

  // Connect to WebSocket for live updates
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
      onConnect: () => {
        // Listen for waiter call notifications
        client.subscribe("/topic/camarero", (message) => {
          const data = JSON.parse(message.body);
          if (data.tipo === "LLAMADA_CAMARERO") {
            setLlamadas((prev) => [
              { ...data, hora: new Date().toLocaleTimeString(), atendida: false },
              ...prev,
            ]);
          }
        });

        // Listen for order updates
        client.subscribe("/topic/pedidos", (message) => {
          const data = JSON.parse(message.body);

          if (data.tipo === "NUEVO_PEDIDO") {
            setPedidosActivos((prev) => [...prev, data]);
          } else if (data.tipo === "ACTUALIZACION_ESTADO") {
            if (data.estado === "ENTREGADO") {
              // Remove delivered orders from active list
              setPedidosActivos((prev) =>
                prev.filter((p) => p.pedidoId !== data.pedidoId)
              );
            } else {
              // Update order status
              setPedidosActivos((prev) =>
                prev.map((p) =>
                  p.pedidoId === data.pedidoId ? { ...p, estado: data.estado } : p
                )
              );
            }
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  // Mark a waiter call as attended
  const marcarAtendida = (mesaId) => {
    setLlamadas((prev) =>
      prev.map((l) => (l.mesaId === mesaId ? { ...l, atendida: true } : l))
    );
  };
  // Mark order as delivered by the waiter
  const entregarPedido = (pedidoId) => {
    fetch(`${BACKEND_URL}/pedidos/${pedidoId}/estado?estado=ENTREGADO`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
  };

  // Add product to cart or increase quantity
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1, notas: "" }];
    });
  };
  const actualizarNota = (productoId, nota) => {
      setCarrito((prev) =>
          prev.map((p) => (p.id === productoId ? { ...p, notas: nota } : p))
      );
  };

  // Decrease quantity or remove from cart
  const quitarDelCarrito = (productoId) => {
    setCarrito((prev) =>
      prev
        .map((p) => (p.id === productoId ? { ...p, cantidad: p.cantidad - 1 } : p))
        .filter((p) => p.cantidad > 0)
    );
  };

  // Submit order and reset form
  const confirmarPedido = () => {
    if (!mesaSeleccionada || carrito.length === 0) return;

    const pedido = {
      mesaId: parseInt(mesaSeleccionada),
      items: carrito.map((p) => ({
        productoId: p.id,
        cantidad: p.cantidad,
        notas: p.notas || "",
      })),
    };

    fetch(`${BACKEND_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    }).then(() => {
      // Reset form and show success message
      setCarrito([]);
      setMesaSeleccionada("");
      setMensajeExito("¡Pedido enviado a la cocina!");
      setTimeout(() => setMensajeExito(""), 3000);
    });
  };

  // Group products by category
  const productosPorCategoria = productos.reduce((acc, producto) => {
    const cat = producto.categoria || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(producto);
    return acc;
  }, {});

  // Status label and color
  const estadoInfo = (estado) => {
    if (estado === "PENDIENTE") return { label: "⏳ Pendiente", color: "#fff8e1" };
    if (estado === "EN_PREPARACION") return { label: "👨‍🍳 En preparación", color: "#e3f2fd" };
     if (estado === "LISTO") return { label: "🍽️ Listo para servir", color: "#f3e5f5" };
    return { label: estado, color: "#fff" };
  };

  const pendientes = llamadas.filter((l) => !l.atendida);
  const atendidas = llamadas.filter((l) => l.atendida);

  // --- STYLES ---
  const btnTab = (activa) => ({
    padding: "10px 20px",
    background: activa ? "#333" : "#ddd",
    color: activa ? "#fff" : "#333",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  });

  const btnStyle = (color) => ({
    padding: "8px 16px",
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  });

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "900px", margin: "0 auto",  paddingBottom: "200px" }}>
      <h1>🧑‍🍽️ Vista Camarero</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button onClick={() => setTabActiva("llamadas")} style={btnTab(tabActiva === "llamadas")}>
          🔔 Llamadas {pendientes.length > 0 && `(${pendientes.length})`}
        </button>
        <button onClick={() => setTabActiva("nuevoPedido")} style={btnTab(tabActiva === "nuevoPedido")}>
          ➕ Nuevo Pedido
        </button>
        <button onClick={() => setTabActiva("pedidosActivos")} style={btnTab(tabActiva === "pedidosActivos")}>
          📋 Pedidos Activos {pedidosActivos.length > 0 && `(${pedidosActivos.length})`}
        </button>
        <button onClick={() => setTabActiva("historial")} style={btnTab(tabActiva === "historial")}>
          📜 Historial
        </button>
      </div>

      {/* ---- LLAMADAS TAB ---- */}
      {tabActiva === "llamadas" && (
        <div>
          <h2>🔔 Llamadas pendientes ({pendientes.length})</h2>
          {pendientes.length === 0 ? (
            <p style={{ color: "#999" }}>No hay llamadas pendientes.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
              {pendientes.map((llamada, i) => (
                <div key={i} style={{ border: "2px solid #ff9800", borderRadius: "8px", padding: "16px", width: "200px", background: "#fff8e1" }}>
                  <h2 style={{ margin: "0 0 8px" }}>Mesa #{llamada.mesaNumero}</h2>
                  <p style={{ margin: "0 0 12px", color: "#666", fontSize: "13px" }}>{llamada.hora}</p>
                  <button onClick={() => marcarAtendida(llamada.mesaId)} style={btnStyle("#4caf50")}>
                    ✅ Atendida
                  </button>
                </div>
              ))}
            </div>
          )}

          {atendidas.length > 0 && (
            <>
              <h2 style={{ color: "#999" }}>✅ Atendidas ({atendidas.length})</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {atendidas.map((llamada, i) => (
                  <div key={i} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", width: "200px", background: "#f5f5f5", opacity: 0.6 }}>
                    <h2 style={{ margin: "0 0 8px" }}>Mesa #{llamada.mesaNumero}</h2>
                    <p style={{ margin: "0", color: "#666", fontSize: "13px" }}>{llamada.hora}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ---- NUEVO PEDIDO TAB ---- */}
      {tabActiva === "nuevoPedido" && (
        <div>
          <h2>➕ Nuevo Pedido</h2>

          {/* Success message */}
          {mensajeExito && (
            <div style={{ background: "#e8f5e9", border: "1px solid #4caf50", borderRadius: "6px", padding: "12px", marginBottom: "16px", color: "#2e7d32" }}>
              {mensajeExito}
            </div>
          )}

          {/* Mesa selector */}
          <select
            value={mesaSeleccionada}
            onChange={(e) => setMesaSeleccionada(e.target.value)}
            style={{ padding: "10px", fontSize: "16px", marginBottom: "20px", width: "200px", borderRadius: "6px", border: "1px solid #ddd" }}
          >
            <option value="">Seleccionar mesa</option>
            {mesas.map((mesa) => (
              <option key={mesa.id} value={mesa.id}>
                Mesa #{mesa.numero}
              </option>
            ))}
          </select>

          {/* Products grouped by category */}
          {Object.entries(productosPorCategoria).map(([categoria, items]) => (
            <div key={categoria}>
              <h3 style={{ borderBottom: "2px solid #333", paddingBottom: "4px" }}>{categoria}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                {items.map((producto) => (
                  <div key={producto.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", width: "180px" }}>
                    <p style={{ margin: "0 0 4px", fontWeight: "bold" }}>{producto.nombre}</p>
                    <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#666" }}>{producto.descripcion}</p>
                    <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>${producto.precio}</p>
                    <button onClick={() => agregarAlCarrito(producto)} style={btnStyle("#4caf50")}>
                      + Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Cart */}
          {carrito.length > 0 && (
            <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", background: "#fff", borderTop: "2px solid #333", padding: "16px" }}>
              <h3 style={{ margin: "0 0 8px" }}>🛒 Pedido actual</h3>
              {carrito.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span>{item.nombre}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={() => quitarDelCarrito(item.id)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item)}>+</button>
                  </div>
                  <input
                              type="text"
                              placeholder="Nota (ej: sin tomate)"
                              value={item.notas}
                              onChange={(e) => actualizarNota(item.id, e.target.value)}
                              style={{
                                  width: "100%",
                                  marginTop: "4px",
                                  padding: "6px",
                                  borderRadius: "4px",
                                  border: "1px solid #ddd",
                                  fontSize: "13px",
                                  boxSizing: "border-box",
                              }}
                          />
                </div>
              ))}
              <button
                onClick={confirmarPedido}
                style={{ width: "100%", padding: "12px", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "8px", fontSize: "16px" }}
              >
                ✅ Confirmar Pedido
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---- PEDIDOS ACTIVOS TAB ---- */}
      {tabActiva === "pedidosActivos" && (
        <div>
          <h2>📋 Pedidos Activos ({pedidosActivos.length})</h2>
          {pedidosActivos.length === 0 ? (
            <p style={{ color: "#999" }}>No hay pedidos activos.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {pedidosActivos.map((pedido) => {
                const { label, color } = estadoInfo(pedido.estado);
                return (
                  <div key={pedido.pedidoId} style={{ border: "2px solid #333", borderRadius: "8px", padding: "16px", width: "220px", background: color }}>
                    <h2 style={{ margin: "0 0 8px" }}>Mesa #{pedido.mesa}</h2>
                    <p style={{ margin: "0 0 8px" }}><strong>Estado:</strong> {label}</p>
                    <ul style={{ margin: "0 0 12px", paddingLeft: "16px" }}>
                      {pedido.items?.map((item, i) => (
                        <li key={i}>{item.cantidad}x {item.producto}
                            {item.notas && (
                                        <span style={{ display: "block", fontSize: "12px", color: "#e65100", fontStyle: "italic" }}>
                                            📝 {item.notas}
                                        </span>
                                    )}
                            </li>
                      ))}
                    </ul>

                     {/* Show deliver button only when order is ready */}
                          {pedido.estado === "LISTO" && (
                            <button
                              onClick={() => entregarPedido(pedido.pedidoId)}
                              style={btnStyle("#9c27b0")}
                            >
                              ✅ Entregar
                            </button>
                          )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
        {tabActiva === "historial" && <HistorialPedidos />}
    </div>

  );
}

export default Camarero;