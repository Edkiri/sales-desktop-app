
class ClientFrame {
  constructor (containerId, client = null) {
    this.container = document.getElementById(containerId);
    this.title = document.createElement('span');

    this.clientName = document.createElement('span');
    this.clientName.style.display = "none";
    this.detailBtn = document.createElement('button');
    this.detailBtn.style.display = "none";
    this.changeClientBtn = document.createElement('button');
    this.changeClientBtn.style.display = "none";
    
    this.preIdCard = document.createElement('select');
    this.idCard = document.createElement('input');
    this.searchClientBtn = document.createElement('button');
    this.client = client;
    this.initFrame();
    if(this.client) {
      this.printClient(this.client);
    }

    this.addEventListener();
  }
  initFrame() {
    this.title.textContent = "Cliente";
    this.title.style.fontWeight = 700;

    this.preIdCard.name = "idCard";
    const optionV = document.createElement('option');
    optionV.value = "V";
    optionV.textContent = "V";
    const optionJ = document.createElement('option');
    optionJ.value = "J";
    optionJ.textContent = "J";
    this.preIdCard.appendChild(optionV);
    this.preIdCard.appendChild(optionJ);

    this.idCard.type = "number";
    this.idCard.addEventListener("keydown", event => {
      if(event.key === "Enter") {
        const clientIdCardString = this.preIdCard.value + "-" + this.idCard.value;
        window.api.send("verifyClient", clientIdCardString);
      }
    })
    this.searchClientBtn.textContent = "Buscar";
    this.searchClientBtn.onclick = () => {
      window.api.send("displaySearchClientWindow");
    }
    
    this.container.appendChild(this.title);
    this.container.appendChild(this.preIdCard);
    this.container.appendChild(this.idCard);
    this.container.appendChild(this.searchClientBtn);
  }
  
  printClient(client) {
    this.client = client;

    this.preIdCard.style.display = "none";
    this.idCard.style.display = "none";
    this.searchClientBtn.style.display = "none";

    this.clientName.style.display = "inline-block";
    this.clientName.textContent = client.name;
    this.container.appendChild(this.clientName);
    
    
    this.detailBtn.style.display = "inline-block";
    this.detailBtn.textContent = "Detalle";
    this.detailBtn.type = "button";
    this.detailBtn.onclick = () => {
      window.api.send("displayClientForm", client);
    }
    this.container.appendChild(this.detailBtn);

    this.changeClientBtn.style.display = "inline-block";
    this.changeClientBtn.textContent = "Cambiar";
    this.container.appendChild(this.changeClientBtn);
    this.changeClientBtn.onclick = () => {
      this.clientName.style.display = 'none';
      this.changeClientBtn.style.display = 'none';
      this.detailBtn.style.display = 'none';
      this.changeClientBtn.style.display = 'none';
      this.client = null;
      this.preIdCard.style.display = "inline-block";
      this.idCard.value = "";
      this.idCard.style.display = "inline-block";
      this.searchClientBtn.style.display = "inline-block";
    }
  }

  addEventListener() {

    window.api.recieve("printClient", (client) => {
      this.printClient(client);
    })
    
  }
}