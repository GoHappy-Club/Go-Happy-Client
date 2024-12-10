export async function getPayload(
  phone,
  amount,
  paymentType,
  orderId=null,
  tambolaTicket=null,
  membershipId,
  coinsToGive = null,
) {
  var url = SERVER_URL + "/phonePe/generatePayload";
  try {
    const response = await axios.post(url, {
      phone: phone,
      amount: amount,
      paymentType: paymentType,
      orderId: orderId,
      tambolaTicket: tambolaTicket,
      membershipId: membershipId,
      coinsToGive: coinsToGive,
    });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    this.error = true;
    // throw new Error("Error getting order ID");
  }
}
