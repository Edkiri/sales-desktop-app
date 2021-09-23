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
  window.api.send("getSummaryDayData", date);
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
const deleteSaleBtn = document.getElementById("deleteSaleBtn");

document.addEventListener('click', e => {
  if (e.target.matches('.salesList__row span')) {
    const treeRow = e.target.parentElement;
    selectRow(treeRow);
  } else if(e.target.matches('.salesList__row')) {
    const treeRow = e.target;
    selectRow(treeRow);
  }
});

function selectRow(tag) {
  const selectedRow = document.querySelector(".salesList__row.selected");
  if (selectedRow == tag) {
    tag.classList.remove('selected');
    deleteSaleBtn.disabled = true;
  } else {
    if(selectedRow) selectedRow.classList.remove('selected');
    tag.classList.add("selected");
    deleteSaleBtn.disabled = false;
  };
}


window.api.send("getSummaryDayData", new Date(mainDate.value));

const bsDay = document.getElementById("bsDay");
const usdDay = document.getElementById("usdDay");
const totalDay = document.getElementById("totalDay");

const bsWeek = document.getElementById("bsWeek");
const usdWeek = document.getElementById("usdWeek");
const totalWeek = document.getElementById("totalWeek");

const bsMonth = document.getElementById("bsMonth");
const usdMonth = document.getElementById("usdMonth");
const totalMonth = document.getElementById("totalMonth");

window.api.recieve("summaryData", data => {
  bsDay.textContent = data.summaryDay.bs;
  usdDay.textContent = data.summaryDay.usd;
  totalDay.textContent = data.summaryDay.total;

  bsWeek.textContent = data.summaryWeek.bs;
  usdWeek.textContent = data.summaryWeek.usd;
  totalWeek.textContent = data.summaryWeek.total;

  bsMonth.textContent = data.summaryMonth.bs;
  usdMonth.textContent = data.summaryMonth.usd;
  totalMonth.textContent = data.summaryMonth.total;
});