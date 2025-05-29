"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dữ liệu mẫu
const lineData = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
  datasets: [
    {
      label: "Đơn hàng",
      data: [12, 19, 3, 5, 2, 3],
      borderColor: "#007bff",
      backgroundColor: "rgba(0,123,255,0.2)",
      tension: 0.4,
    },
  ],
};

const barData = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
  datasets: [
    {
      label: "Doanh thu (triệu)",
      data: [20, 35, 40, 55, 30, 60],
      backgroundColor: "#28a745",
    },
  ],
};

const orders = [
  { id: "AL3947", name: "Phạm Thị Ngọc", total: "19.770.000 đ", status: "Chờ xử lý", badge: "bg-info" },
  { id: "ER3835", name: "Nguyễn Thị Mỹ Yến", total: "16.770.000 đ", status: "Đang vận chuyển", badge: "bg-warning" },
  { id: "MD0837", name: "Triệu Thanh Phú", total: "9.400.000 đ", status: "Đã hoàn thành", badge: "bg-success" },
  { id: "MT9835", name: "Đặng Hoàng Phúc", total: "40.650.000 đ", status: "Đã hủy", badge: "bg-danger" },
];

const customers = [
  { id: "#183", name: "Hột vịt muối", dob: "21/7/1992", phone: "0921387221", tag: "tag-success" },
  { id: "#219", name: "Bánh tráng trộn", dob: "30/4/1975", phone: "0912376352", tag: "tag-warning" },
  { id: "#627", name: "Cút rang bơ", dob: "12/3/1999", phone: "01287326654", tag: "tag-primary" },
  { id: "#175", name: "Hủ tiếu nam vang", dob: "4/12/20000", phone: "0912376763", tag: "tag-danger" },
];

export default function Dashboard() {
  // State cho đồng hồ
  const [clock, setClock] = useState("");

  useEffect(() => {
    function updateClock() {
      const today = new Date();
      const weekday = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const day = weekday[today.getDay()];
      let dd: string | number = today.getDate();
      let mm: string | number = today.getMonth() + 1;
      const yyyy = today.getFullYear();
      let h: string | number = today.getHours();
      let m: string | number = today.getMinutes();
      let s: string | number = today.getSeconds();
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      dd = dd < 10 ? "0" + dd : dd;
      mm = mm < 10 ? "0" + mm : mm;
      const nowTime = `${h} giờ ${m} phút ${s} giây`;
      const dateStr = `${day}, ${dd}/${mm}/${yyyy}`;
      setClock(`${dateStr} - ${nowTime}`);
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Nếu muốn vẽ biểu đồ, dùng thư viện react-chartjs-2 hoặc tương tự

  return (
    <main className="app-content">
      <div className="row">
        <div className="col-md-12">
          <div className="app-title">
            <ul className="app-breadcrumb breadcrumb">
              <li className="breadcrumb-item"><a href="#"><b>Bảng điều khiển</b></a></li>
            </ul>
            <div id="clock">{clock}</div>
          </div>
        </div>
      </div>
      <div className="row">
        {/* Left */}
        <div className="col-md-12 col-lg-6">
          <div className="row">
            <div className="col-md-6">
              <div className="widget-small primary coloured-icon">
                <i className="icon bx bxs-user-account fa-3x"></i>
                <div className="info">
                  <h4>Tổng khách hàng</h4>
                  <p><b>56 khách hàng</b></p>
                  <p className="info-tong">Tổng số khách hàng được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small info coloured-icon">
                <i className="icon bx bxs-data fa-3x"></i>
                <div className="info">
                  <h4>Tổng sản phẩm</h4>
                  <p><b>1850 sản phẩm</b></p>
                  <p className="info-tong">Tổng số sản phẩm được quản lý.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small warning coloured-icon">
                <i className="icon bx bxs-shopping-bags fa-3x"></i>
                <div className="info">
                  <h4>Tổng đơn hàng</h4>
                  <p><b>247 đơn hàng</b></p>
                  <p className="info-tong">Tổng số hóa đơn bán hàng trong tháng.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="widget-small danger coloured-icon">
                <i className="icon bx bxs-error-alt fa-3x"></i>
                <div className="info">
                  <h4>Sắp hết hàng</h4>
                  <p><b>4 sản phẩm</b></p>
                  <p className="info-tong">Số sản phẩm cảnh báo hết cần nhập thêm.</p>
                </div>
              </div>
            </div>
            {/* Order Table */}
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Tình trạng đơn hàng</h3>
                <div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID đơn hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.name}</td>
                          <td>{order.total}</td>
                          <td><span className={`badge ${order.badge}`}>{order.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Customer Table */}
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Khách hàng mới</h3>
                <div>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên khách hàng</th>
                        <th>Ngày sinh</th>
                        <th>Số điện thoại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(c => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.name}</td>
                          <td>{c.dob}</td>
                          <td><span className={`tag ${c.tag}`}>{c.phone}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="col-md-12 col-lg-6">
          <div className="row">
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Dữ liệu 6 tháng đầu vào</h3>
                <div className="embed-responsive embed-responsive-16by9">
                  <Line data={lineData} />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="tile">
                <h3 className="tile-title">Thống kê 6 tháng doanh thu</h3>
                <div className="embed-responsive embed-responsive-16by9">
                  <Bar data={barData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center" style={{ fontSize: 13 }}>
        <p>
          <b>
            Copyright {new Date().getFullYear()} Phần mềm quản lý bán hàng | Dev By Trường
          </b>
        </p>
      </div>
    </main>
  );
}