import "reflect-metadata";
import { Connection } from "typeorm";
import { Client } from "./entities/Client";
import { Currency } from "./entities/Currency";
import { Order } from "./entities/Order";
import { Payment } from "./entities/Payment";
import { PaymentMethod } from "./entities/PaymentMethod";
import { Product } from "./entities/Product";
import { Sale } from "./entities/Sale";
import { PaymentAccount } from "./entities/PaymentAccount";

// Create payment methods
const METHODS = [
  'Punto',
  'Pago móvil',
  'Transferencia',
  'Efectivo',
  'Zelle',
  'Paypal',
  'Binance'
]

const CURRENCIES = [
  ['Dólares', '$'],
  ['Bolívares', 'BSF' ]
]


export async function fillTestDatabase(connection: Connection) {

  const firstMethods = await connection.getRepository(PaymentMethod).find();
  if (firstMethods.length === 0) {

    let methods: PaymentMethod[] = [];
    METHODS.forEach(async methodName => {
      const method: PaymentMethod = await connection.getRepository(PaymentMethod).save({
        name: methodName}
      );
      methods.push(method);
    })
  
    let currencies: Currency[] = []; 
    CURRENCIES.forEach(async currencyList => {
      const currency: Currency = await connection.getRepository(Currency).save({
        name: currencyList[0], 
        symbol:currencyList[1]
      });
      currencies.push(currency);
    })
  
    const client = await connection.getRepository(Client).save({
      name: "Eduardo Kiriakos", 
      identityCard: "V-25899242",
      phoneNumber: "0424-816-7122"
    })
  
    const codo = await connection.getRepository(Product).save({
      name: "Codo de 1/2\"",
      price: 12.5,
      stock: 10,
      brand: "De la buena",
      reference: "Codo Media",
      code: 586147

    })
  
    const tubo = await connection.getRepository(Product).save({
      name: "Tubo de 1/2\"",
      price: 5.0,
      stock: 5,
      brand: "De la mala",
      reference: "Tubo Media",
      code: 699842
    })

    const account = await connection.getRepository(PaymentAccount).save({
      owner: "Eduardo Kiriakos",
      bank: "Mercantil"
    })
  }
}