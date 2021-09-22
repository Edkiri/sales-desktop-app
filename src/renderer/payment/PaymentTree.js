
class PaymentTree extends Subject {
  constructor(olTag) {
    super();
    this.tree = olTag;
    this.paymentIndexAux = 0;
    this.payments = {};

    this.addPayBtn = document.createElement('button');
    this.addPayBtn.type = "button";
    this.addPayBtn.classList.add("addPayBtn"); 
    
    this.addReturnBtn = document.createElement('button');
    this.addReturnBtn.type = "button";
    this.addReturnBtn.classList.add("addReturnBtn"); 
    
    this.removePayBtn = document.createElement('button');
    this.removePayBtn.type = "button";
    this.removePayBtn.classList.add("removePayBtn"); 
    this.removePayBtn.disabled = true;

    this.tree.parentElement.append(this.addPayBtn, this.addReturnBtn, this.removePayBtn);
    
    this.addListeners();

  }

  createPayment(isReturn) {
    window.api.send("createPayment", isReturn);
  }

  addPayment(paymentData) {
    const treeRow = document.createElement('li');
    treeRow.classList.add("paymentTreeRow");
    treeRow.dataset.paymentIndexAux = this.paymentIndexAux;

    treeRow.innerHTML = `
      <span>${paymentData.amount}</span>
      <span>${paymentData.currency.name}</span>
      <span>${paymentData.method.name}</span>
    `

    treeRow.onclick = (event) => {
      let liTagSelected;
      if (event.target.nodeName === "SPAN"){
        liTagSelected = event.target.parentElement;
      } else {
        liTagSelected = event.target;
      }
      this.selectRow(liTagSelected);
    }

    this.tree.appendChild(treeRow);
  }

  addListeners() {

    window.api.recieve('addPaymentToTree', paymentData => {
      this.payments[this.paymentIndexAux] = paymentData;
      super.notify(this);
      this.addPayment(paymentData);
      this.paymentIndexAux++;
    })

    this.addReturnBtn.onclick = () => {
      this.createPayment(true);
    }

    this.addPayBtn.onclick = () => {
      this.createPayment(false)
    };

    this.removePayBtn.onclick = () => {
      const selectedRow = document.querySelector('.paymentTreeRow.selected');
      const rowIndex = selectedRow.dataset.paymentIndexAux;
      delete this.payments[rowIndex];
      super.notify(this);
      selectedRow.remove();
      this.removePayBtn.disabled = true;
    }

  }

  getTotalPayments() {
    let totalPayments = 0;
    const payments = Object.values(this.payments);
    payments.forEach(pay => {
      if(pay.currency.id != "1") {
        totalPayments += pay.amount / dailyRate;
      } else {
        totalPayments += pay.amount;
      }
    })
    return totalPayments;
  }

  selectRow(tag) {
    const selectedRow = document.querySelector(".paymentTreeRow.selected");
    if (selectedRow == tag) {
      tag.classList.remove('selected');
      this.removePayBtn.disabled = true;
    } else {
      if(selectedRow) selectedRow.classList.remove('selected');
      tag.classList.add("selected");
      this.removePayBtn.disabled = false;
    };
  }

}