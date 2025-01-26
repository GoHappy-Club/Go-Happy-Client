import type { OrderInterface } from 'react-native-paytring';
import appConfig from '../config/app.config';

export default class RestService {
  public constructor() {}

  /**
   * @name createOrder
   * @description Creates order for payment via react natvie sdk
   * @param order Order data for the processing of payment
   * @returns Order response
   */
  async createOrder(
    order: OrderInterface
  ): Promise<{ url: string; order_id: string } | undefined> {
    console.log(order);
    const createdOrder = await fetch(
      `${appConfig.backend.base_url}/v1/order/create`,
      {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { status, ...rest } = (await createdOrder.json()) as any;
    if (status) {
      console.log(rest);
      return rest;
    } else {
      return undefined;
    }
  }
}
