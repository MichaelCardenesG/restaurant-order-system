import { useState } from "react";

const BACKEND_URL = "http://localhost:8080";

function HistorialPedidos() {
  const [historial, setHistorial] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mesaNumero, setMesaNumero] = useState("");
  const [cargando, setCargando] = useState(false);

  const toLocalDateTimeInput = (date) => {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const aplicarAtajo = (tipo) => {
    const ahora = new Date();
    let inicio;

    if (tipo === "hoy") {
      inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
    } else if (tipo === "24h") {
      inicio = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
    } else if (tipo === "semana") {
      inicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    setFechaInicio(toLocalDateTimeInput(inicio));
    setFechaFin(toLocalDateTimeInput(ahora));
  };

  const buscarHistorial = () => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);
    if (mesaNumero) params.append("mesaNumero", mesaNumero);

    setCargando(true);
    fetch(`${BACKEND_URL}/pedidos/historial?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setHistorial(data);
        setCargando(false);
      });
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  };

  const btnStyle = {
    padding: "8px 20px",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const btnAtajoStyle = {
    padding: "6px 14px",
    background: "#f0f0f0",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  };

  return (
    <div>
      <h2>📜 Historial de Pedidos</h2>

      {/* Atajos rápidos */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button onClick={() => aplicarAtajo("hoy")} style={btnAtajoStyle}>📅 Hoy</button>
        <button onClick={() => aplicarAtajo("24h")} style={btnAtajoStyle}>🕐 Últimas 24h</button>
        <button onClick={() => aplicarAtajo("semana")} style={btnAtajoStyle}>📆 Esta semana</button>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px", color: "#666" }}>Desde</label>
          <input
            type="datetime-local"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px", color: "#666" }}>Hasta</label>
          <input
            type="datetime-local"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px", color: "#666" }}>Mesa #</label>
          <input
            type="number"
            placeholder="Ej: 5"
            value={mesaNumero}
            onChange={(e) => setMesaNumero(e.target.value)}
            style={{ ...inputStyle, width: "80px" }}
          />
        </div>
        <button onClick={buscarHistorial} style={btnStyle}>
          🔍 Buscar
        </button>
      </div>

      {/* Resultados */}
      {cargando && <p style={{ color: "#999" }}>Cargando...</p>}

      {!cargando && historial.length === 0 && (
        <p style={{ color: "#999" }}>No se encontraron pedidos entregados.</p>
      )}

      {!cargando && historial.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {historial.map((pedido) => (
            <div
              key={pedido.pedidoId}
              style={{
                border: "2px solid #333",
                borderRadius: "8px",
                padding: "16px",
                width: "220px",
                background: "#e8f5e9",
              }}
            >
              <h2 style={{ margin: "0 0 8px" }}>Mesa #{pedido.mesa}</h2>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#666" }}>
                🕐 {new Date(pedido.horaCreacion).toLocaleString()}
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>Estado:</strong> ✅ Entregado
              </p>
              <ul style={{ margin: "0", paddingLeft: "16px" }}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistorialPedidos;