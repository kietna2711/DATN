"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
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

function mapPaymentStatus(paymentStatus: string): Order["paymentStatus"] {
  switch (paymentStatus) {
    case "paid":
      return "Trả";
    case "unpaid":
      return "Chưa trả";
    case "pending":
      return "Chờ thanh toán";
    default:
      return "Chưa trả";
  }
}

function mapOrderStatus(orderStatus: string): string {
  switch (orderStatus) {
    case "approved":
      return "Duyệt";
    case "waiting":
      return "Chờ xác nhận";
    case "preparing":
      return "Đang chuẩn bị hàng";
    case "shipping":
      return "Đang giao";
    case "delivered":
      return "Đã giao";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Chờ xác nhận";
  }
}

function mapPaymentMethod(method: string): string {
  switch (method) {
    case "momo":
      return "Momo";
    case "cod":
      return "Tiền mặt";
    case "bank":
      return "Chuyển khoản";
    default:
      return method;
  }
}

// SỬA ĐOẠN NÀY: tổng tiền = totalPrice + shippingFee
function convertBackendOrderToOrder(data: any): Order {
  const total =
    (data.totalPrice || 0) + (data.shippingFee || 0);
  return {
    id: data.orderId || data._id || "N/A",
    customer: data.shippingInfo?.name || "",
    phone: data.shippingInfo?.phone || "",
    address: data.shippingInfo?.address || "",
    date: data.createdAt ? new Date(data.createdAt).toLocaleString("vi-VN") : "",
    paymentStatus: mapPaymentStatus(data.paymentStatus),
    total: `${total.toLocaleString("vi-VN")} đ`,
    paymentMethod: mapPaymentMethod(data.paymentMethod),
    orderStatus: mapOrderStatus(data.orderStatus),
  };
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clock, setClock] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data.map(convertBackendOrderToOrder)))
      .catch(() => setOrders([]));
  }, []);

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

  const handleStatusChange = (idx: number, status: string) => {
    setOrders(orders =>
      orders.map((order, i) =>
        i === idx ? { ...order, orderStatus: status } : order
      )
    );
  };

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
                    <th>SĐT</th>
                    <th>Địa chỉ</th>
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
                      <td>{order.phone}</td>
                      <td>{order.address}</td>
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
                      <td colSpan={10} className="text-center">Không có đơn hàng nào.</td>
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