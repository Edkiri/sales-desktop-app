import { BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";
import { Currency } from '../../database/entities/Currency';
import { PaymentMethod } from '../../database/entities/PaymentMethod';
import { PaymentAccount } from '../../database/entities/PaymentAccount';
import { Connection } from 'typeorm';


export function addPaymentEvents(win: BrowserWindow, connection: Connection) {

  interface paymentConfig {
    currencies: Currency[];
    methods: PaymentMethod[];
    accounts: PaymentAccount[];
  }

  async function getPaymentConfig(): Promise<paymentConfig> {
    const currencies = await connection.getRepository(Currency).find();
    const methods = await connection.getRepository(PaymentMethod).find();
    const accounts = await connection.getRepository(PaymentAccount).find();
    return {
      currencies: currencies,
      methods: methods,
      accounts: accounts
    }
  }

  ipcMain.on('createPayment', (e, isReturn, rate) => {
    const newPaymentWin = new BrowserWindow({
      parent: win,
      modal: true,
      show: false,
      width: 400,
      height: 650,
      maximizable: false,
      minimizable: false,
      // maximizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, '../preload.js')
      },
    })
    newPaymentWin.loadURL(path.join(__dirname, "../../../src/renderer/payment/createPayment.html"));
    newPaymentWin.once('ready-to-show', async () => {
      newPaymentWin.show();
      const paymentConfig: paymentConfig = await getPaymentConfig();
      newPaymentWin.webContents.send('paymentConfig', paymentConfig);
      if (isReturn) newPaymentWin.webContents.send('isReturn');
    });
  })
  
  ipcMain.on('sendPaymentData', (event, paymentData) => {
    const paymentToPrint = paymentData;
    win.webContents.send('addPaymentToTree', paymentToPrint);
    event.sender.send('closeWindow');
  })
}