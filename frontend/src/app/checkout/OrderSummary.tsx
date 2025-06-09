// Component: CheckoutOrderSummary
// Chức năng: Hiển thị cột phải (tóm tắt đơn hàng) của trang checkout.
// - Liệt kê các sản phẩm trong giỏ hàng, số lượng, giá, size (nếu có).
// - Nhập mã giảm giá.
// - Hiển thị tạm tính, phí vận chuyển, tổng cộng.
// - Nút quay về giỏ hàng và nút đặt hàng.
// - Nhận props từ CheckoutPage để xử lý logic và cập nhật state.
//
// Props:
// - cartItems: mảng sản phẩm trong giỏ hàng
// - coupon: mã giảm giá
// - setCoupon: hàm cập nhật coupon
// - total: tổng tiền hàng
// - SHIPPING_FEE: phí ship (hằng số)
// - totalWithShipping: tổng cộng (tiền hàng + ship)
// - handleOrder: hàm submit đặt hàng

import React from "react";

interface Props {
  cartItems: any[];
  coupon: string;
  setCoupon: (v: string) => void;
  total: number;
  SHIPPING_FEE: number;
  totalWithShipping: number;
  handleOrder: (e: React.FormEvent) => void;
}

const CheckoutOrderSummary: React.FC<Props> = ({
  cartItems,
  coupon,
  setCoupon,
  total,
  SHIPPING_FEE,
  totalWithShipping,
  handleOrder,
}) => (
  <div className="right">
    <form onSubmit={handleOrder}>
      <h3>Đơn hàng ({cartItems.length} sản phẩm)</h3>
      <div className="order-summary">
        {cartItems.map((item, idx) => (
          <div className="spTT" key={item.product._id + (item.selectedVariant?.size || '') + idx}>
            <div className="soSP" style={{ position: "relative" }}>
              <img
                className="anhGH"
                src={`http://localhost:3000/images/${item.product.images[0]}`}
                alt={item.product.name}
              />
              <span
                className="siso"
                style={{
                  position: "absolute",
                  top: -6,
                  right: -12
                }}>
                {item.quantity}
              </span>
            </div>
            <span>
              {item.product.name}
              {item.selectedVariant?.size ? ` - Size: ${item.selectedVariant.size}` : ""}
            </span>
            <p>
              {((item.selectedVariant ? item.selectedVariant.price : item.product.price) * item.quantity).toLocaleString('vi-VN')} ₫
            </p>
          </div>
        ))}
        <div className="saleTT">
          <input
            type="text"
            placeholder="Nhập mã giảm giá"
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
          />
          <button type="button">ÁP DỤNG</button>
        </div>
        <div className="tinhTien">
          <div className="tTien">
            <p>Tạm tính</p>
            <p>{total.toLocaleString('vi-VN')} ₫</p>
          </div>
          <div className="tTien">
            <p>Phí vận chuyển</p>
            <span>{SHIPPING_FEE.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
        <div className="total">
          <p>Tổng cộng</p>
          <span>{totalWithShipping.toLocaleString('vi-VN')} ₫</span>
        </div>
        <div className="actions">
          <button className="back" type="button" onClick={() => window.history.back()}>
            ◀ Quay về giỏ hàng
          </button>
          <button className="submit" type="submit">
            ĐẶT HÀNG
          </button>
        </div>
      </div>
    </form>
  </div>
);

export default CheckoutOrderSummary;