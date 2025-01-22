export const verifyPayment = async (orderId) => {
  const response = await axios.post(`${SERVER_URL}/paytring/verify`, {
    id: orderId,
  });
  const data = await response.data;
  return data;
};
