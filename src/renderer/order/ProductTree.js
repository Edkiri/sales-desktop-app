
class ProductTree {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.treeContainer = document.createElement('ol');
    this.createHeader();
    this.container.appendChild(this.treeContainer);

    this.preOrder = new PreOrderFrame(containerId);

    this.submitBtn = document.createElement('button');
    this.submitBtn.textContent = "Agregar";
    this.submitBtn.disabled = true;
    this.container.appendChild(this.submitBtn);

    this.addListeners();
  }

  
  createHeader() {
    const headerRow = document.createElement('li');
    const brand = document.createElement('span');
    brand.textContent = "Marca";
    const name = document.createElement('span');
    name.textContent = "Nombre";
    const reference = document.createElement('span');
    reference.textContent = "Referencia";
    const code = document.createElement('span');
    code.textContent = "Código";
    const price = document.createElement('span');
    price.textContent = "Precio";
    headerRow.append(brand, name, reference, code, price);
    this.treeContainer.append(headerRow);
  }

  addListeners() {

    window.api.recieve("printProducts", (products) => {
      this.preOrder.disable();
      this.submitBtn.disabled = true;
      this.treeContainer.innerHTML = "";
      this.createHeader();
      products.forEach(product => {
        const treeRow = document.createElement('li');
        treeRow.className = "treeRow";
        treeRow.dataset.productId = product.id;
        treeRow.dataset.productName = product.name;
        treeRow.dataset.productPrice = product.price;
        const brand = document.createElement('span');
        brand.textContent = product.brand;
        const name = document.createElement('span');
        name.textContent = product.name;
        const reference = document.createElement('span');
        reference.textContent = product.reference;
        const code = document.createElement('span');
        code.textContent = product.code;
        const price = document.createElement('span');
        price.textContent = product.price;
        treeRow.append(brand, name, reference, code, price);
        this.treeContainer.append(treeRow);
      });
    });

    document.addEventListener('click', e => {
      if (e.target.matches('.treeRow span')) {
        const treeRow = e.target.parentElement;
        this.selectRow(treeRow);
      } else if(e.target.matches('.treeRow')) {
        const treeRow = e.target;
        this.selectRow(treeRow);
      }
    });

    this.submitBtn.onclick = this.sendOrderData.bind(this);
  }


  selectRow(treeRow) {
    this.unselectRow();
    treeRow.classList.add("selected");
    this.preOrder.update(
      treeRow.dataset.productName, 
      treeRow.dataset.productPrice
    );
    this.submitBtn.disabled = false;
  }


  unselectRow() {
    const selectedRow = document.querySelector('.selected');
    if (selectedRow) {
      selectedRow.classList.remove('selected');
    }
  }


  sendOrderData() {
    const rowTree = document.querySelector('.selected');
    const orderData = {
      productId: rowTree.dataset.productId,
      productName: rowTree.dataset.productName,
      productPrice: this.preOrder.price.value,
      amount: this.preOrder.amount.value
    }
    window.api.send("sendOrderData", orderData);
  }
  
}