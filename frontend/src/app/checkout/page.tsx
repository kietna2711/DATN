"use client";
import React, { useState, useEffect } from "react";
import "./checkout.css";
import { useAppSelector } from "../store/store";
import axios from "axios";
import Swal from "sweetalert2";

const SHIPPING_FEE = 30000; // Phí vận chuyển

export const CheckoutPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("");
  const [coupon, setCoupon] = useState("");

  // Địa chỉ động
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Thông báo lỗi
  const [errors, setErrors] = useState<{[k: string]: string}>({});

  // Lấy data địa chỉ VN
  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Khi chọn tỉnh/thành phố
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      setSelectedDistrict("");
      setWards([]);
      setSelectedWard("");
      return;
    }
    const cityObj = cities.find((c) => c.Id === selectedCity);
    setDistricts(cityObj?.Districts || []);
    setSelectedDistrict("");
    setWards([]);
    setSelectedWard("");
  }, [selectedCity, cities]);

  // Khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard("");
      return;
    }
    const districtObj = districts.find((d) => d.Id === selectedDistrict);
    setWards(districtObj?.Wards || []);
    setSelectedWard("");
  }, [selectedDistrict, districts]);

  const cartItems = useAppSelector((state) => state.cart.items);

  const handlePaymentChange = (value: string) => {
    setPayment(value);
  };

  // Validate đơn hàng
  const validate = () => {
    const newErrors: {[k: string]: string} = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0[0-9]{9,10})$/.test(phone.trim())) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!address.trim()) newErrors.address = "Vui lòng nhập địa chỉ chi tiết";
    if (!selectedCity) newErrors.city = "Vui lòng chọn tỉnh/thành phố";
    if (!selectedDistrict) newErrors.district = "Vui lòng chọn quận/huyện";
    if (!selectedWard) newErrors.ward = "Vui lòng chọn phường/xã";
    if (!payment) newErrors.payment = "Vui lòng chọn phương thức thanh toán";
    return newErrors;
  };

  // Xử lý đặt hàng
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const check = validate();
    setErrors(check);

    if (Object.keys(check).length === 0) {
      // Nếu chọn COD thì dùng SweetAlert2 xác nhận
      if (payment === "cod") {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
          },
          buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
          title: "Bạn xác nhận đặt hàng?",
          text: "Bạn chắc chắn muốn đặt đơn hàng này?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Xác nhận đặt hàng",
          cancelButtonText: "Hủy",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
              title: "Đặt hàng thành công!",
              text: "Cảm ơn bạn đã mua hàng.",
              icon: "success"
            });
            // Thực hiện đặt hàng thật sự ở đây nếu muốn
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: "Đã hủy!",
              text: "Đơn hàng đã bị hủy.",
              icon: "error"
            });
          }
        });
      } else {
        // Các phương thức thanh toán khác
        Swal.fire("Đặt hàng thành công", "Cảm ơn bạn đã mua hàng!", "success");
        // Thực hiện đặt hàng thật sự ở đây nếu muốn
      }
    } else {
      // Thông báo lỗi tổng thể
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng nhập đầy đủ thông tin bắt buộc!",
        icon: "error"
      });
    }
  };

  // TÍNH TỔNG TIỀN
  const total = cartItems.reduce(
    (sum, item) => {
      const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      return sum + price * item.quantity;
    },
    0
  );
  const totalWithShipping = total + SHIPPING_FEE;

  return (
    <div className="container">
      <form onSubmit={handleOrder}>
      {/* Left: Info + Shipping + Payment */}
      <div className="left">
        <div className="column">
          <div className="log">
            <h3>Thông tin nhận hàng</h3>
            <div className="log-dn">
              <a href="#">
                <img src="http://localhost:3000/images/icon-dn.png" alt="" />
              </a>
              <a href="#">
                <button type="button">Đăng nhập</button>
              </a>
            </div>
          </div>
          {errors.fullName && <div className="error">{errors.fullName}</div>} {/* thông báo */}
          <input
            type="text"
            placeholder="Họ và tên"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />       
          {errors.phone && <div className="error">{errors.phone}</div>}
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          {errors.address && <div className="error">{errors.address}</div>}
          <input
            type="text"
            placeholder="Địa chỉ (số nhà, tên đường...)"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <div className="form-group">
            {errors.city && <div className="error">{errors.city}</div>}
            <select
              className="form-control"
              id="city"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              <option value="">Chọn Tỉnh/Thành</option>
              {cities.map(city => (
                <option key={city.Id} value={city.Id}>{city.Name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            {errors.district && <div className="error">{errors.district}</div>}
            <select
              className="form-control"
              id="district"
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              disabled={!selectedCity}
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map(district => (
                <option key={district.Id} value={district.Id}>{district.Name}</option>
              ))}
            </select>
            
          </div>
          <div className="form-group">
            {errors.ward && <div className="error">{errors.ward}</div>}
            <select
              className="form-control"
              id="ward"
              value={selectedWard}
              onChange={e => setSelectedWard(e.target.value)}
              disabled={!selectedDistrict}
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map(ward => (
                <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Ghi chú (tùy chọn)"
            rows={4}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <div className="column">
          <h3>Vận chuyển</h3>
          <input
            className="nhaptt"
            value="Vui lòng nhập thông tin giao hàng"
            readOnly
          />
          <h4>Thanh toán</h4>
          {errors.payment && <div className="error">{errors.payment}</div>}
          <br />
          <div
            className="payment-method"
            onClick={() => handlePaymentChange("cod")}
          >
            <input
              type="radio"
              name="pay"
              checked={payment === "cod"}
              onChange={() => handlePaymentChange("cod")}
            />
            <label>Thanh toán khi giao hàng</label>
            <div className="cod">
              <img 
                src="http://localhost:3000/images/icon-tien.png"
                alt="cod"
                style={{ filter: "invert(71%) sepia(94%) saturate(600%) hue-rotate(85deg) brightness(90%) contrast(90%)" }} 
              />
            </div>
          </div>
          <div
            className="payment-method"
            onClick={() => handlePaymentChange("zalopay")}
          >
            <input
              type="radio"
              name="pay"
              checked={payment === "zalopay"}
              onChange={() => handlePaymentChange("zalopay")}
            />
            <label>Thanh toán qua ZaloPay</label>
            <div className="cod">
              <img
                src="http://localhost:3000/images/zalopay.png"
                alt="ZaloPay"
                style={{ width: 65 }}
              />
            </div>
          </div>
          <div
            className="payment-method"
            onClick={() => handlePaymentChange("vnpay")}
          >
            <input
              type="radio"
              name="pay"
              checked={payment === "vnpay"}
              onChange={() => handlePaymentChange("vnpay")}
            />
            <label>Thanh toán qua VnPay</label>
            <div className="cod">
              <img
                src="http://localhost:3000/images/vnpay.png"
                alt="VnPay"
                style={{ width: 85 }}
              />
            </div>
          </div>
          <div
            className="payment-method"
            onClick={() => handlePaymentChange("momo")}
          >
            <input
              type="radio"
              name="pay"
              checked={payment === "momo"}
              onChange={() => handlePaymentChange("momo")}
            />
            <label>Thanh toán qua Momo</label>
            <div className="cod">
              <img
                src="http://localhost:3000/images/momo.png"
                alt="Momo"
                style={{ width: 35, height: 35 }}
              />
            </div>
          </div>
        </div>
      </div>
      </form>
      
      {/* Right: Order summary */}
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
                <span className="siso"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -12
                  }}>{item.quantity}</span>
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
            <button className="back" type="button" onClick={() => window.history.back()}>◀ Quay về giỏ hàng</button>
            <button className="submit" type="submit">ĐẶT HÀNG</button>
          </div>
        </div>
        </form>
      </div>
      
    </div>
  );
};

export default CheckoutPage;