const nameInput = document.getElementById("nameInput");
const preIdCardSelect = document.getElementById("preIdCardSelect");
const idCardInput = document.getElementById("idCardInput");
const phoneNumberInput = document.getElementById("phoneNumber");
const formTitle = document.querySelector(".formTitle");
let clientId;

const createBtn = document.getElementById("createBtn");
createBtn.onclick = createClient;
const updateBtn = document.getElementById("updateBtn");
updateBtn.onclick = updateClient;


window.api.recieve("newClientIdCard", (newClientIdCard) => {
  const arrNewClientIdCard = newClientIdCard.split("-");
  preIdCardSelect.value = arrNewClientIdCard[0];
  idCardInput.value = arrNewClientIdCard[1];
  createBtn.style.display = "inline-block";
  formTitle.textContent = "Crear Cliente";
})


window.api.recieve("printClientInfo", (client) => {
  clientId = client.id;
  nameInput.value = client.name;
  preIdCardSelect.value = client.identityCard.split("-")[0];
  idCardInput.value = client.identityCard.split("-")[1];
  phoneNumberInput. value = client.phoneNumber;
  updateBtn.style.display = "inline-block";
  formTitle.textContent = "Actualizar Cliente";
})

function createClient() {
  const preId = preIdCardSelect.value;
  const id = idCardInput.value;
  const newClientData = {
    name: nameInput.value,
    idCard: `${preId}-${id}`,
    phoneNumber: phoneNumberInput.value
  }
  window.api.send("createClient", newClientData);
}


function updateClient() {
  const preId = preIdCardSelect.value;
  const id = idCardInput.value;
  const clientData = {
    id: clientId,
    name: nameInput.value,
    identityCard: `${preId}-${id}`,
    phoneNumber: phoneNumberInput.value
  }
  window.api.send("updateClient", clientData);
}