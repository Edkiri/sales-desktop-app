import { Connection } from "typeorm";
import { BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";
import { DAILY_RATE } from "../main";
import { SaleMainListRow, getDailySales } from "./SaleParser";
import { Sale } from "../../database/entities/Sale";
import { Client } from "../../database/entities/Client";
import { Payment } from "../../database/entities/Payment"; 
import { Currency } from "../../database/entities/Currency";
import { PaymentMethod } from "../../database/entities/PaymentMethod";
import { PaymentAccount } from "../../database/entities/PaymentAccount";
import { Order } from "../../database/entities/Order";
import { Product } from "../../database/entities/Product";


export function addSaleEvents(win: BrowserWindow, connection: Connection): void {

  ipcMain.on('getDailySales', async (event, date: Date) => {
    const salesToPrint: SaleMainListRow[] = await getDailySales(connection, date)
    event.sender.send('printSales', salesToPrint);
  });
  
  ipcMain.on('createSale', (event) => {
    win.loadURL(path.join(__dirname, "../../../src/renderer/sale/createSale.html"));
  })
  
  ipcMain.on("getDailyRate", e => {
    if (DAILY_RATE) e.sender.send('rateValue', DAILY_RATE);
  })
  
  ipcMain.on("sendNewSaleData", async (event, newSaleData) => {
    try {
      const client = await connection.getRepository(Client)
        .findOne(newSaleData.clientId);
      const sale = await connection.getRepository(Sale).save({
        client: client,
        date: new Date(),
        description: newSaleData.description,
        isFinished: newSaleData.totalPayments == newSaleData.totalOrders
      })
      
      const paymentRepo = connection.getRepository(Payment);
      const currencyRepo = connection.getRepository(Currency);
      const methodRepo = connection.getRepository(PaymentMethod);
      const accountRepo = connection.getRepository(PaymentAccount);
      for(const paymentData of newSaleData.payments) {
        try {
          const currency = await currencyRepo.findOne(paymentData.currency.id);
          const method = await methodRepo.findOne(paymentData.method.id);
          const account = await accountRepo.findOne(paymentData.accountId);
          paymentRepo.save({
            date: new Date,
            sale: sale,
            amount: paymentData.amount,
            currency: currency,
            method: method,
            account: account,
            rate: DAILY_RATE
          })
        } catch(err) {
          console.error("Error creardo el pago");
          throw err;
        }
      }
      const orderRepo = connection.getRepository(Order);
      const productRepo = connection.getRepository(Product);
      for(const orderData of newSaleData.orders) {
        try {
          const product = await productRepo.findOne(orderData.productId);
          orderRepo.save({
            sale: sale,
            product: product,
            amount: <number>orderData.amount,
            date: new Date,
            price: <number>parseFloat(orderData.total)
          })
        } catch(err) {
          console.log("Error creando la orden");
          throw err;
        }
      }
      win.loadURL(path.join(__dirname, "../../../src/main/index.html"));
    } catch(err) {
      console.error("Error creando la venta -", err);
    }
  })
}