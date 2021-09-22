import { Client } from "../../database/entities/Client";
import { Connection } from "typeorm";
import { BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";


export function addClientEvents(win: BrowserWindow, connection: Connection): void {
  
  ipcMain.on('verifyClient', async (event, clientIdCard: string) => {
    const client: Client = await connection
      .getRepository(Client)
      .createQueryBuilder("client")
      .where("client.identityCard = :clientIdCard", {clientIdCard: clientIdCard})
      .getOne()
    if(client) {
      event.sender.send('printClient', client);
    } else {
      const newClientWin = new BrowserWindow({
        parent: win,
        modal: true,
        show: false,
        maximizable: false,
        minimizable: false,
        width: 450,
        height: 650,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          enableRemoteModule: false,
          preload: path.join(__dirname, '../preload.js')
        },
      })
      newClientWin.loadURL(path.join(__dirname, "../../../src/renderer/client/createOrUpdateClientForm.html"));
      newClientWin.once('ready-to-show', () => {
        newClientWin.show();
        newClientWin.webContents.send('newClientIdCard', clientIdCard);
      });
    }
  })
  
  ipcMain.on('createClient', async (event, newClientData: any) => {
    try {
      const client = await createClient(newClientData);
      win.webContents.send("printClient", client);
      event.sender.send('closeWindow');
    } catch(err) {
      console.error(err)
    }
  });
  
  
  const createClient = async (newClientData: any): Promise<Client> => {
    try {
      const client = await connection.getRepository(Client).save({
        name: newClientData.name,
        identityCard: newClientData.idCard,
        phoneNumber: newClientData.phoneNumber
      })
      return client;
    } catch(err) {
      console.error("Error creando el cliente.", err);
    }
  }
  
  ipcMain.on("displayClientForm", (event, client) => {
    const updateClientWin = new BrowserWindow({
      parent: win,
      modal: true,
      show: false,
      width: 450,
      height: 650,
      maximizable: false,
      minimizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, '../preload.js')
      },
    })
    updateClientWin.loadURL(path.join(__dirname, "../../../src/renderer/client/createOrUpdateClientForm.html"));
      updateClientWin.once('ready-to-show', () => {
        updateClientWin.show();
        updateClientWin.webContents.send('printClientInfo', client);
      });
  })
  
  ipcMain.on("updateClient", async (event, clientData) => {
    try {
      const client = await connection.getRepository(Client).save({
        id: clientData.id,
        name: clientData.name,
        identityCard: clientData.identityCard,
        phoneNumber: clientData.phoneNumber
      })
      win.webContents.send("printClient", client);
      event.sender.send('closeWindow');
    } catch(err) {
      console.error("Error actualizando el cliente.", err);
    }
  })
  
  ipcMain.on("displaySearchClientWindow", (event) => {
    const searchClientWin = new BrowserWindow({
      parent: win,
      modal: true,
      show: false,
      width: 600, 
      height: 450,
      maximizable: false,
      minimizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, '../preload.js')
      },
    })
    searchClientWin.loadURL(path.join(__dirname, "../../../src/renderer/client/searchClient.html"));
      searchClientWin.once('ready-to-show', () => {
        searchClientWin.show();
      });
  })
  
  ipcMain.on("searchClient", async (event, clientName: string) => {
    try {
      const clients = await connection.getRepository(Client)
        .createQueryBuilder("client")
        .where("LOWER(client.name) LIKE '%' || LOWER(:clientName) || '%'", {clientName: clientName})
        .getMany()
      event.sender.send("printClients", clients);
    } catch(err) {
      console.error("Error buscando clientes.", err);
    }
  })
  
  ipcMain.on("selectClient", async (event, clientId) => {
    try {
      const client = await connection.getRepository(Client)
        .createQueryBuilder("client")
        .where("client.id = :clientId", {clientId: clientId})
        .getOne()
      win.webContents.send("printClient", client);
      event.sender.send("closeWindow");
    } catch(err) {
      console.error("Error seleccionando el cliente.", err);
    }
  })
}