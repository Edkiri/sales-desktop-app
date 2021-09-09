let dailyRate;
window.api.send("getDailyRate");
window.api.recieve('rateValue', rate => {
  dailyRate = parseInt(rate);
})

const paymentTree = new PaymentTree(
  document.getElementById("paymentTree")
);

const orderTree = new OrderTree(
  document.getElementById("orderTree")
);

const clientFrame = new ClientFrame("clientContainer");


const totalOrdersObserver = new TotalOrdersObserver(
  document.getElementById("totalOrdersUsd"),
  document.getElementById("totalOrdersBs")
)

const totalPaymentsObserver = new TotalPaymentsObserver(
  document.getElementById("totalPaymentsUsd"),
  document.getElementById("totalPaymentsBs")
)

const totalRemainingObserver = new TotalRemainingObserver(
  document.getElementById("totalRemainingUsd"),
  document.getElementById("totalRemainingBs")
)

orderTree.subscribe(totalOrdersObserver);
paymentTree.subscribe(totalPaymentsObserver);

orderTree.subscribe(totalRemainingObserver);
paymentTree.subscribe(totalRemainingObserver);

const createSaleBtn = document.getElementById("createSaleBtn");

createSaleBtn.addEventListener('click', () => {
  const newSaleData = {
    clientId: clientFrame.client.id,
    description: document.getElementById("descriptionInput").value,
    payments: Object.values(paymentTree.payments),
    orders: Object.values(orderTree.orders),
    totalPayments: paymentTree.getTotalPayments(),
    totalOrders: orderTree.getTotalOrders(),
  }
  window.api.send("sendNewSaleData", newSaleData);
})