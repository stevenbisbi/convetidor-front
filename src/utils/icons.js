// Icons for tabs using Bootstrap Icons
export const getTabIcon = (tab) => {
  const icons = {
    time: "bi-clock",
    weight: "bi-speedometer2",
    temperature: "bi-thermometer-half",
    currency: "bi-currency-dollar",
  };
  return icons[tab];
};

export const getTabTitle = (tab) => {
  const titles = {
    time: "Tiempo",
    weight: "Peso",
    temperature: "Temperatura",
    currency: "Moneda",
  };
  return titles[tab];
};
