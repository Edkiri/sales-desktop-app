import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { app, BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";
import { fillTestDatabase } from "../database/dbFiller";
import { addClientEvents } from "./ipcMainEvents/clientEvents";
import { addOrderEvents } from "./ipcMainEvents/orderEvents";
import { addPaymentEvents } from "./ipcMainEvents/paymentEvents";
import { addSaleEvents } from "./ipcMainEvents/saleEvents";
import { Payment } from "../database/entities/Payment";
import { Sale } from "../database/entities/Sale";
import { Order } from "../database/entities/Order";
import * as dayjs from "dayjs";

let win: BrowserWindow;
let connection: Connection;
createConnection()
  .then((conn: Connection) => {

    connection = conn;
    fillTestDatabase(connection);
    addClientEvents(win, connection);
    addOrderEvents(win, connection);
    addPaymentEvents(win, connection);
    addSaleEvents(win, connection);

  }).catch(error => console.error(error));

  const createMainWindow = () => {
    win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
      },
      show: false
    });
    win.loadURL(path.join(__dirname, "../../src/main/index.html"));
    
    
    win.once('ready-to-show', () => {
      win.maximize();
      win.show();
      win.webContents.openDevTools();
    });
  };
  
  
  app.whenReady().then(() => {
    createMainWindow()
    
    app.on('activate', () => {
      if(BrowserWindow.getAllWindows().length === 0) createMainWindow()
    });
  });
  
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
      connection.close();
    }
  });

export let DAILY_RATE: number; // It is assumed that is constant for the day, but user can change it.
ipcMain.on("setDailyRate", (event, dailyRate) => {
  if (dailyRate) {
    DAILY_RATE = dailyRate;
    event.sender.send('rateValue', DAILY_RATE);
  }
})


interface Summary {
  bs: number;
  usd: number;
  total: number;
}
interface SummaryData {
  summaryDay: Summary;
  summaryWeek: Summary;
  summaryMonth: Summary;
}

ipcMain.on("getSummaryDayData", async (e, date: Date) => {
  const summaryData: SummaryData = await getSummaryData(date);
  e.sender.send("summaryData", summaryData);
})

async function getSummaryData(date: Date): Promise<SummaryData> {
  const summaryDay: Summary = await getDaylySummary(date);
  const summaryWeek: Summary = await getWeekSummary(date);
  const summaryMonth: Summary = await getMonthlySummary(date);
  return {
    summaryDay,
    summaryWeek,
    summaryMonth
  }
}

async function getMonthlySummary(date: Date): Promise<Summary> {
  const monthDay: string = dayjs(date).toISOString();
  const firstMonthDay: string = dayjs(date).startOf('month').toISOString();
  const monthlyPayments: Payment[] = await connection.getRepository(Payment)
    .createQueryBuilder("payment")
    .leftJoinAndSelect("payment.currency", "currency")
    .andWhere("payment.date >= :before", {before: firstMonthDay})
    .andWhere("payment.date <= :after", {after: monthDay})
    .getMany()
  const monthlySummary: Summary = getSummary(monthlyPayments);
  return monthlySummary;
}

async function getWeekSummary(date: Date): Promise<Summary> {
  const weekDay: string = dayjs(date).toISOString();
  const mondayWeekDay: string = dayjs(date).startOf('week').toISOString();
  const weeklyPayments: Payment[] = await connection.getRepository(Payment)
    .createQueryBuilder("payment")
    .leftJoinAndSelect("payment.currency", "currency")
    .andWhere("payment.date >= :before", {before: mondayWeekDay})
    .andWhere("payment.date <= :after", {after: weekDay})
    .getMany()
  const weeklySummary: Summary = getSummary(weeklyPayments);
  return weeklySummary;
}

async function getDaylySummary(date: Date): Promise<Summary> {
  const targetDate: string = dayjs(date).toISOString();
  const daylyPayments: Payment[] = await connection.getRepository(Payment)
    .createQueryBuilder("payment")
    .leftJoinAndSelect("payment.currency", "currency")
    .where("payment.date = :date", { date: targetDate})
    .getMany();
  const daylySummary: Summary = getSummary(daylyPayments);
  return daylySummary;
}

function getSummary(payments: Payment[]): Summary {
  const summary: Summary = {
    bs: 0,
    usd: 0,
    total: 0
  };
  for(const payment of payments) {
    if(payment.currency.id == 1) {
      summary.usd += payment.amount;
      summary.total += payment.amount;
    } else {
      summary.bs += payment.amount;
      summary.total += payment.amount / payment.rate;
    }
  }
  return summary;
}

ipcMain.on("deleteSale", async (event, saleId) => {
  try {
    await connection.createQueryBuilder()
      .delete()
      .from(Sale)
      .where("id = :id", {id: saleId})
      .execute();
    await connection.createQueryBuilder()
      .delete()
      .from(Payment)
      .where("sale = :saleId", {saleId: saleId})
      .execute();
    await connection.createQueryBuilder()
      .delete()
      .from(Order)
      .where("sale = :saleId", {saleId: saleId})
      .execute();
    event.sender.send("saleDeleted", saleId);
  } catch (err) {
    console.error("Error borrando la venta.");
    console.error(err);
  }
})