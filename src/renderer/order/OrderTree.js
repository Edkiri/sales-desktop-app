

class OrderTree extends Subject {
  constructor(tree) {
    super();
    this.tree = tree;
    this.orders = {};
    this.orderIndexAux = 0;

    this.addOrderBtn = document.createElement('button');
    this.addOrderBtn.textContent = "Agregar";

    this.removeOrderBtn = document.createElement('button');
    this.removeOrderBtn.textContent = "Eliminar";
    this.removeOrderBtn.disabled = true;

    this.tree.parentElement.append(this.addOrderBtn, this.removeOrderBtn);

    this.addListeners();
  }

  addListeners() {
    window.api.recieve("printPreOrderToTree", (orderData) => {
      this.orders[this.orderIndexAux] = orderData;
      super.notify(this);
      const treeRow = document.createElement('li');
      treeRow.dataset.orderDataIndex = this.orderIndexAux;
      this.orderIndexAux++;
      treeRow.classList.add("orderListRow");
      treeRow.innerHTML = `
        <span>${orderData.productName}</span>
        <span>${orderData.amount}</span>
        <span>${orderData.productPrice}</span>
        <span>${orderData.total}</span>
      `;
      treeRow.onclick = (event) => {
        let liTagSelected;
        if (event.target.nodeName==="SPAN"){
          liTagSelected = event.target.parentElement;
        } else {
          liTagSelected = event.target;
        }
        this.selectRow(liTagSelected);
      }
      this.tree.appendChild(treeRow);
    })
    

    this.addOrderBtn.onclick = () => {
      window.api.send("displayProductsWindow");
    }

    
    this.removeOrderBtn.onclick = () => {
      const selectedRow = document.querySelector(".orderListRow.selected");
      const orderDataIndex = selectedRow.dataset.orderDataIndex;
      delete this.orders[orderDataIndex];
      super.notify(this);
      selectedRow.remove();
      this.removeOrderBtn.disabled = true;
    }

    window.addEventListener("keydown", (event) => {
      if(event.key === "Escape") {
        const selectedRow = document.querySelector(".selected");
        if(selectedRow) {
          selectedRow.classList.remove("selected");
          this.removeOrderBtn.disabled = true;
        }
      }
    })

  }

  selectRow(tag) {
    const selectedRow = document.querySelector(".orderListRow.selected");
    if (selectedRow == tag) {
      tag.classList.remove('selected');
      this.removeOrderBtn.disabled = true;
    } else {
      if(selectedRow) selectedRow.classList.remove('selected');
      tag.classList.add("selected");
      this.removeOrderBtn.disabled = false;
    };
  }

  getTotalOrders() {
    const ordersList = Object.values(this.orders);
    const totalOrders = ordersList.reduce((ac, currenct) => ac + currenct.total, 0); 
    return totalOrders;
  }

}