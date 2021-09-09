
class TotalPaymentsObserver {
  constructor(usdTag, bsTag) {
    this.usdTag = usdTag;
    this.bsTag = bsTag;
  }

  notify(subject) {
    let totalUsd = 0;
    let totalBs = 0;
    const payments = Object.values(subject.payments);
    payments.forEach(pay => {
      if(pay.currency.id != "1") {
        totalBs += pay.amount;
      } else {
        totalUsd += pay.amount;
      }
    })
    this.usdTag.textContent = totalUsd;
    this.bsTag.textContent = totalBs;
  }
}

class TotalOrdersObserver {
  constructor(usdTag, bsTag){
    this.usdTag = usdTag;
    this.bsTag = bsTag;
  }

  notify(subject) {
    const totalUsd = subject.getTotalOrders();
    this.usdTag.textContent = totalUsd;
    this.bsTag.textContent = totalUsd * dailyRate;
  }

}

class TotalRemainingObserver {
  constructor(usdTag, bsTag) {
    this.usdTag = usdTag;
    this.bsTag = bsTag;
    this.totalOrders = 0;
    this.totalPayments = 0;
  }

  notify(subject) {
    if(subject.hasOwnProperty("payments")) {
      this.totalPayments = subject.getTotalPayments();
    } else {
      this.totalOrders = subject.getTotalOrders();
    }
    const totalRemainingUsd = this.totalOrders - this.totalPayments;
    this.usdTag.textContent = totalRemainingUsd;
    this.bsTag.textContent = totalRemainingUsd * dailyRate;
  }
}