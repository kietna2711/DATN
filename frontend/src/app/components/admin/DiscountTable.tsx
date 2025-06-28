import { Voucher } from "@/app/types/voucherD";
import React from "react";

type Props = {
    discounts: Voucher[];
};

function formatNumber(n?: number | null) {
    if (n == null) return "0";
    return n.toLocaleString("vi-VN");
}

function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function DiscountTable({ discounts }: Props) {
    const renderStatusAndPeriod = (d: Voucher) => {
        let now = new Date();
        let from = d.startDate ? new Date(d.startDate) : null;
        let to = d.endDate ? new Date(d.endDate) : null;
        let statusEl: React.ReactNode;

        if (!d.active) {
            statusEl = (
                <span className="badge bg-warning text-dark" style={{ fontWeight: 500 }}>
                    Chưa kích hoạt
                </span>
            );
        } else if (from && now < from) {
            statusEl = (
                <span className="badge bg-info text-dark" style={{ fontWeight: 500 }}>
                    Chưa hiệu lực
                </span>
            );
        } else if (to && now > to) {
            statusEl = (
                <span className="badge bg-secondary text-light" style={{ fontWeight: 500 }}>
                    Hết hạn
                </span>
            );
        } else {
            statusEl = (
                <span className="badge bg-success" style={{ fontWeight: 500 }}>
                    Đang hoạt động
                </span>
            );
        }

        return (
            <div style={{ minWidth: 140 }}>
                {statusEl}
                <br />
                <span style={{ fontSize: 13, color: "#222" }}>
                    {formatDate(d.startDate)} - {formatDate(d.endDate)}
                </span>
            </div>
        );
    };

    const renderValue = (d: Voucher) => {
        if (d.percent != null) return `${d.percent}%`;
        if (d.amount != null) return `${formatNumber(d.amount)}đ`;
        return "0";
    };

    const renderDiscountType = (d: Voucher) => {
        if (d.targetType === "category")
            return (
                <span>
                    <span className="badge bg-secondary" style={{ background: "#6c757d", fontWeight: 500 }}>
                        Mã giảm theo danh mục
                    </span>
                    <br />
                    <span style={{ fontSize: 12, color: "#888" }}>
                        {d.categoryIds?.length || 0} danh mục
                    </span>
                </span>
            );
        if (d.targetType === "product")
            return (
                <span>
                    <span className="badge bg-success" style={{ background: "#4dd187", fontWeight: 500 }}>
                        Mã giảm theo sản phẩm
                    </span>
                    <br />
                    <span style={{ fontSize: 12, color: "#888" }}>
                        {d.productIds?.length || 0} sản phẩm
                    </span>
                </span>
            );
        if (d.targetType === "all")
            return (
                <span>
                    <span className="badge bg-info" style={{ background: "#7a75de", fontWeight: 500 }}>
                        Mã giảm toàn Shop
                    </span>
                    <br />
                    <span style={{ fontSize: 12, color: "#888" }}>
                        Toàn shop
                    </span>
                </span>
            );
        return "";
    };

    const renderApplyTarget = (d: Voucher) => {
        if (d.targetType === "product") {
            return (
                <span>
                    {d.productIds?.length || 0} sản phẩm
                </span>
            );
        }
        if (d.targetType === "category") {
            return (
                <span>
                    {d.categoryIds?.length || 0} danh mục
                </span>
            );
        }
        if (d.targetType === "all") {
            return <span>Toàn shop</span>;
        }
        return "";
    };

    return (
        <table className="table table-hover table-bordered">
            <thead>
                <tr>
                    <th>Mã giảm giá</th>
                    <th>Mô tả</th>
                    <th>Loại mã áp dụng</th>
                    <th>Áp dụng cho</th> {/* Thêm cột này */}
                    <th>Phần trăm / Số tiền</th>
                    <th>Đơn tối thiểu</th>
                    <th>Giảm tối đa</th>
                    <th>Lượt dùng</th>
                    <th>Trạng thái & Hiệu lực</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {discounts.map((d, idx) => (
                    <tr key={d._id}>
                        <td>{d.discountCode}</td>
                        <td>{d.description}</td>
                        <td>{renderDiscountType(d)}</td>
                        <td>{renderApplyTarget(d)}</td> {/* Thêm dòng này */}
                        <td>{renderValue(d)}</td>
                        <td>{formatNumber(d.minOrderValue)}đ</td>
                        <td>{formatNumber(d.maxDiscount)}đ</td>
                        <td>{(d.used ?? 0)}/{d.usageLimit ?? 0}</td>
                        <td>{renderStatusAndPeriod(d)}</td>
                        <td>
                            <a
                                href={`/admin/discount/editdiscount/${d._id}`}
                                className="btn btn-primary btn-sm me-2"
                                title="Sửa"
                            >
                                <i className="fas fa-edit"></i>
                            </a>
                        </td>
                    </tr>
                ))}
                {discounts.length === 0 && (
                    <tr>
                        <td colSpan={10} className="text-center">Không có mã giảm giá nào.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}