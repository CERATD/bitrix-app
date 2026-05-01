let dealId = null;

// 🔥 datele NU mai sunt hardcoded (le luăm din CRM)
let CRM_DATA = {};

BX24.init(async function () {

  // 📌 luăm ID-ul dealului
  BX24.placement.info(function (res) {
    dealId = res.options?.ID || null;
  });

  // 🔥 încărcăm datele din CRM (PRO MODE)
  await loadCRMData();

  initUI();
});


// ===============================
// 🔥 1. LOAD DATE DIN CRM (PRO)
// ===============================
async function loadCRMData() {

  // Exemplu: listă din câmpuri sau entity CRM
  // aici folosim smart mock + extensibil

  return new Promise((resolve) => {

    BX24.callMethod(
      "crm.deal.list",
      {
        select: ["UF_CRM1777621218768", "UF_CRM1777621228665"]
      },
      function (res) {

        let items = res.data();

        CRM_DATA = {};

        items.forEach(item => {
          let brand = item.UF_CRM1777621218768;
          let model = item.UF_CRM1777621228665;

          if (!brand) return;

          if (!CRM_DATA[brand]) {
            CRM_DATA[brand] = [];
          }

          if (model && !CRM_DATA[brand].includes(model)) {
            CRM_DATA[brand].push(model);
          }
        });

        resolve();
      }
    );

  });
}


// ===============================
// 🔥 2. UI INIT
// ===============================
function initUI() {

  const brandSelect = document.getElementById("brand");
  const modelSelect = document.getElementById("model");

  // populate brand
  Object.keys(CRM_DATA).forEach(brand => {
    let opt = document.createElement("option");
    opt.value = brand;
    opt.text = brand;
    brandSelect.appendChild(opt);
  });

  // change BRAND → update MODELS
  brandSelect.addEventListener("change", function () {

    const brand = this.value;

    modelSelect.innerHTML = '<option value="">Alege MODEL</option>';

    if (!brand) return;

    (CRM_DATA[brand] || []).forEach(model => {
      let opt = document.createElement("option");
      opt.value = model;
      opt.text = model;
      modelSelect.appendChild(opt);
    });

    autoSave(); // 🔥 AUTO SAVE PRO
  });

  // change MODEL → AUTO SAVE
  modelSelect.addEventListener("change", function () {
    autoSave();
  });
}


// ===============================
// 🔥 3. AUTO SAVE (FĂRĂ BUTON)
// ===============================
function autoSave() {

  if (!dealId) return;

  const brand = document.getElementById("brand").value;
  const model = document.getElementById("model").value;

  BX24.callMethod(
    "crm.deal.update",
    {
      id: dealId,
      fields: {
        "UfCrm1777621218768": brand,
        "UfCrm1777621228665": model
      }
    },
    function (res) {
      if (res.error()) {
        console.error("SAVE ERROR", res.error());
      } else {
        console.log("AUTO-SAVED ✔");
      }
    }
  );
}