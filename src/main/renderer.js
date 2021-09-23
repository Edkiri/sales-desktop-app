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
    salesListRow.dataset.saleId = sale.id;

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
deleteSaleBtn.onclick = () => {
  const selectedRow = document.querySelector('.salesList__row.selected');
  const saleId = selectedRow.dataset.saleId;
  console.log(saleId);
  window.api.send("deleteSale", saleId);
}

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

window.api.recieve("summaryData", summaryData => {
  bsDay.textContent = summaryData.summaryDay.bs;
  usdDay.textContent = summaryData.summaryDay.usd;
  totalDay.textContent = summaryData.summaryDay.total;

  bsWeek.textContent = summaryData.summaryWeek.bs;
  usdWeek.textContent = summaryData.summaryWeek.usd;
  totalWeek.textContent = summaryData.summaryWeek.total;

  bsMonth.textContent = summaryData.summaryMonth.bs;
  usdMonth.textContent = summaryData.summaryMonth.usd;
  totalMonth.textContent = summaryData.summaryMonth.total;
});


window.api.recieve("saleDeleted", saleId => {
  const deletedSaleRow = document.querySelector(`[data-sale-id='${saleId}']`);
  deletedSaleRow.remove();
  window.api.send("getSummaryDayData", new Date(mainDate.value));
})