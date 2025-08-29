'use client';
import React, { useEffect, useState } from 'react';
import { useShowMessage } from '@/app/utils/useShowMessage';
import './orderList.css';

interface Order {
  _id: string;
  orderId?: string;
  createdAt: string;
  totalPrice: number;
  shippingFee: number;
  coupon?: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  orderStatus: string;
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
  };
}

interface OrderDetail {
  _id: string;
  orderId: string;
  productId: string;
  productName: string;
  variant: string;
  quantity: number;
  price: number;
  coupon?: string;
}

interface Product {
  _id: string;
  name: string;
  images: string[];
}

interface UserOrdersProps {
  username: string;
}

const STATUS_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'waiting' },
  { label: 'Đã xác nhận', value: 'approved' },
  { label: 'Chờ lấy hàng', value: 'processing' },
  { label: 'Đang giao', value: 'shipping' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Đã huỷ', value: 'cancelled' },
  { label: 'Trả hàng', value: 'returned' },
];

const translateStatus = (status: string) =>
  ({
    waiting: 'Chờ xác nhận',
    approved: 'Đã xác nhận',
    processing: 'Đang chuẩn bị hàng',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã huỷ',
    returned: 'Đã trả hàng',
  }[status.toLowerCase()] || status);

const UserOrders: React.FC<UserOrdersProps> = ({ username }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [visibleOrders, setVisibleOrders] = useState<{ [orderId: string]: boolean }>({});
  const showMessage = useShowMessage('', '');

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/usersProfile/by-username-ordername/${username}`);
      if (!res.ok) throw new Error('Không lấy được đơn hàng');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('❌ Lỗi khi lấy đơn hàng:', error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch('http://localhost:3000/orderdetails');
      if (!res.ok) throw new Error('Không lấy được chi tiết đơn hàng');
      const data = await res.json();
      setOrderDetails(data);
    } catch (error) {
      console.error('❌ Lỗi khi lấy orderdetails:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/products');
      if (!res.ok) throw new Error('Không lấy được sản phẩm');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('❌ Lỗi khi lấy products:', error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchOrders();
      fetchOrderDetails();
      fetchProducts();
    }
  }, [username]);

  useEffect(() => {
    if (!username) return;
    const interval = setInterval(() => {
      fetchOrders();
      fetchOrderDetails();
      fetchProducts();
    }, 3000);
    return () => clearInterval(interval);
  }, [username]);

  useEffect(() => {
    const visibleMap: { [id: string]: boolean } = {};
    orders.forEach(order => {
      visibleMap[order._id] = true;
    });
    setVisibleOrders(visibleMap);
  }, [orders, activeTab]);

  const handleToggle = (id: string) => {
    setVisibleOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const shouldShowOrder = (status: string) => activeTab === 'all' || activeTab === status.toLowerCase();

  const handleUpdateOrder = async (orderId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/usersProfile/update-status/${orderId}`, { method: 'PUT' });
      if (!res.ok) throw new Error('Không thể cập nhật trạng thái đơn hàng');
      const data = await res.json();
      const updatedOrder = data.order;

      setOrders(prev => prev.map(order => order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order));

      const status = updatedOrder.orderStatus.toLowerCase();
      if (status === 'cancelled') {
        showMessage.success('Huỷ đơn hàng thành công!');
        setActiveTab('cancelled');
      } else if (status === 'delivered') {
        showMessage.success('Đã xác nhận bạn nhận hàng!');
        setActiveTab('delivered');
      }
    } catch (err) {
      console.error('❌ Lỗi cập nhật trạng thái:', err);
      showMessage.error('❌ Cập nhật trạng thái thất bại!');
    }
  };

  const filteredOrders = orders.filter(order => shouldShowOrder(order.orderStatus));

  return (
    <div className="order-container">
      <div className="tabs">
        {STATUS_OPTIONS.map(({ label, value }) => (
          <button key={value} className={`tab ${activeTab === value ? 'active' : ''}`} onClick={() => setActiveTab(value)}>
            {label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">Bạn chưa có đơn hàng nào cả.</p>
      ) : (
        filteredOrders.map(order => {
          const displayId = order.orderId || order._id;
          const details = orderDetails.filter(od => od.orderId === order._id);

          return (
            <div className="order" key={order._id} data-status={order.orderStatus}>
              <div className="order-header">
                <div className="order-info">
                  <div className="order-title">Đơn hàng #{displayId}</div>
                  <div className="order-meta">
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')} •{' '}
                    <span className="product-total">{details.length}</span> sản phẩm
                  </div>
                </div>
                <div className="order-actions">
                  <span className={`order-status ${order.orderStatus}`}>
                    {translateStatus(order.orderStatus)}
                  </span>
                  <button className="toggle-btn" onClick={() => handleToggle(order._id)}>
                    {visibleOrders[order._id] ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                  </button>
                </div>
              </div>

              <div className={`order-body ${visibleOrders[order._id] ? 'active' : ''}`}>
                <div className="order-section customer">
                  <h4>Thông tin khách hàng</h4>
                  <p>
                    <strong>{order.shippingInfo.name}</strong><br />
                    {order.shippingInfo.phone}<br />
                    {order.shippingInfo.address}
                  </p>
                </div>

                <div className="order-section products">
                  <h4>Sản phẩm</h4>
                  {details.length === 0 && <div>Không có sản phẩm</div>}
                  {details.map((product, idx) => {
                    const productInfo = products.find(p => p._id === product.productId);
                    const imageSrc = productInfo?.images?.[0]
                      ? `http://localhost:3000/images/${productInfo.images[0]}`
                      : '/placeholder.png';

                    return (
                      <div className="product-item" key={idx}>
                        <img src={imageSrc} alt={product.productName} />
                        <div className="product-details">
                          <span>{product.productName}</span>
                          <span>Số lượng: {product.quantity}</span>
                          <span>Size: {product.variant}</span>
                        </div>
                        <div className="product-price-review">
                          <div className="product-price">{product.price.toLocaleString('vi-VN')}₫</div>
                          {order.orderStatus.toLowerCase() === 'delivered' && product.productId && (
                            <a className="btn-review" href={`/products/${product.productId}`}>
                              Đánh giá sản phẩm
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="order-section summary">
                  <h4>Thông tin đơn hàng</h4>
                  <div className="summary-row">
                    <div>Mã giảm giá:</div>
                    <div>{order.coupon || 'Không có'}</div>
                  </div>
                  <div className="summary-row">
                    <div>Tạm tính:</div>
                    <div>{(order.totalPrice - order.shippingFee).toLocaleString('vi-VN')}₫</div>
                  </div>
                  <div className="summary-row">
                    <div>Phí vận chuyển:</div>
                    <div>{order.shippingFee.toLocaleString('vi-VN')}₫</div>
                  </div>
                  <div className="summary-row total">
                    <div>Tổng thanh toán:</div>
                    <div>{order.totalPrice.toLocaleString('vi-VN')}₫</div>
                  </div>
                  <div className="summary-row">
                    <div>Phương thức:</div>
                    <div>{order.paymentMethod.toUpperCase()}</div>
                  </div>
                  <div className="summary-row">
                    <div>Trạng thái:</div>
                    <div className={`payment-status ${order.paymentStatus}`}>
                      {{
                        paid: 'Đã thanh toán',
                        unpaid: 'Chưa thanh toán',
                        pending: 'Chờ xử lý',
                        refunded: 'Đã hoàn tiền',
                      }[order.paymentStatus]}
                    </div>
                  </div>
                </div>

                {order.orderStatus.toLowerCase() === 'waiting' && (
                  <button className="order-btn cancel" onClick={() => handleUpdateOrder(order._id)}>
                    Huỷ đơn hàng
                  </button>
                )}

                {order.orderStatus.toLowerCase() === 'shipping' && (
                  <button className="order-btn received" onClick={() => handleUpdateOrder(order._id)}>
                    Đã nhận hàng
                  </button>
                )}

                {order.orderStatus.toLowerCase() === 'delivered' && (
                  <div className="delivered-success">Giao hàng thành công</div>
                )}

                {order.orderStatus === 'returned' && (
                  <div className="returned-info">Đơn hàng đã hoàn trả thành công!</div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserOrders;
