export function AmountCalc(product: any) {
	product.amount = (product.price - (product.discountAmt || 0)) * +product.qty;
	return product;
}