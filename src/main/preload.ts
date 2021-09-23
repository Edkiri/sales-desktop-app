import { contextBridge, ipcRenderer } from "electron";

window.addEventListener('DOMContentLoaded', () => {})

contextBridge.exposeInMainWorld(
  "api", {
    send: (channel: string, data?: any) => {
      let validChannels = [
        
        "getDailySales",
        "getSummaryDayData",
        "setDailyRate",
        "createSale",
        "getDailyRate",
        "sendNewSaleData",

        
        "verifyClient", 
        "createClient", 
        "displayClientForm", 
        "updateClient",
        "displaySearchClientWindow",
        "searchClient",
        "selectClient",

        "displayProductsWindow",
        "searchProductByName",
        "sendOrderData",

        "createPayment",
        "sendPaymentData"
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    recieve: (channel: string, func: any) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
)