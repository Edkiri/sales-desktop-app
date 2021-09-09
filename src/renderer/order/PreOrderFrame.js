
class PreOrderFrame {
  constructor(containerId) {
    this.parent = document.getElementById(containerId);
    
    this.container = document.createElement('div');
    this.productNameSpan = document.createElement('span');
    this.priceLabel = document.createElement('label');
    this.price = document.createElement('input');
    this.amountLabel = document.createElement('label');
    this.amount = document.createElement('input');

    this.init();
    this.parent.appendChild(this.container);
  }

  init() {
    this.productNameSpan.textContent = "Selecciona un producto.";

    this.priceLabel.textContent = "Precio";
    this.priceLabel.for = "orderPrice";
    this.price.id = "orderPrice";

    this.amountLabel.textContent = "Cantidad";
    this.amountLabel.for = "amount";
    this.amount.id = "amount";

    this.container.append(
      this.productNameSpan,
      this.priceLabel,
      this.price,
      this.amountLabel,
      this.amount
    );
  };

  update(productName, productPrice) {
    this.productNameSpan.textContent = productName;
    this.price.value = productPrice;
    this.amount.value = 1;
  }

  disable() {
    this.productNameSpan.textContent = "Selecciona un producto.";
    this.price.value = "";
    this.amount.value = "";
  }
}