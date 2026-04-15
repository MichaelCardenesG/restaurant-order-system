import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:8080";

function Admin() {

  // Get stored JWT token for authenticated requests
  const getAuthHeader = () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
    });

  // Active tab: "mesas" or "productos"
  const [tabActiva, setTabActiva] = useState("mesas");

  const navigate = useNavigate();

  const cerrarSesion = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // --- MESAS STATE ---
  const [mesas, setMesas] = useState([]);
  const [nuevaMesa, setNuevaMesa] = useState({ numero: "", estado: "DISPONIBLE" });
  const [mesaEditando, setMesaEditando] = useState(null);

  // --- PRODUCTOS STATE ---
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    disponible: true,
  });
  const [productoEditando, setProductoEditando] = useState(null);
  // --- CATEGORIAS STATE ---
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  // Fetch all tables on load
  useEffect(() => {
    fetchMesas();
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchMesas = () => {
    fetch(`${BACKEND_URL}/mesas`)
      .then((res) => res.json())
      .then((data) => setMesas(data));
  };

  const fetchProductos = () => {
    fetch(`${BACKEND_URL}/productos`)
      .then((res) => res.json())
      .then((data) => setProductos(data));
  };

  const fetchCategorias = () => {
      fetch(`${BACKEND_URL}/categorias`)
          .then((res) => res.json())
          .then(setCategorias);
  };

  // --- MESA ACTIONS ---
  const crearMesa = () => {
    if (!nuevaMesa.numero) return;
    fetch(`${BACKEND_URL}/mesas`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ numero: parseInt(nuevaMesa.numero), estado: nuevaMesa.estado }),
    }).then(() => {
      fetchMesas();
      setNuevaMesa({ numero: "", estado: "DISPONIBLE" });
    });
  };

  const editarMesa = () => {
    fetch(`${BACKEND_URL}/mesas/${mesaEditando.id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(mesaEditando),
    }).then(() => {
      fetchMesas();
      setMesaEditando(null);
    });
  };

  const eliminarMesa = (id) => {
    if (!confirm("¿Eliminar esta mesa?")) return;
    fetch(`${BACKEND_URL}/mesas/${id}`, { method: "DELETE", headers: getAuthHeader(),}).then(fetchMesas);
  };

  // --- PRODUCTO ACTIONS ---
  const crearProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;
    fetch(`${BACKEND_URL}/productos`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ ...nuevoProducto, precio: parseFloat(nuevoProducto.precio) }),
    }).then(() => {
      fetchProductos();
      setNuevoProducto({ nombre: "", descripcion: "", precio: "", categoria: "", disponible: true });
    });
  };

  const editarProducto = () => {
    fetch(`${BACKEND_URL}/productos/${productoEditando.id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(productoEditando),
    }).then(() => {
      fetchProductos();
      setProductoEditando(null);
    });
  };

  const eliminarProducto = (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    fetch(`${BACKEND_URL}/productos/${id}`, { method: "DELETE", headers: getAuthHeader(),}).then(fetchProductos);
  };

  const crearCategoria = () => {
      if (!nuevaCategoria.trim()) return;
      fetch(`${BACKEND_URL}/categorias`, {
          method: "POST",
          headers: getAuthHeader(),
          body: JSON.stringify({ nombre: nuevaCategoria }),
      }).then(() => {
          fetchCategorias();
          setNuevaCategoria("");
      });
  };

  const editarCategoria = () => {
      fetch(`${BACKEND_URL}/categorias/${categoriaEditando.id}`, {
          method: "PUT",
          headers: getAuthHeader(),
          body: JSON.stringify({ nombre: categoriaEditando.nombre }),
      }).then(() => {
          fetchCategorias();
          setCategoriaEditando(null);
      });
  };

  const eliminarCategoria = (id) => {
      if (!confirm("¿Eliminar esta categoría?")) return;
      fetch(`${BACKEND_URL}/categorias/${id}`, {
          method: "DELETE",
          headers: getAuthHeader(),
      }).then(fetchCategorias);
  };

  // --- STYLES ---
  const inputStyle = {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%",
    marginBottom: "8px",
  };

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
    <div style={{ fontFamily: "sans-serif", padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>⚙️ Panel de Administración</h1>
          <button onClick={cerrarSesion} style={btnStyle("#f44336")}>
              🚪 Cerrar Sesión
          </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button
          onClick={() => setTabActiva("mesas")}
          style={{
            ...btnStyle(tabActiva === "mesas" ? "#333" : "#ddd"),
            color: tabActiva === "mesas" ? "#fff" : "#333",
          }}
        >
          🪑 Mesas
        </button>
        <button
          onClick={() => setTabActiva("productos")}
          style={{
            ...btnStyle(tabActiva === "productos" ? "#333" : "#ddd"),
            color: tabActiva === "productos" ? "#fff" : "#333",
          }}
        >
          🍔 Productos
        </button>

        <button
            onClick={() => setTabActiva("categorias")}
            style={{
                ...btnStyle(tabActiva === "categorias" ? "#333" : "#ddd"),
                color: tabActiva === "categorias" ? "#fff" : "#333",
            }}
        >
            🏷️ Categorías
        </button>
      </div>

      {/* ---- MESAS TAB ---- */}
      {tabActiva === "mesas" && (
        <div>
          {/* Create mesa form */}
          <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <h3>Nueva Mesa</h3>
            <input
              type="number"
              placeholder="Número de mesa"
              value={nuevaMesa.numero}
              onChange={(e) => setNuevaMesa({ ...nuevaMesa, numero: e.target.value })}
              style={inputStyle}
            />
            <button onClick={crearMesa} style={btnStyle("#4caf50")}>
              + Crear Mesa
            </button>
          </div>


          {/* Mesas list */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#333", color: "#fff" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Número</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Estado</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesas.map((mesa) => (
                <tr key={mesa.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>
                    {mesaEditando?.id === mesa.id ? (
                      <input
                        type="number"
                        value={mesaEditando.numero}
                        onChange={(e) => setMesaEditando({ ...mesaEditando, numero: parseInt(e.target.value) })}
                        style={{ ...inputStyle, marginBottom: 0, width: "80px" }}
                      />
                    ) : (
                      `Mesa #${mesa.numero}`
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>{mesa.estado}</td>
                  <td style={{ padding: "10px", display: "flex", gap: "8px" }}>
                    {mesaEditando?.id === mesa.id ? (
                      <>
                        <button onClick={editarMesa} style={btnStyle("#4caf50")}>✅ Guardar</button>
                        <button onClick={() => setMesaEditando(null)} style={btnStyle("#999")}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setMesaEditando({ ...mesa })} style={btnStyle("#2196f3")}>✏️ Editar</button>
                        <button onClick={() => eliminarMesa(mesa.id)} style={btnStyle("#f44336")}>🗑️ Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* ---- PRODUCTOS TAB ---- */}
      {tabActiva === "productos" && (
        <div>
          {/* Create producto form */}
          <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <h3>Nuevo Producto</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nuevoProducto.descripcion}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
              style={inputStyle}
            />
            <select
                value={nuevoProducto.categoria}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                style={inputStyle}
            >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                    <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                    </option>
                ))}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <input
                type="checkbox"
                checked={nuevoProducto.disponible}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, disponible: e.target.checked })}
              />
              Disponible
            </label>
            <button onClick={crearProducto} style={btnStyle("#4caf50")}>
              + Crear Producto
            </button>
          </div>

          {/* Productos list */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#333", color: "#fff" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Descripción</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Categoría</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Precio</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Disponible</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>
                    {productoEditando?.id === producto.id ? (
                      <input
                        type="text"
                        value={productoEditando.nombre}
                        onChange={(e) => setProductoEditando({ ...productoEditando, nombre: e.target.value })}
                        style={{ ...inputStyle, marginBottom: 0 }}
                      />
                    ) : (
                      producto.nombre
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {productoEditando?.id === producto.id ? (
                      <textarea
                        value={productoEditando.descripcion}
                        onChange={(e) =>
                          setProductoEditando({
                            ...productoEditando,
                            descripcion: e.target.value,
                          })
                        }
                        rows={2}
                        style={{
                          ...inputStyle,
                          marginBottom: 0,
                          resize: "vertical",
                        }}
                      />
                    ) : (
                      producto.descripcion
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {productoEditando?.id === producto.id ? (
                      <select
                        value={productoEditando.categoria}
                        onChange={(e) =>
                          setProductoEditando({
                            ...productoEditando,
                            categoria: e.target.value,
                          })
                        }
                        style={inputStyle}
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.nombre}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    ) : (
                      producto.categoria
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {productoEditando?.id === producto.id ? (
                      <input
                        type="number"
                        value={productoEditando.precio}
                        onChange={(e) => setProductoEditando({ ...productoEditando, precio: parseFloat(e.target.value) })}
                        style={{ ...inputStyle, marginBottom: 0, width: "80px" }}
                      />
                    ) : (
                      `$${producto.precio}`
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {productoEditando?.id === producto.id ? (
                      <input
                        type="checkbox"
                        checked={productoEditando.disponible}
                        onChange={(e) => setProductoEditando({ ...productoEditando, disponible: e.target.checked })}
                      />
                    ) : (
                      producto.disponible ? "✅" : "❌"
                    )}
                  </td>
                  <td style={{ padding: "10px", display: "flex", gap: "8px" }}>
                    {productoEditando?.id === producto.id ? (
                      <>
                        <button onClick={editarProducto} style={btnStyle("#4caf50")}>✅ Guardar</button>
                        <button onClick={() => setProductoEditando(null)} style={btnStyle("#999")}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setProductoEditando({ ...producto })} style={btnStyle("#2196f3")}>✏️ Editar</button>
                        <button onClick={() => eliminarProducto(producto.id)} style={btnStyle("#f44336")}>🗑️ Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}
      {tabActiva === "categorias" && (
          <div>
              {/* Crear categoría */}
              <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
                  <h3>Nueva Categoría</h3>
                  <input
                      type="text"
                      placeholder="Nombre de categoría"
                      value={nuevaCategoria}
                      onChange={(e) => setNuevaCategoria(e.target.value)}
                      style={inputStyle}
                  />
                  <button onClick={crearCategoria} style={btnStyle("#4caf50")}>
                      + Crear Categoría
                  </button>
              </div>

              {/* Lista de categorías */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                      <tr style={{ background: "#333", color: "#fff" }}>
                          <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
                          <th style={{ padding: "10px", textAlign: "left" }}>Acciones</th>
                      </tr>
                  </thead>
                  <tbody>
                      {categorias.map((cat) => (
                          <tr key={cat.id} style={{ borderBottom: "1px solid #ddd" }}>
                              <td style={{ padding: "10px" }}>
                                  {categoriaEditando?.id === cat.id ? (
                                      <input
                                          type="text"
                                          value={categoriaEditando.nombre}
                                          onChange={(e) => setCategoriaEditando({ ...categoriaEditando, nombre: e.target.value })}
                                          style={{ ...inputStyle, marginBottom: 0 }}
                                      />
                                  ) : (
                                      cat.nombre
                                  )}
                              </td>
                              <td style={{ padding: "10px", display: "flex", gap: "8px" }}>
                                  {categoriaEditando?.id === cat.id ? (
                                      <>
                                          <button onClick={editarCategoria} style={btnStyle("#4caf50")}>✅ Guardar</button>
                                          <button onClick={() => setCategoriaEditando(null)} style={btnStyle("#999")}>Cancelar</button>
                                      </>
                                  ) : (
                                      <>
                                          <button onClick={() => setCategoriaEditando({ ...cat })} style={btnStyle("#2196f3")}>✏️ Editar</button>
                                          <button onClick={() => eliminarCategoria(cat.id)} style={btnStyle("#f44336")}>🗑️ Eliminar</button>
                                      </>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

    </div>

  );
}

export default Admin;