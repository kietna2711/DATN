"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";

type Order = {
  id: string;
  customer: string;
  product: string;
  date: string;
  paymentStatus: "Trả" | "Chờ thanh toán" | "Chưa trả";
  total: string;
  paymentMethod: string;
  orderStatus: string;
};

const statusOptions = [
  "Duyệt",
  "Chờ xác nhận",
  "Đang chuẩn bị hàng",
  "Đang giao",
  "Đã giao",
  "Đã hủy",
];

const statusBadge: Record<string, string> = {
  "Duyệt": "bg-success",
  "Chờ xác nhận": "bg-info",
  "Đang chuẩn bị hàng": "bg-warning",
  "Đang giao": "bg-primary",
  "Đã giao": "bg-success",
  "Đã hủy": "bg-danger",
};

const paymentBadge: Record<string, string> = {
  "Trả": "bg-success",
  "Chờ thanh toán": "bg-warning",
  "Chưa trả": "bg-danger",
};

const initialOrders: Order[] = [
  {
    id: "#Kz025418",
    customer: "Xe đẩy Mendor",
    product: "Polka Dots Woman Dress",
    date: "24/03/2022 04:26 CH",
    paymentStatus: "Trả",
    total: "11,250 đô la",
    paymentMethod: "Thẻ Mastercard",
    orderStatus: "Duyệt",
  },
  {
    id: "#Kz025419",
    customer: "Nguyễn Văn B",
    product: "Áo sơ mi nam",
    date: "25/03/2022 10:15 SA",
    paymentStatus: "Chờ thanh toán",
    total: "2,500 đô la",
    paymentMethod: "Chuyển khoản",
    orderStatus: "Chờ xác nhận",
  },
  {
    id: "#Kz025420",
    customer: "Trần Thị C",
    product: "Giày thể thao nữ",
    date: "26/03/2022 08:00 SA",
    paymentStatus: "Trả",
    total: "1,200 đô la",
    paymentMethod: "Tiền mặt",
    orderStatus: "Đang chuẩn bị hàng",
  },
  {
    id: "#Kz025421",
    customer: "Phạm Văn D",
    product: "Đồng hồ nam",
    date: "27/03/2022 09:30 SA",
    paymentStatus: "Trả",
    total: "5,000 đô la",
    paymentMethod: "Thẻ Visa",
    orderStatus: "Đang giao",
  },
  {
    id: "#Kz025422",
    customer: "Lê Thị E",
    product: "Túi xách nữ",
    date: "28/03/2022 11:00 SA",
    paymentStatus: "Trả",
    total: "3,000 đô la",
    paymentMethod: "Thẻ Mastercard",
    orderStatus: "Đã giao",
  },
  {
    id: "#Kz025423",
    customer: "Ngô Văn F",
    product: "Áo khoác nam",
    date: "29/03/2022 02:00 CH",
    paymentStatus: "Chưa trả",
    total: "1,800 đô la",
    paymentMethod: "Tiền mặt",
    orderStatus: "Đã hủy",
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [clock, setClock] = useState("");

  // Đồng hồ realtime
  useEffect(() => {
    function updateClock() {
      const today = new Date();
      const weekday = [
        "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
      ];
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

  // Đổi trạng thái đơn hàng
  const handleStatusChange = (idx: number, status: string) => {
    setOrders(orders =>
      orders.map((order, i) =>
        i === idx ? { ...order, orderStatus: status } : order
      )
    );
  };

  // Xóa đơn hàng
  const handleDelete = (idx: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      setOrders(orders => orders.filter((_, i) => i !== idx));
    }
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active"><a href="#"><b>Quản lý đơn hàng</b></a></li>
        </ul>
        <div id="clock">{clock}</div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <table className="table table-hover table-bordered" id="sampleTable">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Tên khách hàng</th>
                    <th>Tên sản phẩm</th>
                    <th>Ngày</th>
                    <th>Trạng thái thanh toán</th>
                    <th>Tổng cộng</th>
                    <th>Phương thức thanh toán</th>
                    <th>Trạng thái đơn hàng</th>
                    <th>Hoạt động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`badge ${paymentBadge[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>{order.total}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <span className={`badge ${statusBadge[order.orderStatus] || "bg-secondary"}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control form-control-sm select-status"
                          value={order.orderStatus}
                          onChange={e => handleStatusChange(idx, e.target.value)}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <button
                          className="btn btn-danger btn-sm btn-delete-order mt-1"
                          type="button"
                          title="Xóa"
                          onClick={() => handleDelete(idx)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center">Không có đơn hàng nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}