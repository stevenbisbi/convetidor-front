import { useState, useEffect } from "react";

const UnitConverter = () => {
  const [activeTab, setActiveTab] = useState("time");
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState("");
  const [conversion, setConversion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Definir las unidades disponibles con sus labels
  const units = {
    time: {
      hours: "Horas",
      days: "Días",
      months: "Meses",
      years: "Años",
    },
    weight: {
      kg: "Kilogramos",
      g: "Gramos",
      lb: "Libras",
    },
    temperature: {
      celsius: "Celsius (°C)",
      fahrenheit: "Fahrenheit (°F)",
      kelvin: "Kelvin (K)",
    },
    currency: {
      usd: "Dólar USD",
      cop: "Peso COP",
      eur: "Euro EUR",
    },
  };

  // Icons for tabs using Bootstrap Icons
  const getTabIcon = (tab) => {
    const icons = {
      time: "bi-clock",
      weight: "bi-speedometer2",
      temperature: "bi-thermometer-half",
      currency: "bi-currency-dollar",
    };
    return icons[tab];
  };

  const getTabTitle = (tab) => {
    const titles = {
      time: "Tiempo",
      weight: "Peso",
      temperature: "Temperatura",
      currency: "Moneda",
    };
    return titles[tab];
  };

  // Inicializar unidades por defecto cuando cambia la pestaña
  useEffect(() => {
    const unitKeys = Object.keys(units[activeTab]);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    setResult("");
    setConversion("");
    setInputValue("");
    setError("");
  }, [activeTab]);

  const handleConvert = async () => {
    if (!inputValue || !fromUnit || !toUnit) {
      setError("Por favor complete todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://convetidor-back.vercel.app/api/convert/${activeTab}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: parseFloat(inputValue),
            from: fromUnit,
            to: toUnit,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la conversión");
      }

      if (data.success) {
        setResult(data.data.result);
        setConversion(data.data.conversion);
      } else {
        throw new Error(data.error || "Error en la conversión");
      }
    } catch (error) {
      setError("Error al realizar la conversión: " + error.message);
      setResult("");
      setConversion("");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setResult("");
    setConversion("");
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <i
              className="bi bi-calculator-fill text-white me-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h1 className="display-4 fw-bold text-white mb-0">
              Convertidor Universal
            </h1>
          </div>
          <p className="lead text-white-50">
            Convierte entre diferentes unidades de medida
          </p>
        </div>

        {/* Main Card */}
        <div
          className="card shadow-lg border-0"
          style={{
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* Tabs */}
          <div className="card-header bg-transparent border-0 p-0">
            <ul
              className="nav nav-pills nav-fill"
              role="tablist"
              style={{ borderRadius: "20px 20px 0 0" }}
            >
              {Object.keys(units).map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link d-flex align-items-center justify-content-center gap-2 py-3 ${
                      activeTab === tab ? "active" : ""
                    }`}
                    style={{
                      borderRadius:
                        tab === "time"
                          ? "20px 0 0 0"
                          : tab === "currency"
                          ? "0 20px 0 0"
                          : "0",
                      backgroundColor:
                        activeTab === tab ? "#6c63ff" : "transparent",
                      color: activeTab === tab ? "white" : "#6c757d",
                      border: "none",
                    }}
                    onClick={() => setActiveTab(tab)}
                  >
                    <i className={getTabIcon(tab)}></i>
                    <span className="fw-semibold">{getTabTitle(tab)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-body p-5">
            <div className="row">
              {/* Input Section */}
              <div className="col-md-6">
                <h4 className="mb-4 text-primary">
                  <i className="bi bi-input-cursor-text me-2"></i>
                  Convertir de:
                </h4>

                {/* Error Alert */}
                {error && (
                  <div
                    className="alert alert-danger d-flex align-items-center"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {/* Input Value */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Valor:</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-123"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ingrese el valor a convertir"
                      style={{ borderRadius: "0 10px 10px 0" }}
                    />
                  </div>
                </div>

                {/* From Unit */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Desde:</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-arrow-up-circle"></i>
                    </span>
                    <select
                      className="form-select form-select-lg"
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      style={{ borderRadius: "0 10px 10px 0" }}
                    >
                      {Object.entries(units[activeTab]).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="text-center mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-2"
                    onClick={handleSwapUnits}
                    title="Intercambiar unidades"
                  >
                    <i
                      className="bi bi-arrow-down-up"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                  </button>
                </div>

                {/* To Unit */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Hacia:</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-arrow-down-circle"></i>
                    </span>
                    <select
                      className="form-select form-select-lg"
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      style={{ borderRadius: "0 10px 10px 0" }}
                    >
                      {Object.entries(units[activeTab]).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Convert Button */}
                <button
                  className="btn btn-primary btn-lg w-100 py-3"
                  onClick={handleConvert}
                  disabled={loading}
                  style={{
                    borderRadius: "15px",
                    background: "linear-gradient(45deg, #6c63ff, #764ba2)",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Convirtiendo...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Convertir
                    </>
                  )}
                </button>
              </div>

              {/* Result Section */}
              <div className="col-md-6">
                <h4 className="mb-4 text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  Resultado:
                </h4>

                {/* Result Display */}
                <div
                  className="card bg-light border-0 shadow-sm mb-4"
                  style={{ borderRadius: "15px", minHeight: "200px" }}
                >
                  <div className="card-body d-flex align-items-center justify-content-center">
                    {result !== "" ? (
                      <div className="text-center">
                        <div className="display-4 fw-bold text-primary mb-3">
                          {result}
                        </div>
                        <div className="h5 text-muted mb-3">
                          {units[activeTab][toUnit]}
                        </div>
                        {conversion && (
                          <div
                            className="alert alert-info"
                            style={{ borderRadius: "10px" }}
                          >
                            <i className="bi bi-info-circle me-2"></i>
                            {conversion}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted">
                        <i
                          className="bi bi-calculator"
                          style={{ fontSize: "4rem", opacity: 0.3 }}
                        ></i>
                        <p className="mt-3">El resultado aparecerá aquí</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Panel */}
                <div
                  className="card bg-primary text-white border-0"
                  style={{ borderRadius: "15px" }}
                >
                  <div className="card-body">
                    <h6 className="card-title">
                      <i className="bi bi-info-circle me-2"></i>
                      Información
                    </h6>
                    <p className="card-text small mb-0">
                      {activeTab === "time" &&
                        "Convierte entre horas, días, meses y años utilizando conversiones precisas."}
                      {activeTab === "weight" &&
                        "Convierte entre kilogramos, gramos y libras con alta precisión."}
                      {activeTab === "temperature" &&
                        "Convierte entre Celsius, Fahrenheit y Kelvin usando fórmulas exactas."}
                      {activeTab === "currency" &&
                        "Convierte entre USD, COP y EUR. Nota: Las tasas de cambio son simuladas."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5">
          <p className="text-white-50">
            <i className="bi bi-gear-fill me-2"></i>
            Convertidor Universal - Todas las unidades en un solo lugar
          </p>
        </div>
      </div>

      {/* Bootstrap JS CDN */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default UnitConverter;
