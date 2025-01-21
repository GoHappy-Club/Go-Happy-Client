import type { OrderInterface } from 'react-native-paytring';
export default class RestService {
    constructor();
    /**
     * @name createOrder
     * @description Creates order for payment via react natvie sdk
     * @param order Order data for the processing of payment
     * @returns Order response
     */
    createOrder(order: OrderInterface): Promise<{
        url: string;
        order_id: string;
    } | undefined>;
}
//# sourceMappingURL=rest.service.d.ts.map