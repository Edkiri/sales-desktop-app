
window.api.recieve("closeWindow", () => {
  window.close();
})

const selectBtn = document.getElementById("selectBtn");
selectBtn.disabled = true;

window.api.recieve("printClients", (clients) => {
  const clientTree = document.getElementById("clientTree");
  clientTree.innerHTML = "";
  printHeaderTree(clientTree);
  clients.forEach(client => {
    const treeRow = document.createElement('li');
    treeRow.dataset.clientId = client.id;
    treeRow.classList.add("clientTreeRow");
    treeRow.innerHTML =  `
      <span>${client.name}</span>
      <span>${client.identityCard}</span>
    `;
    clientTree.append(treeRow);

    treeRow.onclick = (event) => {
      let liTagSelected;
        if (event.target.nodeName==="SPAN"){
          liTagSelected = event.target.parentElement;
        } else {
          liTagSelected = event.target;
        }
        this.selectRow(liTagSelected);
    }

  })
})


function selectRow(tag) {
  const selectedRow = document.querySelector(".clientTreeRow.selected");
  if (selectedRow == tag) {
    tag.classList.remove('selected');
    this.selectBtn.disabled = true;
  } else {
    if(selectedRow) selectedRow.classList.remove('selected');
    tag.classList.add("selected");
    this.selectBtn.disabled = false;
  };
}


const clientTree = document.getElementById("clientTree");
const nameInput = document.getElementById("nameInput");
nameInput.addEventListener("keydown", (event) => {
  if(event.key === "Enter") {
    const selectedRow = document.querySelector(".clientTreeRow.selected");
    if(selectedRow) {
      selectedRow.classList.remove('selected');
      selectBtn.disabled = true;
    }
    window.api.send("searchClient", nameInput.value);
  }
})

function printHeaderTree(clientTree) {
  const treeRow = document.createElement('li');
  treeRow.classList.add("clientTreeHeader");
  treeRow.innerHTML = `
    <span>Nombre</span>
    <span>Cédula</span>
  `;
  clientTree.append(treeRow);
}
printHeaderTree(clientTree);
nameInput.focus();

window.addEventListener("keydown", (event) => {
  if(event.key === "Escape") {
    const selectedRow = document.querySelector(".selected");
    if(selectedRow) {
      selectedRow.classList.remove("selected");
      this.selectBtn.disabled = true;
    }
  }
})

window.addEventListener("keydown", e => {
  if(event.key === "Enter") {
    const selectedRow = document.querySelector(".clientTreeRow.selected");
    if(selectedRow) {
      const clientId = selectedRow.dataset.clientId;
      window.api.send("selectClient", clientId);
    }
  }
})

selectBtn.onclick = () => {
  const selectedRow = document.querySelector(".clientTreeRow.selected");
  const clientId = selectedRow.dataset.clientId;
  window.api.send("selectClient", clientId);
}