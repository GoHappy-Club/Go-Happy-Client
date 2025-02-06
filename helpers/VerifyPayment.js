export const verifyPayment = async (orderId) => {
  try {
    const response = await axios.post(`${SERVER_URL}/paytring/verify`, {
      id: orderId,
    });
    const data = await response.data;
    return data;
  } catch (error) {
    console.log("Error in verifyPayment", error);
    crashlytics().recordError(error);
  }
};
