"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";
import "../order/order.css";
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

const barData = {
  labels: [],
  datasets: [
    {
      label: "Doanh thu (triệu)",
      data: [],
      backgroundColor: "#28a745",
    },
  ],
};

export default function ReportManagement() {
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<any[]>([]);
  // Dummy data for new employees, replace with real data fetching if needed
  const [newEmployees, setNewEmployees] = useState<any[]>([]);
  const [newCustomers, setNewCustomers] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);

  //phân trang 
  const [latestOrders, setLatestOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const totalPages = Math.ceil(latestOrders.length / pageSize);
  const pagedOrders = latestOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const [monthLabels, setMonthLabels] = useState<string[]>([]);
  const [ordersCountByMonth, setOrdersCountByMonth] = useState<number[]>([]);

  // Lọc theo ngày / tuần / tháng
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month">("month");

  const [widgetFilter, setWidgetFilter] = useState<"all" | "day" | "week" | "month">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Thêm vào sau các useState đã có
  const [confirmModal, setConfirmModal] = useState<{ show: boolean, orderId: string, newStatus: string } | null>(null);

/**
 * Lấy danh sách đơn hàng từ API khi component mount.
 * Đồng thời tính số đơn hàng từng tháng để hiển thị biểu đồ.
 */
  useEffect(() => {
    fetch("http://localhost:3000/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);

        // Tính số đơn hàng đã giao từng tháng
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const months = Array.from({ length: currentMonth }, (_, i) => i + 1);
        const counts = months.map(month => {
          return data.filter((order: { createdAt: string | number | Date; }) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() + 1 === month;
          }).length;
        });

        setOrdersCountByMonth(counts);
        setMonthLabels(months.map(m => `Tháng ${m}`));
      });
  }, []);

  // Dữ liệu biểu đồ dựa trên filter
  const orderStats = getOrdersByFilter(orders, timeFilter);
  const revenueStats = getRevenueByFilter(orders, timeFilter);

  const lineData = {
    labels: orderStats.labels,
    datasets: [
      {
        label: "Đơn hàng",
        data: orderStats.counts,
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.2)",
        tension: 0.4,
      },
    ],
  };

  const updatedBarData = {
    labels: revenueStats.labels,
    datasets: [
      {
        label: "Doanh thu (triệu)",
        data: revenueStats.counts,
        backgroundColor: "#28a745",
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: {
        ticks: {
          stepSize: 1, // Hiển thị số nguyên
          callback: function (value: number | string) {
            return Number(value); // Loại bỏ phần thập phân
          }
        },
        beginAtZero: true
      }
    }
  };

  function filterOrdersByWidget(orders: any[]) {
  if (widgetFilter === "all") return orders;
  const now = new Date();
  if (widgetFilter === "day") {
    if (!selectedDate) return [];
    return orders.filter(order => {
      const od = new Date(order.createdAt);
      return od.toISOString().split("T")[0] === selectedDate;
    });
  }
  if (widgetFilter === "week") {
    const start = getStartOfWeek(now);
    const end = getEndOfWeek(now);
    return orders.filter(order => {
      const created = new Date(order.createdAt);
      return created >= start && created <= end;
    });
  }
  if (widgetFilter === "month") {
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    return orders.filter(order =>
      new Date(order.createdAt).getMonth() + 1 === currentMonth &&
      new Date(order.createdAt).getFullYear() === currentYear
    );
  }
  if (widgetFilter === "year") {
    const currentYear = now.getFullYear();
    return orders.filter(order =>
      new Date(order.createdAt).getFullYear() === currentYear
    );
  }
  return orders;
}

    function getStartOfWeek(date: Date) {
      const d = new Date(date);
      const day = d.getDay() || 7; // Chủ nhật là 7
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - day + 1); // Về thứ Hai
      return d;
    }
    function getEndOfWeek(date: Date) {
      const d = getStartOfWeek(date);
      d.setDate(d.getDate() + 6); // Chủ nhật
      return d;
    }

  function filterUsersByWidget(users: any[]) {
    if (widgetFilter === "all") return users;
    const now = new Date();
    if (widgetFilter === "day") {
      if (!selectedDate) return [];
      return users.filter(u =>
        new Date(u.createdAt).toISOString().split("T")[0] === selectedDate
      );
  }
   if (widgetFilter === "week") {
    const start = getStartOfWeek(now);
    const end = getEndOfWeek(now);
    return users.filter(u => {
      const created = new Date(u.createdAt);
      return created >= start && created <= end;
    });
  }
    if (widgetFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return users.filter(u => new Date(u.createdAt) >= monthAgo);
    }
    if (widgetFilter === "year") {
      const currentYear = now.getFullYear();
      return users.filter(u => new Date(u.createdAt).getFullYear() === currentYear);
    }
    return users;
  }

  //filterProductsByWidget
  function filterProductsByWidget(products: any[]) {
    if (widgetFilter === "all") return products;
    const now = new Date();
     if (widgetFilter === "day") {
        if (!selectedDate) return [];
        return products.filter(p =>
          new Date(p.createdAt).toISOString().split("T")[0] === selectedDate
        );
  }
    if (widgetFilter === "week") {
    const start = getStartOfWeek(now);
    const end = getEndOfWeek(now);
    return products.filter(p => {
      const created = new Date(p.createdAt);
      return created >= start && created <= end;
    });
  }
    if (widgetFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return products.filter(p => new Date(p.createdAt) >= monthAgo);
    }
    if (widgetFilter === "year") {
      const currentYear = now.getFullYear();
      return products.filter(p => new Date(p.createdAt).getFullYear() === currentYear);
    }
    return products;
  }

  // Lấy tất cả đơn hàng chưa duyệt
  useEffect(() => {
  if (!orders || orders.length === 0) {
    setLatestOrders([]);
    return;
  }
  // Lấy tất cả đơn hàng chưa duyệt
  const unapprovedOrders = orders.filter(order =>
    order.orderStatus === "waiting" ||
    order.orderStatus === "pending" ||
    order.orderStatus === "chờ xác nhận"
  );
  // Sắp xếp mới nhất lên đầu
  const sortedUnapproved = [...unapprovedOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  setLatestOrders(sortedUnapproved); // Không slice(0, 10) nữa
}, [orders]);

  // Hàm lấy tên sản phẩm từ orderItems
  function getProductNames(order: any) {
    if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
      return order.orderItems.map((item: any) => item.product?.name || item.name).join(", ");
    }
    if (Array.isArray(order.productNames) && order.productNames.length > 0) {
      return order.productNames.join(", ");
    }
    return "";
  }

  // Hàm đổi trạng thái đơn hàng
  function getNextStatusOptions(current: string) {
    switch (current) {
      case "waiting":
      case "pending":
      case "chờ xác nhận":
        return ["approved", "cancelled"];
      case "approved":
        return ["processing"];
      case "processing":
        return ["shipping"];
      case "shipping":
        return ["delivered"];
      case "delivered":
        return ["returned"];
      case "returned":
      case "cancelled":
        return [];
      default:
        return [];
    }
  }
  function updateOrderStatus(id: string, status: string) {
    fetch(`http://localhost:3000/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: status }),
    })
      .then(res => res.json())
      .then(() => {
        setOrders(orders => orders.map(order =>
          order._id === id ? { ...order, orderStatus: status } : order
        ));
      });
  }
  const statusOptions = [
    { label: "Duyệt", value: "approved" },
    { label: "Chờ xác nhận", value: "waiting" },
    { label: "Chuẩn bị hàng", value: "processing" },
    { label: "Đang giao", value: "shipping" },
    { label: "Đã giao", value: "delivered" },
    { label: "Đã trả hàng", value: "returned" },
    { label: "Đã hủy", value: "cancelled" },
  ];
  const statusBadge: Record<string, string> = {
    "approved": "bg-success",
    "waiting": "bg-info",
    "pending": "bg-info",
    "chờ xác nhận": "bg-info",
    "processing": "bg-warning",
    "shipping": "bg-primary",
    "delivered": "bg-success",
    "returned": "bg-dark",
    "cancelled": "bg-danger",
  };
  const paymentBadge: Record<string, string> = {
    "paid": "bg-success",
    "pending": "bg-warning",
    "unpaid": "bg-danger",
    "refunded": "bg-secondary",
  };
  const paymentText: Record<string, string> = {
    paid: "Đã thanh toán",
    pending: "Chờ thanh toán",
    unpaid: "Chưa trả",
    refunded: "Hoàn tiền"
  };

/**
 * Lấy dữ liệu doanh thu từng tháng từ API khi component mount.
 * Dùng cho biểu đồ doanh thu.
 */
  useEffect(() => {
    fetch("http://localhost:3000/api/statistics/revenue")
      .then(res => res.json())
      .then(data => {
        // Lấy tháng hiện tại
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const months = Array.from({ length: currentMonth }, (_, i) => i + 1);
        // Map doanh thu từng tháng, nếu không có thì là 0
        const revenueArr = months.map(month => {
          const found = data.find((item: any) => item.month === month);
          return found ? found.total / 1000000 : 0; // đổi sang triệu
        });
        setRevenueData(revenueArr);
        setLabels(months.map(m => `Tháng ${m}`));
      });
  }, []);

/**
 * Lấy danh sách sản phẩm và người dùng từ API khi component mount.
 * Tính sản phẩm hết hàng và sản phẩm bán chạy.
 */
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setOutOfStockProducts(data.filter((p: any) => p.quantity === 0));
      });
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(setUsers);
    fetch("http://localhost:3000/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);

        // Tính sản phẩm bán chạy từ orders
        const productMap = new Map();
        data.forEach((order: any) => {
          if (order.orderStatus !== "delivered") return;
          if (!Array.isArray(order.orderItems)) return;
          order.orderItems.forEach((item: any) => {
            const key = item.product._id || item.product;
            if (!productMap.has(key)) {
              productMap.set(key, {
                id: key,
                name: item.product.name || item.name,
                price: item.product.price || item.price,
                category: item.product.category || item.category,
                totalSold: 0,
              });
            }
            productMap.get(key).totalSold += item.quantity; // <--- CỘNG DỒN SỐ LƯỢNG BÁN
          });
        });
        const bestSellersArr = Array.from(productMap.values())
          .sort((a, b) => b.totalSold - a.totalSold)
          .slice(0, 5);
        setBestSellers(bestSellersArr);
      });
  }, []);

  useEffect(() => {
    // Lọc khách hàng mới trong 7 ngày gần nhất
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    setNewCustomers(users.filter(u => new Date(u.createdAt) >= weekAgo));
  }, [users]);

  /**
 * Lấy danh sách chi tiết đơn hàng từ API khi component mount.
 */
  useEffect(() => {
    fetch("http://localhost:3000/orderdetails")
      .then(res => res.json())
      .then(data => {
        console.log("orderdetails api data:", data);
        setOrderDetails(Array.isArray(data) ? data : []);
      });
  }, []);

  function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}


  function getOrdersByFilter(data: any[], filter: "day" | "week" | "month"| "year") {
  const now = new Date();
  if (filter === "day") {
    // 10 ngày gần nhất
    const days = Array.from({ length: 10 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (9 - i));
      return d;
    });
    const labels = days.map(d => d.toLocaleDateString("vi-VN"));
    const counts = days.map(d => {
      return data.filter(order => {
        const od = new Date(order.createdAt);
        return od.toDateString() === d.toDateString();
      }).length;
    });
    return { labels, counts };
  }
  if (filter === "week") {
    // Lấy 4 tuần gần nhất (cả năm và tuần)
    const weeks: { year: number, week: number }[] = [];
    let tempDate = new Date(now);
    for (let i = 0; i < 4; i++) {
      const year = tempDate.getFullYear();
      const week = getWeekNumber(tempDate);
      weeks.unshift({ year, week });
      tempDate.setDate(tempDate.getDate() - 7);
    }
    const labels = weeks.map(w => `Tuần ${w.week} (${w.year})`);
    const counts = weeks.map(w =>
      data.filter(order => {
        const od = new Date(order.createdAt);
        return getWeekNumber(od) === w.week && od.getFullYear() === w.year;
      }).length
    );
    return { labels, counts };
  }
  if (filter === "year") {
    // Thống kê từng năm từ năm đầu tiên đến năm hiện tại
    const years = Array.from(
      new Set(data.map(order => new Date(order.createdAt).getFullYear()))
    ).sort((a, b) => a - b);
    const labels = years.map(y => `Năm ${y}`);
    const counts = years.map(year =>
      data.filter(order => new Date(order.createdAt).getFullYear() === year).length
    );
    return { labels, counts };
  }

  // mặc định: theo tháng
  const currentMonth = now.getMonth() + 1;
  const months = Array.from({ length: currentMonth }, (_, i) => i + 1);
  const labels = months.map(m => `Tháng ${m}`);
  const counts = months.map(month =>
    data.filter(order => new Date(order.createdAt).getMonth() + 1 === month).length
  );
  return { labels, counts };
  }

  /**
 * Thống kê doanh thu theo ngày, tuần, tháng, năm.
 */
  function getRevenueByFilter(data: any[], filter: "day" | "week" | "month"| "year") {
    const now = new Date();

    if (filter === "day") {
      const days = Array.from({ length: 10 }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (9 - i));
        return d;
      });
      const labels = days.map(d => d.toLocaleDateString("vi-VN"));
      const counts = days.map(d => {
        return data
          .filter(order => {
          const od = new Date(order.createdAt);
          return od.toDateString() === d.toDateString() && order.orderStatus === "delivered";
        })
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    });
    return { labels, counts };
  }

  if (filter === "week") {
    // 4 tuần gần nhất theo tuần thực tế
    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();
    const weeks = [currentWeek - 3, currentWeek - 2, currentWeek - 1, currentWeek];
    const labels = weeks.map(w => `Tuần ${w}`);
    const counts = weeks.map(w => {
      return data
        .filter(order => {
          const od = new Date(order.createdAt);
          return getWeekNumber(od) === w && od.getFullYear() === currentYear && order.orderStatus === "delivered";
        })
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    });
    return { labels, counts };
  }
  if (filter === "year") {
    // Thống kê từng năm từ năm đầu tiên đến năm hiện tại
    const years = Array.from(
      new Set(data.map(order => new Date(order.createdAt).getFullYear()))
    ).sort((a, b) => a - b);
    const labels = years.map(y => `Năm ${y}`);
    const counts = years.map(year =>
      data
        .filter(order => new Date(order.createdAt).getFullYear() === year && order.orderStatus === "delivered")
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    );
    return { labels, counts };
  }

    // mặc định: theo tháng
    const currentMonth = now.getMonth() + 1;
    const months = Array.from({ length: currentMonth }, (_, i) => i + 1);
    const labels = months.map(m => `Tháng ${m}`);
    const counts = months.map(month =>
      data
        .filter(order => new Date(order.createdAt).getMonth() + 1 === month && order.orderStatus === "delivered")
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    );
    return { labels, counts };
  }

  // Sau khi đã setOrders(data) trong useEffect fetch orders
    const totalRevenue = orders
      .filter(order => order.orderStatus === "delivered")
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalDeliveredOrders = orders.filter(order => order.orderStatus === "Đã giao").length;


  return (
    <main className="app-content">
      <div className="row">
        <div className="col-md-12">
          <div className="app-title">
            <ul className="app-breadcrumb breadcrumb">
              <li className="breadcrumb-item"><b>BÁO CÁO DANNH THU</b></li>
            </ul>
            <div id="clock"></div>
          </div>
        </div>
      </div>
      {/* Select lọc widget */}
      <div className="row mb-3">
        <div className="col-md-12 text-right">
          <select
            className="form-select w-auto d-inline"
            value={widgetFilter}
            onChange={e => setWidgetFilter(e.target.value as any)}
          >
            <option value="all">Tất cả</option>
            <option value="day">Theo ngày</option>
            <option value="week">Theo tuần</option>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>
          {widgetFilter === "day" && (
            <input
              type="date"
              className="form-control d-inline w-auto ml-2"
              value={selectedDate}
              max={new Date().toISOString().split("T")[0]}
              min={(() => {
                const d = new Date();
                d.setDate(d.getDate() - 29);
                return d.toISOString().split("T")[0];
              })()}
              onChange={e => setSelectedDate(e.target.value)}
            />
          )}
        </div>
      </div>

        {/* Widgets */}
        <div className="row">
          <div className="col-md-3 col-6 mb-3">
            <div className="widget-small primary coloured-icon">
              <i className="icon bx bxs-user fa-3x"></i>
              <div className="info">
                <h4>TỔNG KHÁCH HÀNG</h4>
                <p><b>{filterUsersByWidget(users).length} khách hàng</b></p>
              </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="widget-small info coloured-icon">
            <i className="icon bx bxs-purchase-tag-alt fa-3x"></i>
            <div className="info">
              <h4>TỔNG SẢN PHẨM</h4>
              <p><b>{filterProductsByWidget(products).length} sản phẩm</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="widget-small warning coloured-icon">
            <i className="icon bx bxs-shopping-bag-alt fa-3x"></i>
            <div className="info">
              <h4>TỔNG ĐƠN HÀNG</h4>
              <p><b>{filterOrdersByWidget(orders).length} đơn hàng</b></p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="widget-small danger coloured-icon">
            <i className="icon bx bxs-check-circle fa-3x"></i>
            <div className="info">
               <h4 style={{ color: "red" }}>ĐƠN HÀNG ĐÃ GIAO</h4>
                <p>
                  <b>
                    {filterOrdersByWidget(orders).filter(order => order.orderStatus === "delivered").length} đơn hàng
                  </b>
                </p>
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
              <p>
                <b>
                  {filterOrdersByWidget(orders)
                    .filter(order => order.orderStatus === "delivered")
                    .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
                    .toLocaleString()} đ
                </b>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="widget-small info coloured-icon">
            <i className="icon fa-3x bx bxs-user-badge"></i>
            <div className="info">
              <h4>KHÁCH HÀNG MỚI</h4>
              <p>
                <b>
                  {filterUsersByWidget(newCustomers).length} khách hàng
                </b>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="widget-small danger coloured-icon">
            <i className="icon fa-3x bx bxs-receipt"></i>
            <div className="info">
              <h4>Đơn hàng hủy</h4>
              <p>
                <b>
                  {filterOrdersByWidget(orders).filter(order => order.orderStatus === "cancelled").length} đơn hàng
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* option chọn thời gian */}
      <div className="row mb-3">
        <div className="col-md-12 text-right">
          <select
            className="form-select w-auto d-inline"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
          >
            <option value="day">Theo ngày</option>
            <option value="week">Theo tuần</option>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>
        </div>
      </div>

      {/* Charts */}
     <div className="row">
        <div className="col-md-6">
          <div className="tile">
            <h3 className="tile-title" style={{ textAlign: "center", marginTop: 12 }}>
              {timeFilter === "day"
                ? "DỮ LIỆU HÀNG NGÀY"
                : timeFilter === "week"
                ? "DỮ LIỆU HÀNG TUẦN"
                : "DỮ LIỆU HÀNG THÁNG"}
            </h3>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="tile">
            <h3 className="tile-title" style={{ textAlign: "center", marginTop: 12 }}>
              {timeFilter === "day"
                ? "DỮ LIỆU HÀNG NGÀY"
                : timeFilter === "week"
                ? "DỮ LIỆU HÀNG TUẦN"
                : timeFilter === "month"
                ? "DỮ LIỆU HÀNG THÁNG"
                : "DỮ LIỆU HÀNG NĂM"}
            </h3>
            <Bar data={updatedBarData} />
          </div>
        </div>
      </div> 

      {/* BẢNG ĐƠN HÀNG CHƯA DUYỆT */}
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">ĐƠN HÀNG CHƯA DUYỆT</h3>
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
                  {pagedOrders.map(order => (
                    <tr key={order._id || order.id}>
                      <td>{order.orderId || order._id || order.id}</td>
                      <td>{getProductNames(order)}</td>
                      <td>{order.shippingInfo?.name || order.customerName || order.customer || order.user?.username || order.user?.email}</td>
                      <td>{order.shippingInfo?.phone || ""}</td>
                      <td>{order.shippingInfo?.address || ""}</td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : ""}</td>
                      <td>
                        <span className={`badge ${paymentBadge[order.paymentStatus] || "bg-secondary"}`}>
                          {paymentText[order.paymentStatus] || "Không rõ"}
                        </span>
                      </td>
                      <td>
                        <strong>{order.totalPrice?.toLocaleString()} đ</strong>
                        <br />
                        <small className="text-muted">
                          (Tạm tính: {(order.totalPrice - (order.shippingFee || 0)).toLocaleString()} đ + Ship: {order.shippingFee?.toLocaleString()} đ)
                        </small>
                      </td>
                      <td>{order.paymentMethod || order.paymentType || "Chưa rõ"}</td>
                      <td>
                        <span className={`badge ${statusBadge[order.orderStatus] || "bg-secondary"}`}>
                          {statusOptions.find(opt => opt.value === order.orderStatus)?.label || order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control form-control-sm select-status"
                          value={order.orderStatus}
                          onChange={e => {
                            const val = e.target.value;
                            // Luôn hiện popup xác nhận khi chuyển trạng thái
                            if (val !== order.orderStatus) {
                              setConfirmModal({ show: true, orderId: order._id, newStatus: val });
                            }
                          }}
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
                      </td>
                    </tr>
                  ))}
                  {pagedOrders.length === 0 && (
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

      {/* Modal xác nhận giao/trả hàng */}
      {confirmModal?.show && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {confirmModal.newStatus === "returned" ? "Xác nhận trả hàng" : "Xác nhận giao hàng"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setConfirmModal(null)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Bạn có chắc chắn muốn chuyển đơn hàng sang <strong>
                    {confirmModal.newStatus === "returned" ? "Đã trả hàng" : "Đã giao"}
                  </strong> không?
                </p>
                <p className="text-danger small">
                  {confirmModal.newStatus === "returned"
                    ? "Hệ thống sẽ hoàn kho và cập nhật trạng thái thanh toán nếu đơn hàng đã được thanh toán."
                    : "Hệ thống sẽ tự động cập nhật kho, tăng số lượng đã bán và đánh dấu thanh toán (nếu chưa thanh toán)."}
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setConfirmModal(null)}>Hủy</button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    updateOrderStatus(confirmModal.orderId, confirmModal.newStatus);
                    setConfirmModal(null);
                  }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end align-items-center mt-2">
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                &laquo;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="text-right" style={{ fontSize: 12 }}>
        <p><b>Hệ thống quản lý V2.0 | Code by Trường</b></p>
      </div>
    </main>
  );
}