import { env } from "../config/env";
import { api } from "../lib/axios";




export async function callMercadoPago() {

  try {
    const items = [
      {
      id: 'test',
      title: 'test',
      quantity: 1,
      unit_price: 50.00
      }
    ]
    console.log(items, 'payload')
    console.log(env.MERCADO_PAGO_ACCESS_TOKEN, 'test')

    const { data } = await api.post('/checkout/preferences', {
      items
    },
    {
      headers: {
        'Authorization': `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`
      }
    }
  )

    console.log(data, `response`)

    return data

  } catch (error) {
    console.error('MercadoPago error:', error);
    throw error;
  }


}