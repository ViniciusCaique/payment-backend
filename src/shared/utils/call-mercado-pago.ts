import { randomUUID } from "node:crypto";
import { env } from "../config/env";
import { api } from "../lib/axios";

interface MercadoPagoRequest {
  value: number
}


export async function callMercadoPago({
  value
}: MercadoPagoRequest) {

  try {
    const items = [
      {
      id: randomUUID(),
      title: 'test',
      quantity: 1,
      unit_price: value
      }
    ]

    const { data } = await api.post('/checkout/preferences', {
      items
    },
    {
      headers: {
        'Authorization': `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`
      }
    }
  )

    return data

  } catch (error) {
    console.error('MercadoPago error:', error);
    throw error;
  }


}