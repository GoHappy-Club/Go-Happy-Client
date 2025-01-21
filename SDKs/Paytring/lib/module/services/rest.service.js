import appConfig from '../config/app.config';
export default class RestService {
  constructor() {}

  /**
   * @name createOrder
   * @description Creates order for payment via react natvie sdk
   * @param order Order data for the processing of payment
   * @returns Order response
   */
  async createOrder(order) {
    console.log(order);
    const createdOrder = await fetch(`${appConfig.backend.base_url}/v1/order/create`, {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const {
      status,
      ...rest
    } = await createdOrder.json();
    if (status) {
      return rest;
    } else {
      return undefined;
    }
  }
}
//# sourceMappingURL=rest.service.js.map