"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _app = _interopRequireDefault(require("../config/app.config"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class RestService {
  constructor() {}

  /**
   * @name createOrder
   * @description Creates order for payment via react natvie sdk
   * @param order Order data for the processing of payment
   * @returns Order response
   */
  async createOrder(order) {
    console.log(order);
    const createdOrder = await fetch(`${_app.default.backend.base_url}/v1/order/create`, {
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
exports.default = RestService;
//# sourceMappingURL=rest.service.js.map