
class PreOrderFrame {
  constructor(containerId) {
    this.parent = document.getElementById(containerId).parentElement;
    
    this.container = document.createElement('div');
    this.container.classList.add("preOrderContainer");
    this.productNameSpan = document.createElement('p');
    this.productNameSpan.classList.add("productName");
    this.priceLabel = document.createElement('label');
    this.price = document.createElement('input');
    this.amountLabel = document.createElement('label');
    this.amount = document.createElement('input');

    this.init();
    this.parent.appendChild(this.container);
  }

  init() {
    this.productNameSpan.textContent = "Selecciona un producto.";
    this.productNameSpan.classList.add("disabled");

    

    this.priceLabel.textContent = "Precio :";
    this.priceLabel.classList.add("disabled");
    this.priceLabel.for = "orderPrice";
    this.price.id = "orderPrice";

    this.amountLabel.textContent = "Cantidad :";
    this.amountLabel.classList.add("disabled");
    this.amountLabel.for = "amount";
    this.amount.id = "amount";

    const inputsContainer = document.createElement('div');
    this.price.disabled = true;
    this.price.classList.add("disabled");
    this.amount.disabled = true;
    this.amount.classList.add("disabled");
    inputsContainer.classList.add("inputsContainer");
    inputsContainer.append(
      this.priceLabel,
      this.price,
      this.amountLabel,
      this.amount
    )
    
    this.container.append(
      this.productNameSpan,
      inputsContainer
    );
  };

  update(productName, productPrice) {
    this.productNameSpan.textContent = productName;
    this.productNameSpan.classList.remove("disabled");
    this.priceLabel.classList.remove("disabled");
    this.amountLabel.classList.remove("disabled");
    this.price.disabled = false;
    this.price.classList.remove("disabled");
    this.amount.disabled = false;
    this.amount.classList.remove("disabled");
    
    this.price.value = productPrice;
    this.amount.value = 1;
  }

  disable() {
    this.productNameSpan.textContent = "Selecciona un producto.";
    this.productNameSpan.classList.add("disabled");
    this.priceLabel.classList.add("disabled");
    this.amountLabel.classList.add("disabled");
    this.price.disabled = true;
    this.price.classList.add("disabled");
    this.amount.disabled = true;
    this.amount.classList.add("disabled");
    this.price.value = "";
    this.amount.value = "";
  }
}