import { Connection } from "typeorm";
import { Sale } from "../../database/entities/Sale";
import * as dayjs from "dayjs";

export interface SaleMainListRow {
  id: number,
  state: string,
  description: string,
  totalSale: number
}

function parseSales(sales: Sale[]): SaleMainListRow[] {
  let salesToPrint: SaleMainListRow[] = [];

  sales.forEach(sale => {
    let totalPayments: number = 0;
    sale.payments.forEach(pay => {
      if(pay.currency.id != 1) {
        const totalPay = pay.amount / pay.rate;
        totalPayments += totalPay;
      } else {
        totalPayments += pay.amount;
      }
    })
    const totalOrders: number = sale.orders.reduce(
      (ac: number, order) => ac + (<number>order.price * <number>order.amount), 0
    );
    let totalToPrint = totalOrders;
    const totalSale = totalOrders - totalPayments;
    let state: string = "Finalizada";
    if(totalSale < 0) {
      state = "Vale";
      totalToPrint = Math.abs(totalSale);
    } else if (totalSale > 0) {
      state = "Crédito";
      totalToPrint = Math.abs(totalSale);
    }
    const saleToPrint = {
      id: sale.id,
      state: state,
      description: sale.description,
      totalSale: totalToPrint
    };

    salesToPrint.push(saleToPrint);
  })
  return salesToPrint;
}

export async function getDailySales (connection: Connection, date: Date): Promise<SaleMainListRow[]> {
  const targetDate = dayjs(date).toISOString();
  const todaySales: Sale[] = await connection.getRepository(Sale)
    .createQueryBuilder("sale")
    .leftJoinAndSelect("sale.payments", "payments")
    .leftJoinAndSelect("sale.orders", "orders")
    .leftJoinAndSelect("payments.currency", "currency")
    .where("sale.date = :date", { date: targetDate})
    .getMany();

  const salesToPrint = parseSales(todaySales);
  return salesToPrint;
}