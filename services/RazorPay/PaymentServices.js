export async function getOrderId(amount) {
  var url = SERVER_URL + "/razorPay/pay";
  try {
    const response = await axios.post(url, { amount: amount });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    this.error = true;
    // throw new Error("Error getting order ID");
  }
}
