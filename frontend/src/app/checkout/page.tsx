"use client";
import React, { useState, useEffect } from "react";
import "./checkout.css";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/features/cartSlice";
import axios from "axios";
import Swal from "sweetalert2";
import CheckoutInfo from "./CheckoutInfo";
import CheckoutPayment from "./CheckoutPayment";
import CheckoutOrderSummary from "./OrderSummary";

const SHIPPING_FEE = 10000; //phí ship mặc định

interface UserInfo {
  username: string;
  [key: string]: any;
}

const CheckoutPage: React.FC = () => {
  const [fullName, setFullName] = useState(""); // fullName là username
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
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // Đăng nhập state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const dispatch = useDispatch();

  // Kiểm tra đăng nhập khi load trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const parsedUser: UserInfo = JSON.parse(user);
        setUserInfo(parsedUser);
        setFullName(parsedUser.username || "");
      } catch {
        setUserInfo(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
      setFullName("");
    }
  }, []);

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
    const newErrors: { [k: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0[0-9]{9,10})$/.test(phone.trim())) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!address.trim()) newErrors.address = "Vui lòng nhập địa chỉ chi tiết";
    if (!selectedCity) newErrors.city = "Vui lòng chọn tỉnh/thành phố";
    if (!selectedDistrict) newErrors.district = "Vui lòng chọn quận/huyện";
    if (!selectedWard) newErrors.ward = "Vui lòng chọn phường/xã";
    if (!payment) newErrors.payment = "Vui lòng chọn phương thức thanh toán";
    if (cartItems.length === 0) newErrors.cart = "Giỏ hàng trống!";
    return newErrors;
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

  // Hàm xử lý lưu đơn hàng về backend (CÓ GỬI TOKEN, dùng cho COD & thanh toán thường)
  const saveOrder = async () => {
    // Chuẩn bị data gửi backend
    const shippingInfo = {
      name: fullName, // username
      phone,
      address: `${address}, ${wards.find(w => w.Id === selectedWard)?.Name || ""}, ${districts.find(d => d.Id === selectedDistrict)?.Name || ""}, ${cities.find(c => c.Id === selectedCity)?.Name || ""}`,
      note,
      city: cities.find(c => c.Id === selectedCity)?.Name || "",
      district: districts.find(d => d.Id === selectedDistrict)?.Name || "",
      ward: wards.find(w => w.Id === selectedWard)?.Name || "",
    };
    const items = cartItems.map(item => ({
      productId: item.product._id,
      productName: item.product.name, //tên sản phẩm
      variant: item.selectedVariant ? item.selectedVariant.size : undefined,
      quantity: item.quantity,
      price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
      images: item.product.images,
    }));

    // LẤY TOKEN TỪ LOCALSTORAGE
    const token = localStorage.getItem("token");
    // Gửi API POST lên backend (có gửi token)
    const res = await axios.post("http://localhost:3000/orders", {
      items,
      shippingInfo,
      totalPrice: totalWithShipping,
      shippingFee: SHIPPING_FEE, //lấy phí ship
      paymentMethod: payment,
      coupon: coupon || undefined,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return res.data;
  };
  // Hàm gửi đơn hàng để lấy paymentUrl của MOMO (DÙNG CHO THANH TOÁN MOMO)
  // GHI CHÚ:
  // - Gọi API /payment/momo (backend bạn phải tạo route này)
  // - Gửi tổng tiền, orderId, orderInfo và token xác thực
  // - Nhận về paymentUrl, redirect sang trang thanh toán của MOMO
  const handleOnlineOrderMomo = async () => {

    const orderId = "order" + Date.now() + Math.floor(Math.random() * 1000000); // Luôn duy nhất!
    
    const shippingInfo = {
    name: fullName,
    phone,
    address: `${address}, ${wards.find(w => w.Id === selectedWard)?.Name || ""}, ${districts.find(d => d.Id === selectedDistrict)?.Name || ""}, ${cities.find(c => c.Id === selectedCity)?.Name || ""}`,
    note,
    city: cities.find(c => c.Id === selectedCity)?.Name || "",
    district: districts.find(d => d.Id === selectedDistrict)?.Name || "",
    ward: wards.find(w => w.Id === selectedWard)?.Name || "",
  };
  const items = cartItems.map(item => ({
    productId: item.product._id,
    productName: item.product.name,
    variant: item.selectedVariant ? item.selectedVariant.size : undefined,
    quantity: item.quantity,
    price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
    images: item.product.images,
  }));

    try {
      const res = await axios.post("http://localhost:3000/payment/momo", {
        amount: totalWithShipping,
        orderId, // Dùng biến này!
        orderInfo: "Thanh toán đơn hàng MimiBear",
        items,
        shippingInfo,
        coupon,
        shippingFee: SHIPPING_FEE, //phí ship
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      Swal.fire("Lỗi", "Không thể tạo thanh toán Momo!", "error");
    }
  };


  // --- HÀM GỬI ĐƠN HÀNG ĐỂ LẤY LINK THANH TOÁN VNPAY (THÊM MỚI) ---
  const handleOnlineOrderVnpay = async () => {
    const orderId = "order" + Date.now() + Math.floor(Math.random() * 1000000); // Luôn duy nhất
    const shippingInfo = {
      name: fullName,
      phone,
      address: `${address}, ${wards.find(w => w.Id === selectedWard)?.Name || ""}, ${districts.find(d => d.Id === selectedDistrict)?.Name || ""}, ${cities.find(c => c.Id === selectedCity)?.Name || ""}`,
      note,
      city: cities.find(c => c.Id === selectedCity)?.Name || "",
      district: districts.find(d => d.Id === selectedDistrict)?.Name || "",
      ward: wards.find(w => w.Id === selectedWard)?.Name || "",
    };
    const items = cartItems.map(item => ({
      productId: item.product._id,
      productName: item.product.name,
      variant: item.selectedVariant ? item.selectedVariant.size : undefined,
      quantity: item.quantity,
      price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
      image: item.product.images?.[0],
    }));

    try {
      const res = await axios.post("http://localhost:3000/payment/vnpay", {
        amount: totalWithShipping,
        orderId,
        orderInfo: "Thanh toán đơn hàng MimiBear qua VNPAY",
        items,
        shippingInfo,
        coupon,
        shippingFee: SHIPPING_FEE,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      Swal.fire("Lỗi", "Không thể tạo thanh toán VNPAY!", "error");
    }
  };





  // Khi bấm nút đăng nhập ở trang thanh toán
  const handleLoginRedirect = () => {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = "/login";
  };

  // Xử lý đặt hàng
  // - Nếu chọn COD thì giữ logic cũ
  // - Nếu chọn MOMO thì gọi handleOnlineOrderMomo()
  // - Nếu chọn các thanh toán thường khác thì vẫn gọi saveOrder()
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const check = validate();
    setErrors(check);

    if (Object.keys(check).length === 0) {
      if (payment === "cod") {
        // COD: xác nhận bằng SweetAlert như cũ
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
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await saveOrder();
              swalWithBootstrapButtons.fire({
                title: "Đặt hàng thành công!",
                text: "Cảm ơn bạn đã mua hàng.",
                icon: "success"
              }).then(() => {
                dispatch(clearCart());
                window.location.href = "/";
              });
            } catch (err) {
              swalWithBootstrapButtons.fire({
                title: "Lỗi!",
                text: "Đặt hàng thất bại, vui lòng thử lại.",
                icon: "error"
              });
            }
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
      } else if (payment === "momo") {
        // THANH TOÁN ONLINE MOMO: chuyển sang cổng thanh toán
        await handleOnlineOrderMomo();
      } else if(payment === "vnpay") {
        // thanh toán online VNPAY
        await handleOnlineOrderVnpay();
      } else {
        // Các phương thức khác (ví dụ: zalopay, thanh toán thông thường)
        try {
          await saveOrder();
          Swal.fire("Thanh toán thành công", "Cảm ơn bạn đã mua hàng!", "success").then(() => {
            dispatch(clearCart());
            window.location.href = "/";
          });
        } catch (err) {
          Swal.fire("Lỗi", "Thanh toán thất bại, vui lòng thử lại!", "error");
        }
      }
    } else {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng nhập đầy đủ thông tin bắt buộc!",
        icon: "error"
      });
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleOrder}>
        <div className="left">
          <CheckoutInfo
            isLoggedIn={isLoggedIn}
            userInfo={userInfo}
            fullName={fullName}
            setFullName={setFullName}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            note={note}
            setNote={setNote}
            cities={cities}
            districts={districts}
            wards={wards}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
            errors={errors}
            handleLoginRedirect={handleLoginRedirect}
          />
          <CheckoutPayment
            payment={payment}
            handlePaymentChange={handlePaymentChange}
            errors={errors}
          />
        </div>
      </form>
      <CheckoutOrderSummary
        cartItems={cartItems}
        coupon={coupon}
        setCoupon={setCoupon}
        total={total}
        SHIPPING_FEE={SHIPPING_FEE}
        totalWithShipping={totalWithShipping}
        handleOrder={handleOrder}
      />
    </div>
  );
};

export default CheckoutPage;