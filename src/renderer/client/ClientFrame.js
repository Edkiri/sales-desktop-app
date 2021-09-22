
class ClientFrame {
  constructor (containerId, client = null) {
    this.container = document.getElementById(containerId);
    this.title = document.createElement('span');

    this.clientName = document.createElement('span');
    this.clientName.classList.add('name');
    this.clientName.style.display = "none";
    this.detailBtn = document.createElement('span');
    this.detailBtn.classList.add("detailBtn");
    this.detailBtn.style.display = "none";
    this.changeClientBtn = document.createElement('span');
    this.changeClientBtn.classList.add("changeBtn");
    this.changeClientBtn.style.display = "none";
    
    this.preIdCard = document.createElement('select');
    this.idCard = document.createElement('input');

    this.searchClientBtn = document.createElement('div');
    this.verifyIdCardBtn = document.createElement('span');

    this.idCardContainer = document.createElement('div');
    this.idCardContainer.classList.add("idCardContainer");
    

    this.client = client;

    this.initFrame();
    if(this.client) {
      this.printClient(this.client);
    }

    this.addEventListener();
  }
  initFrame() {
    this.title.textContent = "Cliente :";
    this.title.classList.add("titleLabel")
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
    
    this.searchClientBtn.classList.add("searchBtn");
    this.searchClientBtn.onclick = () => {
      window.api.send("displaySearchClientWindow");
    }

    this.verifyIdCardBtn.classList.add("verifyBtn");
    
    this.idCardContainer.append(this.idCard, this.verifyIdCardBtn)
    this.container.append(
      this.title,
      this.preIdCard,
      this.idCardContainer,
      this.searchClientBtn
    )
  }
  
  printClient(client) {
    this.client = client;

    this.preIdCard.style.display = "none";
    this.searchClientBtn.style.display = "none";
    this.idCardContainer.style.display = "none";

    this.clientName.style.display = "inline-block";
    this.clientName.textContent = client.name;
    this.container.appendChild(this.clientName);
    
    
    this.detailBtn.style.display = "inline-block";
    this.detailBtn.onclick = () => {
      window.api.send("displayClientForm", client);
    }
    this.container.appendChild(this.detailBtn);

    this.changeClientBtn.style.display = "inline-block";
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
      this.idCardContainer.style.display = "flex";
      this.searchClientBtn.style.display = "inline-block";
    }
  }

  addEventListener() {

    window.api.recieve("printClient", (client) => {
      this.printClient(client);
    })

    this.idCard.addEventListener("keydown", event => {
      if(event.key === "Enter") {
        const clientIdCardString = this.preIdCard.value + "-" + this.idCard.value;
        window.api.send("verifyClient", clientIdCardString);
      }
    })

    this.verifyIdCardBtn.onclick = () => {
      const clientIdCardString = this.preIdCard.value + "-" + this.idCard.value;
      window.api.send("verifyClient", clientIdCardString);
    }
    
  }
}