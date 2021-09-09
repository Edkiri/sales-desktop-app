const mainDate = document.getElementById("mainDate");
mainDate.valueAsDate = new Date();
window.api.send('getDailySales', new Date(mainDate.value));
let dailyRate;
window.api.send('getDailyRate');
window.api.recieve('rateValue', rateValue => {
  dailyRate = rateValue;
});

const rateFrame = new RateFrame("rateContainer");

function handler(e) {
  date = new Date(e.target.value);
  window.api.send('getDailySales', date);
}

(window).api.recieve("printSales", (salesToPrint) =>  {
  const mainSaleList = document.getElementById('mainSaleList');
  mainSaleList.innerHTML = "";
  const headerList = document.createElement('li');
  headerList.className = "salesList__header";
  // Sale State
  const state = document.createElement('span');
  state.className = "salesList__header__title";
  state.textContent = "Estado";
  headerList.appendChild(state);

  // Sale Description
  const description = document.createElement('span');
  description.className = "salesList__header__title";
  description.textContent = "Descripción";
  headerList.appendChild(description);

  // Sale Total
  const total = document.createElement('span');
  total.className = "salesList__header__title";
  total.textContent = "Total $";
  headerList.appendChild(total);

  mainSaleList.appendChild(headerList)

  salesToPrint.forEach(sale => {
    // List Row
    const salesListRow = document.createElement('li');
    salesListRow.className = "salesList__row";

    // Sale Id
    const saleId = document.createElement('span');
    saleId.className = "salesList__row__item--sale-id";
    saleId.textContent = sale.id;
    salesListRow.appendChild(saleId);

    // Sale State
    const saleState = document.createElement('span');
    saleState.className = "salesList__row__item";
    saleState.textContent = sale.state;
    salesListRow.appendChild(saleState);

    // Sale Description
    const saleDescription = document.createElement('span');
    saleDescription.className = "salesList__row__item";
    saleDescription.textContent = sale.description;
    salesListRow.appendChild(saleDescription);

    // Total Sale
    const totalSale = document.createElement('span');
    totalSale.className = "salesList__row__item";
    totalSale.textContent = sale.totalSale;
    salesListRow.appendChild(totalSale);


    mainSaleList.appendChild(salesListRow);
  })
})

const addSaleBtn = document.getElementById('addSaleBtn');
addSaleBtn.onclick = () => {
  if(rateFrame.rateSpan.style.display === "none") {
    console.log("Debes especificar la tasa del día");
  } else {
    window.api.send('createSale');
  }
}