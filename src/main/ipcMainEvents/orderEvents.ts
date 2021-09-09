import { Product } from "../../database/entities/Product";
import { Connection } from "typeorm";
import { BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";

export function addOrderEvents(win: BrowserWindow, connection: Connection): void {
  
  ipcMain.on("displayProductsWindow", (event) => {
    const newOrderWin = new BrowserWindow({
      parent: win,
      modal: true,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, '../preload.js')
      },
    })
    newOrderWin.loadURL(path.join(__dirname, "../../../src/renderer/order/createOrder.html"));
    newOrderWin.once('ready-to-show', () => {
      newOrderWin.show();
      newOrderWin.webContents.openDevTools();
    });
  })
  
  ipcMain.on("searchProductByName", async (event, productName: string) => {
    const words: string[] = productName.split(" ");
    let queryBuilder = connection.getRepository(Product).createQueryBuilder("product");
    let products: Product[] = [];
    let counter = 0;
    for( const word in words ) {
      if(counter === 0) {
        products = await queryBuilder
          .where("LOWER(product.name) LIKE '%' || LOWER(:productName) || '%'", {productName: words[word]})
          .limit(100)
          .getMany();
        counter++;
      } else {
        if(["", " "].indexOf(words[word]) <= -1) {
          products = products.filter(product => product.name.toLowerCase().includes(words[word].toLowerCase()));
        }
      }
    }
    event.sender.send("printProducts", products);
  })
  
  
  ipcMain.on("sendOrderData", (event, orderData) => {
    orderData['total'] = <number>orderData.productPrice * <number>orderData.amount;
    win.webContents.send('printPreOrderToTree', orderData);
    event.sender.send('closeWindow');
  })

}