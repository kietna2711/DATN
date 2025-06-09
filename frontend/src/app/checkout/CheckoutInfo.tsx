// Component: CheckoutInfo
// Chức năng: Hiển thị cột "Thông tin nhận hàng" bên trái của trang thanh toán (checkout).
// - Nếu chưa đăng nhập thì hiện nút "Đăng nhập".
// - Nếu đã đăng nhập sẽ tự điền trường "Họ và tên" bằng username đã đăng nhập (readOnly, không sửa được).
// - Các input nhập số điện thoại, địa chỉ, ghi chú, và chọn tỉnh/thành, quận/huyện, phường/xã.
// - Hiển thị lỗi (nếu có) cho từng trường.
// - Các props truyền vào từ CheckoutPage để điều khiển dữ liệu và state.
//
// Props:
// - isLoggedIn: boolean - trạng thái đăng nhập
// - userInfo: thông tin user từ localStorage (cần có username để điền vào ô "Họ và tên")
// - fullName: giá trị trường "Họ và tên" (ở đây là username)
// - setFullName: hàm set giá trị "Họ và tên"
// - phone, setPhone: giá trị và hàm set số điện thoại
// - address, setAddress: giá trị và hàm set địa chỉ chi tiết
// - note, setNote: giá trị và hàm set ghi chú
// - cities, districts, wards: danh sách tỉnh/thành, quận/huyện, phường/xã
// - selectedCity, setSelectedCity: tỉnh/thành phố được chọn
// - selectedDistrict, setSelectedDistrict: quận/huyện được chọn
// - selectedWard, setSelectedWard: phường/xã được chọn
// - errors: object chứa lỗi của từng trường (nếu có)
// - handleLoginRedirect: hàm chuyển hướng sang trang đăng nhập

import React from "react";

interface Props {
  isLoggedIn: boolean;
  userInfo: any;
  fullName: string;
  setFullName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  cities: any[];
  districts: any[];
  wards: any[];
  selectedCity: string;
  setSelectedCity: (v: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (v: string) => void;
  selectedWard: string;
  setSelectedWard: (v: string) => void;
  errors: { [k: string]: string };
  handleLoginRedirect: () => void;
}

const CheckoutInfo: React.FC<Props> = ({
  isLoggedIn,
  userInfo,
  fullName,
  setFullName,
  phone,
  setPhone,
  address,
  setAddress,
  note,
  setNote,
  cities,
  districts,
  wards,
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
  selectedWard,
  setSelectedWard,
  errors,
  handleLoginRedirect,
}) => (
  <div className="column">
    <div className="log">
      <h3>Thông tin nhận hàng</h3>
      {!isLoggedIn && (
        <div className="log-dn">
          <a href="#" tabIndex={-1}>
            <img src="http://localhost:3000/images/icon-dn.png" alt="" />
          </a>
          <button type="button" onClick={handleLoginRedirect}>
            Đăng nhập
          </button>
        </div>
      )}
    </div>
    {errors.fullName && <div className="error">{errors.fullName}</div>}
    <input
      type="text"
      placeholder="Họ và tên"
      value={fullName}
      onChange={e => setFullName(e.target.value)}
      readOnly={!!isLoggedIn && !!userInfo?.username}
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
          <option key={city.Id} value={city.Id}>
            {city.Name}
          </option>
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
          <option key={district.Id} value={district.Id}>
            {district.Name}
          </option>
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
          <option key={ward.Id} value={ward.Id}>
            {ward.Name}
          </option>
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
);

export default CheckoutInfo;