
window.api.recieve("closeWindow", () => {
  window.close();
})

window.api.recieve("printClients", (clients) => {
  const clientTree = document.getElementById("clientTree");
  clientTree.innerHTML = "";
  printHeaderTree(clientTree);
  clients.forEach(client => {
    const treeRow = document.createElement('li');
    treeRow.dataset.clientId = client.id;
    const name = document.createElement('span');
    name.textContent = client.name;
    const idCard = document.createElement('span');
    idCard.textContent = client.identityCard;
    treeRow.append(name, idCard);
    clientTree.append(treeRow);
    treeRow.ondblclick = (event) => {
      if(event.target.nodeName === 'LI') {
        const clientId = event.target.dataset.clientId;
        window.api.send("selectClient", clientId);
      } else {
        const clientId = event.target.parentElement.dataset.clientId;
        window.api.send("selectClient", clientId);
      }
    }
  })
})


const clientTree = document.getElementById("clientTree");
const nameInput = document.getElementById("nameInput");
nameInput.addEventListener("keydown", (event) => {
  if(event.key === "Enter") {
    window.api.send("searchClient", nameInput.value);
  }
})

function printHeaderTree(clientTree) {
  const treeRow = document.createElement('li');
  const name = document.createElement('span');
  name.textContent = "Nombre";
  const idCard = document.createElement('span');
  idCard.textContent = "Cédula";
  treeRow.append(name, idCard);
  clientTree.append(treeRow);
}
nameInput.focus();