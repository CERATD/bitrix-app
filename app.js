BX24.init(function () {

  let dealId = null;

  // 🔹 МАРКИ И МОДЕЛИ (замени под себя)
  const DATA = {
    BMW: ["X5", "X6", "X3"],
    Audi: ["A4", "Q5", "Q7"],
    Mercedes: ["C-Class", "E-Class"],
    Toyota: ["Camry", "Corolla"],
    Lexus: ["RX", "NX"],
    Kia: ["Sportage"],
    Hyundai: ["Tucson"]
  };

  const brandSelect = document.getElementById("brand");
  const modelSelect = document.getElementById("model");

  // 🔹 Заполняем марки
  Object.keys(DATA).forEach(brand => {
    let option = document.createElement("option");
    option.value = brand;
    option.text = brand;
    brandSelect.appendChild(option);
  });

  // 🔹 При смене марки → меняем модели
  brandSelect.onchange = function () {
    const brand = this.value;
    modelSelect.innerHTML = "";

    if (!brand || !DATA[brand]) return;

    DATA[brand].forEach(model => {
      let option = document.createElement("option");
      option.value = model;
      option.text = model;
      modelSelect.appendChild(option);
    });
  };

  // 🔹 Получаем ID сделки
  BX24.placement.info(function (res) {
    dealId = res.options.ID;
  });

  // 🔹 Сохранение
  document.getElementById("save").onclick = function () {

    const brand = brandSelect.value;
    const model = modelSelect.value;

    if (!brand || !model) {
      alert("Выбери марку и модель");
      return;
    }

    BX24.callMethod(
      "crm.deal.update",
      {
        id: dealId,
        fields: {
          UF_CRM_BRAND: brand,
          UF_CRM_MODEL: model
        }
      },
      function (result) {
        if (result.error()) {
          alert("Ошибка: " + result.error());
        } else {
          alert("Сохранено");
        }
      }
    );
  };

});