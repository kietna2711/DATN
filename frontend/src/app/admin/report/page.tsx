"use client";
import React from "react";
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
// Nếu muốn dùng biểu đồ, cài thêm react-chartjs-2 và chart.js

const bestSellers = [
  { id: "71309005", name: "Bàn ăn gỗ Theresa", price: "5.600.000 đ", category: "Bàn ăn" },
  { id: "62304003", name: "Bàn ăn Vitali mặt đá", price: "33.235.000 đ", category: "Bàn ăn" },
  { id: "72109004", name: "Ghế làm việc Zuno", price: "3.800.000 đ", category: "Ghế gỗ" },
  { id: "83826226", name: "Tủ ly - tủ bát", price: "2.450.000 đ", category: "Tủ" },
  { id: "71304041", name: "Bàn ăn mở rộng Vegas", price: "21.550.000 đ", category: "Bàn thông minh" },
];

const orders = [
  { id: "MD0837", customer: "Triệu Thanh Phú", products: "Ghế làm việc Zuno, Bàn ăn gỗ Theresa", quantity: "2 sản phẩm", total: "9.400.000 đ" },
  { id: "MĐ8265", customer: "Nguyễn Thị Ngọc Cẩm", products: "Ghế ăn gỗ Lucy màu trắng", quantity: "1 sản phẩm", total: "3.800.000 đ" },
  { id: "MT9835", customer: "Đặng Hoàng Phúc", products: "Giường ngủ Jimmy, Bàn ăn mở rộng cao cấp Dolas, Ghế làm việc Zuno", quantity: "3 sản phẩm", total: "40.650.000 đ" },
  { id: "ER3835", customer: "Nguyễn Thị Mỹ Yến", products: "Bàn ăn mở rộng Gepa", quantity: "1 sản phẩm", total: "16.770.000 đ" },
  { id: "AL3947", customer: "Phạm Thị Ngọc", products: "Bàn ăn Vitali mặt đá, Ghế ăn gỗ Lucy màu trắng", quantity: "2 sản phẩm", total: "19.770.000 đ" },
  { id: "QY8723", customer: "Ngô Thái An", products: "Giường ngủ Kara 1.6x2m", quantity: "1 sản phẩm", total: "14.500.000 đ" },
];

const outOfStockProducts = [
  {
    id: "83826226",
    name: "Tủ ly - tủ bát",
    img: "/img-sanpham/tu.jpg",
    quantity: 0,
    status: "Hết hàng",
    price: "2.450.000 đ",
    category: "Tủ",
  },
];

const newEmployees = [
  {
    name: "Hồ Thị Thanh Ngân",
    address: "155-157 Trần Quốc Thảo, Quận 3, Hồ Chí Minh",
    dob: "12/02/1999",
    gender: "Nữ",
    phone: "0926737168",
    position: "Bán hàng",
  },
  {
    name: "Trần Khả Ái",
    address: "6 Nguyễn Lương Bằng, Tân Phú, Quận 7, Hồ Chí Minh",
    dob: "22/12/1999",
    gender: "Nữ",
    phone: "0931342432",
    position: "Bán hàng",
  },
  {
    name: "Nguyễn Đặng Trọng Nhân",
    address: "59C Nguyễn Đình Chiểu, Quận 3, Hồ Chí Minh",
    dob: "23/07/1996",
    gender: "Nam",
    phone: "0846881155",
    position: "Dịch vụ",
  },
];

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

export default function ReportManagement() {
  return (
    <main className="app-content">
      <div className="row">
        <div className="col-md-12">
          <div className="app-title">
            <ul className="app-breadcrumb breadcrumb">
              <li className="breadcrumb-item"><b>Báo cáo doanh thu</b></li>
            </ul>
            <div id="clock"></div>
          </div>
        </div>
      </div>
      {/* Widgets */}
      <div className="row">
        <div className="col-md-6 col-lg-3">
          <div className="widget-small primary coloured-icon">
            <i className="icon bx bxs-user fa-3x"></i>
            <div className="info">
              <h4>Tổng Nhân viên</h4>
              <p><b>26 nhân viên</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="widget-small info coloured-icon">
            <i className="icon bx bxs-purchase-tag-alt fa-3x"></i>
            <div className="info">
              <h4>Tổng sản phẩm</h4>
              <p><b>8580 sản phẩm</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="widget-small warning coloured-icon">
            <i className="icon fa-3x bx bxs-shopping-bag-alt"></i>
            <div className="info">
              <h4>Tổng đơn hàng</h4>
              <p><b>457 đơn hàng</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="widget-small danger coloured-icon">
            <i className="icon fa-3x bx bxs-info-circle"></i>
            <div className="info">
              <h4>Bị cấm</h4>
              <p><b>4 nhân viên</b></p>
            </div>
          </div>
        </div>
      </div>
      {/* More widgets */}
      <div className="row">
        <div className="col-md-6 col-lg-3">
          <div className="widget-small primary coloured-icon">
            <i className="icon fa-3x bx bxs-chart"></i>
            <div className="info">
              <h4>Tổng thu nhập</h4>
              <p><b>104.890.000 đ</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="widget-small info coloured-icon">
            <i className="icon fa-3x bx bxs-user-badge"></i>
            <div className="info">
              <h4>Nhân viên mới</h4>
              <p><b>3 nhân viên</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="widget-small warning coloured-icon">
            <i className="icon fa-3x bx bxs-tag-x"></i>
            <div className="info">
              <h4>Hết hàng</h4>
              <p><b>1 sản phẩm</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="widget-small danger coloured-icon">
            <i className="icon fa-3x bx bxs-receipt"></i>
            <div className="info">
              <h4>Đơn hàng hủy</h4>
              <p><b>2 đơn hàng</b></p>
            </div>
          </div>
        </div>
      </div>
      {/* Best sellers */}
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">SẢN PHẨM BÁN CHẠY</h3>
            <div className="tile-body">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá tiền</th>
                    <th>Danh mục</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Orders */}
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">TỔNG ĐƠN HÀNG</h3>
            <div className="tile-body">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th>ID đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Đơn hàng</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.products}</td>
                      <td>{order.quantity}</td>
                      <td>{order.total}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={4}>Tổng cộng:</th>
                    <td>104.890.000 đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Out of stock */}
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">SẢN PHẨM ĐÃ HẾT</h3>
            <div className="tile-body">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Ảnh</th>
                    <th>Số lượng</th>
                    <th>Tình trạng</th>
                    <th>Giá tiền</th>
                    <th>Danh mục</th>
                  </tr>
                </thead>
                <tbody>
                  {outOfStockProducts.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>
                        <img src={item.img} alt={item.name} width="100px" />
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        <span className="badge bg-danger">{item.status}</span>
                      </td>
                      <td>{item.price}</td>
                      <td>{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* New employees */}
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">NHÂN VIÊN MỚI</h3>
            <div className="tile-body">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Địa chỉ</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>SĐT</th>
                    <th>Chức vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {newEmployees.map((nv, idx) => (
                    <tr key={idx}>
                      <td>{nv.name}</td>
                      <td>{nv.address}</td>
                      <td>{nv.dob}</td>
                      <td>{nv.gender}</td>
                      <td>{nv.phone}</td>
                      <td>{nv.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="tile">
            <h3 className="tile-title">DỮ LIỆU HÀNG THÁNG</h3>
            <div className="embed-responsive embed-responsive-16by9">
              <Line data={lineData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="tile">
            <h3 className="tile-title">THỐNG KÊ DOANH SỐ</h3>
            <div className="embed-responsive embed-responsive-16by9">
              <Bar data={barData} />
            </div>
          </div>
        </div>
      </div>
      <div className="text-right" style={{ fontSize: 12 }}>
        <p><b>Hệ thống quản lý V2.0 | Code by Trường</b></p>
      </div>
    </main>
  );
}