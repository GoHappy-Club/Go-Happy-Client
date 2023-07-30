import { getOrderId } from "../../services/RazorPay/PaymentServices";
import RazorpayCheckout from "react-native-razorpay";

export const PaymentConstants = {
  // razorPayKey: "rzp_test_6j26r9Y9hFXUWl",
  razorPayKey: "rzp_live_Gnecc7OCz1jsxK",
  emailId: "contributions@gohappyclub.co.in",
};

export const PaymentError = {
  message: "Your payment could not be processed. Please try again later.",
};

export async function razorPay(
  item,
  amount,
  prefill,
  description,
  _callback,
  _errorHandler
) {
  var cost = amount;
  var orderId = await getOrderId(cost * 100);
  var options = {
    description: description,
    currency: "INR",
    key: PaymentConstants.razorPayKey,
    amount: cost * 100, // in paisa
    name: description,
    readonly: { email: true },
    order_id: orderId, //Replace this with an order_id created using Orders API.
    prefill: prefill,
    theme: { color: "#53a20e" },
    notes: {
      name: prefill.name,
      contact: prefill.contact,
      email: prefill.email,
    },
  };
  //console.log("options", options, orderId);
  var _this = this;
  RazorpayCheckout.open(options)
    .then((data) => {
      _callback(data);
    })
    .catch((error) => {
      _errorHandler(error);
    });
}
