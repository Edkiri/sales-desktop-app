
class CreateOrUpdateClientForm {
  constructor (clientFormId) {
    this.clientForm = document.getElementById(clientFormId);

    const nameLabel = document.createElement('label');
    nameLabel.for = "nameInput";
    nameLabel.textContent = "Nombre";
    this.clientForm.appendChild(nameLabel);

    this.nameInput = document.createElement('input');
    this.nameInput.id = "nameInput";
    this.nameInput.type = "text";
    this.clientForm.appendChild(this.nameInput);

    const idCardLabel = document.createElement('label');
    idCardLabel.for = "idCardInput";
    idCardLabel.textContent = "Cédula";
    this.clientForm.appendChild(idCardLabel);

    this.preIdCardSelect = document.createElement('select');
    this.preIdCardSelect.id = "preIdCardSelect";
    const OPT1 = document.createElement('option');
    const OPT2 = document.createElement('option');
    OPT1.value = "V";
    OPT2.value = "J";
    OPT1.textContent = "V";
    OPT2.textContent = "J";
    this.preIdCardSelect.append(OPT1, OPT2);
    this.clientForm.appendChild(this.preIdCardSelect);

    this.idCardInput = document.createElement('input');
    this.idCardInput.id = "idCardInput";
    this.idCardInput.type = "number";
    this.clientForm.appendChild(this.idCardInput);

    const phoneNumberLabel = document.createElement('label');
    phoneNumberLabel.textContent = "Teléfono";
    phoneNumberLabel.for = "phoneNumber";
    this.clientForm.appendChild(phoneNumberLabel);

    this.phoneNumberInput = document.createElement('input');
    this.phoneNumberInput.type = "text";
    this.phoneNumberInput.id = "phoneNumber";
    this.clientForm.appendChild(this.phoneNumberInput);

    this.addListeners();
  }

  addListeners() {

    window.api.recieve("newClientIdCard", (newClientIdCard) => {
      const arrNewClientIdCard = newClientIdCard.split("-");
      this.preIdCardSelect.value = arrNewClientIdCard[0];
      this.idCardInput.value = arrNewClientIdCard[1];

      this.saveBtn = document.createElement('button');
      this.saveBtn.type = "button";
      this.saveBtn.textContent = "Crear";
      this.saveBtn.id = "saveBtn";
      this.saveBtn.onclick = this.createClient.bind(this);
      this.clientForm.appendChild(this.saveBtn);
    })

    window.api.recieve("printClientInfo", (client) => {
      this.clientId = client.id;
      this.nameInput.value = client.name;
      this.preIdCardSelect.value = client.identityCard.split("-")[0];
      this.idCardInput.value = client.identityCard.split("-")[1];
      this.phoneNumberInput. value = client.phoneNumber;
      
      this.updateBtn = document.createElement('button');
      this.updateBtn.type = "button";
      this.updateBtn.textContent = "Actualizar";
      this.updateBtn.id = "updateBtn";
      this.updateBtn.onclick = this.updateClient.bind(this);
      this.clientForm.appendChild(this.updateBtn);
    })
  }

  createClient() {
    const preId = this.preIdCardSelect.value;
    const id = this.idCardInput.value;
    const newClientData = {
      name: this.nameInput.value,
      idCard: `${preId}-${id}`,
      phoneNumber: this.phoneNumberInput.value
    }
    window.api.send("createClient", newClientData);
  }

  updateClient() {
    const preId = this.preIdCardSelect.value;
    const id = this.idCardInput.value;
    const clientData = {
      id: this.clientId,
      name: this.nameInput.value,
      identityCard: `${preId}-${id}`,
      phoneNumber: this.phoneNumberInput.value
    }
    window.api.send("updateClient", clientData);
  }
}