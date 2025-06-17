"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";
import axios from "axios";



const statusOptions = [
  { label: "Duyệt", value: "approved" },
  { label: "Chờ xác nhận", value: "waiting" },
  { label: "Đang chuẩn bị hàng", value: "processing" },
  { label: "Đang giao", value: "shipping" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
];

const statusBadge: Record<string, string> = {
  "approved": "bg-success",
  "waiting": "bg-info",
  "processing": "bg-warning",
  "shipping": "bg-primary",
  "delivered": "bg-success",
  "cancelled": "bg-danger",
};

const paymentBadge: Record<string, string> = {
  "paid": "bg-success",
  "pending": "bg-warning",
  "unpaid": "bg-danger",
};



type Order = {
  _id: string;
  orderId: string;
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
  };
  productNames?: string[];
  totalPrice: number;
  paymentStatus: "paid" | "unpaid" | "pending";
  paymentMethod: string;
  orderStatus: "approved" | "waiting" | "processing" | "shipping" | "delivered" | "cancelled";
  createdAt: string;
};

// Xác định các trạng thái hợp lệ tiếp theo
function getNextStatusOptions(current: Order["orderStatus"]) {
  switch (current) {
    case "waiting":
      return ["approved", "cancelled"];
    case "approved":
      return ["processing"];
    case "processing":
      return ["shipping"];
    case "shipping":
      return ["delivered"];
    case "delivered":
    case "cancelled":
      return [];
    default:
      return [];
  }
}


export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clock, setClock] = useState("");

  // Lấy danh sách đơn hàng từ backend
  useEffect(() => {
    axios.get("http://localhost:3000/orders")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);


  // Cập nhật đồng hồ mỗi giây
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

  // Đổi trạng thái đơn hàng (update thực tế vào DB)
  const handleStatusChange = (id: string, status: string) => {
    axios.put(`http://localhost:3000/orders/${id}`, { orderStatus: status })
      .then(res => {
        setOrders(orders => orders.map(order =>
          order._id === id ? { ...order, orderStatus: status as Order["orderStatus"] } : order
        ));
      });
  };

  // Xóa đơn hàng (nếu backend có API xóa, bổ sung tại đây)
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      setOrders(orders => orders.filter(order => order._id !== id));
      // Nếu backend có API xóa, gọi thêm axios.delete(...)
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
                    <th>Tên sản phẩm</th>
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
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.orderId || order._id}</td>
                      <td>
                        {order.productNames ? order.productNames.join(", ") : ""}
                      </td>
                      <td>{order.shippingInfo?.name || ""}</td>
                      <td>{order.shippingInfo?.phone || ""}</td>
                      <td>{order.shippingInfo?.address || ""}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${paymentBadge[order.paymentStatus] || "bg-secondary"}`}>
                          {order.paymentStatus === "paid" ? "Trả" : order.paymentStatus === "pending" ? "Chờ thanh toán" : "Chưa trả"}
                        </span>
                      </td>
                      <td>{order.totalPrice?.toLocaleString()} đ</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <span className={`badge ${statusBadge[order.orderStatus] || "bg-secondary"}`}>
                          {statusOptions.find(opt => opt.value === order.orderStatus)?.label || order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control form-control-sm select-status"
                          value={order.orderStatus}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          disabled={getNextStatusOptions(order.orderStatus).length === 0}
                        >
                          <option value={order.orderStatus}>
                            {statusOptions.find(opt => opt.value === order.orderStatus)?.label}
                          </option>
                          {getNextStatusOptions(order.orderStatus).map(nextStatus => (
                            <option key={nextStatus} value={nextStatus}>
                              {statusOptions.find(opt => opt.value === nextStatus)?.label}
                            </option>
                          ))}
                        </select>
                        {/* <button
                          className="btn btn-danger btn-sm btn-delete-order mt-1"
                          type="button"
                          title="Xóa"
                          onClick={() => handleDelete(order._id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button> */}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={11} className="text-center">Không có đơn hàng nào.</td>
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