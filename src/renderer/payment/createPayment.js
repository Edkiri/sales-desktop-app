const returnCheckbox = document.getElementById('isReturn');
const currencySelect = document.getElementById('currency');
const methodSelect = document.getElementById('method');
const accountSelect = document.getElementById('account');
const rateInput = document.getElementById('rate');
const amountInput = document.getElementById('amount');

const addBtn = document.getElementById('addButton');
addBtn.onclick = () => {
  paymentData = getPaymentData();
  window.api.send('sendPaymentData', paymentData);
}

function getPaymentData() {
  const currencyIndex =  currencySelect.options.selectedIndex;
  const currencyName = currencySelect.options[currencyIndex].textContent;
  const methodIndex =  methodSelect.options.selectedIndex;
  const methodName = methodSelect.options[methodIndex].textContent;
  let amount;
  if(returnCheckbox.checked) {
    amount = parseFloat(amountInput.value) * (-1);
  } else {
    amount = parseFloat(amountInput.value);
  }
  const paymentData = {
    currency: {
      id: currencySelect.value,
      name: currencyName
    },
    method: {
      id: methodSelect.value,
      name: methodName
    },
    accountId: accountSelect.value,
    rate: rateInput.value,
    amount: amount,
    isReturn: returnCheckbox.checked
  }
  return paymentData;
}

window.api.recieve('paymentConfig', (paymentConfig) => {
  const currencies = paymentConfig.currencies;
  const methods = paymentConfig.methods;
  const accounts = paymentConfig.accounts;

  const currSelect = document.getElementById('currency');
  currencies.forEach(currency => {
    const currOption = document.createElement('option');
    currOption.textContent = currency.name;
    currOption.value = currency.id;
    currSelect.appendChild(currOption);
  })

  const methodSelect = document.getElementById('method');
  methods.forEach(method => {
    const methodOption = document.createElement('option');
    methodOption.textContent = method.name;
    methodOption.value = method.id;
    methodSelect.appendChild(methodOption);
  })

  const accountSelect = document.getElementById('account');
  accounts.forEach(account => {
    const accountOption = document.createElement('option');
    accountOption.textContent = `${account.bank} - ${account.owner}`;
    accountOption.value = account.id;
    accountSelect.appendChild(accountOption);
  })

})

window.api.recieve('closeWindow', () => {
  window.close();
})

window.api.recieve('isReturn', () => {
  returnCheckbox.checked = true;
})

window.api.send('getDailyRate');
window.api.recieve('rateValue', rate => {
  console.log(rate);
  rateInput.value = rate;
})