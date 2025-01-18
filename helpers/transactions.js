export const getDiscountValue = (selectedVoucher, event) => {
  if (!selectedVoucher) return 0;
  const { value, percent, limit } = selectedVoucher;
  if (value) {
    return value;
  }
  if (percent) {
    let discount = (event.cost * percent) / 100;
    return limit ? Math.min(discount, limit) : discount;
  }
  return 0;
};
