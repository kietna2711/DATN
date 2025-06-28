"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShopOutlined, ShoppingCartOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@/app/styles/admin/adddiscount.module.css";
import "@/app/admin/admin.css";
import ProductSelectModal from "@/app/components/admin/ProductSelectModal";
import CategorySelectModal from "@/app/components/admin/CategorySelectModal";
import { getCategories } from "@/app/services/categoryService";
import { getProducts } from "@/app/services/productService";
import { getVoucherById, editVoucher } from "@/app/services/voucherService";
import { Voucher } from "@/app/types/voucherD";
import { validateVoucherForm } from "@/app/hooks/useVoucherForm";
import SectionApplyTarget from "@/app/components/admin/SectionApplyTarget";
import useProductSelect from "@/app/hooks/useProductSelect";
import useCategorySelect from "@/app/hooks/useCategorySelect";
import { useSuccessNotification } from "@/app/utils/useSuccessNotification";

// Hàm format ngày cho input type="date"
function formatDateInput(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function DiscountEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) && params.id.length > 0 ? params.id[0] : "";

  const [form, setForm] = useState<Voucher | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState<"amount" | "percent">("percent");
  const [maxDiscountLimit, setMaxDiscountLimit] = useState<"limited" | "unlimited">("unlimited");
  const [categoryTouched, setCategoryTouched] = useState(false);

  const productSelect = useProductSelect(form?.productIds || []);
  const categorySelect = useCategorySelect(form?.categoryIds || []);
  const showSuccess = useSuccessNotification();

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        setError("Thiếu ID voucher để chỉnh sửa!");
        setForm(null);
        return;
      }
      try {
        const [cats, prods, voucherData] = await Promise.all([
          getCategories(),
          getProducts(),
          getVoucherById(id),
        ]);
        setCategories(
          cats.map((cat: any) => ({
            id: cat._id || cat.id,
            name: cat.name,
            children: cat.subcategories
              ? cat.subcategories.map((sub: any) => ({
                  id: sub._id || sub.id,
                  name: sub.name,
                  children: [],
                }))
              : [],
          }))
        );
        setProducts(
          prods.map((p: any) => ({
            id: p._id || p.id,
            code: p.code || "",
            name: p.name,
            price: p.price,
            image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "",
            categoryId:
              typeof p.categoryId === "object" && p.categoryId
                ? p.categoryId._id || p.categoryId.id
                : p.categoryId,
            subcategoryId: p.subcategoryId
              ? typeof p.subcategoryId === "object"
                ? {
                    id: p.subcategoryId._id || p.subcategoryId.id,
                    name: p.subcategoryId.name,
                  }
                : null
              : null,
            variants: Array.isArray(p.variants) ? p.variants : [],
          }))
        );

        if (!voucherData || !voucherData._id) {
          setError("Không tìm thấy voucher này!");
          setForm(null);
          return;
        }

        setForm(voucherData);
        setDiscountType(voucherData.amount !== null ? "amount" : "percent");
        setMaxDiscountLimit(voucherData.maxDiscount !== null ? "limited" : "unlimited");
        productSelect.setSelectedProductIds(voucherData.productIds ?? []);
        categorySelect.setSelectedCategoryIds(voucherData.categoryIds ?? []);
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu voucher");
        setForm(null);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const handleVoucherType = useCallback((type: "all" | "product" | "category") => {
    if (!form) return;
    setForm((f) => ({
      ...f!,
      targetType: type,
      productIds: type === "category" ? [] : f!.productIds,
      categoryIds: type === "product" ? [] : f!.categoryIds,
    }));
    setCategoryTouched(false);
    setError(null);
    if (type === "category") productSelect.setSelectedProductIds([]);
    if (type === "product") categorySelect.setSelectedCategoryIds([]);
  }, [form, productSelect, categorySelect]);

  const handleDiscountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "amount" | "percent";
    setDiscountType(value);
    setForm((f) => ({
      ...f!,
      amount: value === "amount" ? 0 : null,
      percent: value === "percent" ? 0 : null,
    }));
  };

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f!,
      [discountType]: value === "" ? null : Number(value),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  function getCategoryName(id: string): string {
    function findCat(cats: any[]): any | null {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.children && cat.children.length > 0) {
          const found = findCat(cat.children);
          if (found) return found;
        }
      }
      return null;
    }
    const cat = findCat(categories);
    return cat?.name || id;
  }
  function getProduct(pid: string) {
    return products.find((p) => p.id === pid);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryTouched(true);

    if (!form) return;

    const dataToSave = {
      ...form,
      productIds: productSelect.selectedProductIds,
      categoryIds: categorySelect.selectedCategoryIds,
    };

    const errMsg = validateVoucherForm(dataToSave, discountType);
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setSubmitting(true);
    try {
      await editVoucher(form._id!, dataToSave);
      showSuccess("Cập nhật thành công", "Mã giảm giá đã được cập nhật!");
      router.push("/discount");
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật mã giảm giá");
    } finally {
      setSubmitting(false);
    }
  };

  // Nếu có lỗi thì hiện ra, còn lại không có hiệu ứng đang tải
  if (!form && error) {
    return <div style={{ padding: 40, color: "red", textAlign: "center" }}>{error}</div>;
  }
  if (!form) {
    // Không hiển thị gì khi đang tải, chỉ show nội dung khi có form hoặc có lỗi
    return null;
  }

  return (
    <main className="app-content">
      <div className="container">
        {/* Breadcrumb */}
        <div className="app-title">
          <ul className="app-breadcrumb breadcrumb">
            <li className="breadcrumb-item">
              <a href="/discount">Quản lý giảm giá</a>
            </li>
            <li className="breadcrumb-item active">Chỉnh sửa mã giảm giá</li>
          </ul>
        </div>
        {/* Form chỉnh sửa voucher */}
        <div
          className="tile px-0 py-4 px-md-4"
          style={{
            borderRadius: 16,
            background: "#fff",
            boxShadow: "0 2px 8px #f9e5ef33",
            border: "1px solid #ffe0ef",
          }}
        >
          {/* 1. Chọn loại mã giảm giá */}
          <div className={styles["section-title"] + " mb-3"}>
            1. Loại mã giảm giá
          </div>
          <div className={styles["voucher-type-row"] + " mb-4"}>
            <div
              className={
                `voucher-type-card ${styles["voucher-type-card"]} ` +
                (form.targetType === "all"
                  ? "active teddy " + styles["active"]
                  : "")
              }
              onClick={() => handleVoucherType("all")}
            >
              <div className={styles["voucher-type-icon"] + " shop"}>
                <ShopOutlined />
              </div>
              <div>
                <div className={styles["voucher-type-label"]}>Voucher toàn</div>
                <div className={styles["voucher-type-label"]}>Shop</div>
              </div>
              {form.targetType === "all" && (
                <div className={styles["voucher-type-check"] + " teddy"}>
                  <span>✔</span>
                </div>
              )}
            </div>
            <div
              className={
                `voucher-type-card ${styles["voucher-type-card"]} ` +
                (form.targetType === "category"
                  ? "active teddy " + styles["active"]
                  : "")
              }
              onClick={() => handleVoucherType("category")}
            >
              <div className={styles["voucher-type-icon"] + " product"}>
                <ShopOutlined />
              </div>
              <div>
                <div className={styles["voucher-type-label"]}>
                  Voucher danh mục
                </div>
              </div>
              {form.targetType === "category" && (
                <div className={styles["voucher-type-check"] + " teddy"}>
                  <span>✔</span>
                </div>
              )}
            </div>
            <div
              className={
                `voucher-type-card ${styles["voucher-type-card"]} ` +
                (form.targetType === "product"
                  ? "active teddy " + styles["active"]
                  : "")
              }
              onClick={() => handleVoucherType("product")}
            >
              <div className={styles["voucher-type-icon"] + " product"}>
                <ShoppingCartOutlined />
              </div>
              <div>
                <div className={styles["voucher-type-label"]}>
                  Voucher sản phẩm
                </div>
              </div>
              {form.targetType === "product" && (
                <div className={styles["voucher-type-check"] + " teddy"}>
                  <span>✔</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Thông tin chi tiết mã giảm giá */}
          <div className={styles["section-title"] + " mb-3"}>
            2. Thông tin mã giảm giá
          </div>
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                className="alert alert-danger d-flex align-items-center gap-2"
                style={{ fontWeight: 500 }}
              >
                <ExclamationCircleOutlined
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                {error}
              </div>
            )}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>
                  Mã giảm giá <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${error && (!form.discountCode.trim() || (form.discountCode.trim().length < 5)) ? "is-invalid" : ""}`}
                  name="discountCode"
                  value={form.discountCode}
                  onChange={handleChange}
                  placeholder="SALE50"
                  required
                  maxLength={30}
                  autoComplete="off"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Giảm 50% đơn hàng"
                  maxLength={80}
                  autoComplete="off"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Loại giảm giá | Mức giảm</label>
                <div className={styles["discount-type-input-group"]}>
                  <select
                    className={"form-select " + styles["discount-type-select"]}
                    value={discountType}
                    onChange={handleDiscountTypeChange}
                  >
                    <option value="amount">Theo số tiền</option>
                    <option value="percent">Theo phần trăm</option>
                  </select>
                  <input
                    type="number"
                    className={`form-control ${styles["discount-type-amount-input"]
                      }
                        ${error &&
                        ((discountType === "amount" &&
                          (!form.amount || form.amount < 1)) ||
                          (discountType === "percent" &&
                            (!form.percent ||
                              form.percent < 1 ||
                              form.percent > 100)))
                        ? "is-invalid"
                        : ""
                      }`}
                    min={discountType === "percent" ? 1 : 1000}
                    max={discountType === "percent" ? 100 : undefined}
                    placeholder="Nhập vào"
                    value={
                      discountType === "amount"
                        ? form.amount ?? ""
                        : form.percent ?? ""
                    }
                    onChange={handleDiscountValueChange}
                  />
                  <span className={styles["discount-type-suffix"]}>
                    {discountType === "percent" ? "%" : "đ"}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Giá trị đơn hàng tối thiểu</label>
                <input
                  type="number"
                  className="form-control"
                  name="minOrderValue"
                  value={form.minOrderValue ?? ""}
                  onChange={handleChange}
                  placeholder="Nhập số tiền tối thiểu"
                  min={0}
                />
              </div>
              {discountType === "percent" && (
                <div className="col-md-4 mb-3">
                  <label>Số tiền giảm tối đa (cho voucher %)</label>
                  <div className="d-flex align-items-center">
                    <div className="form-check mr-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="maxDiscountLimit"
                        id="limitMaxDiscount"
                        value="limited"
                        checked={form.maxDiscount !== null}
                        onChange={() => {
                          setForm((f) => ({ ...f!, maxDiscount: 0 }));
                          setMaxDiscountLimit("limited");
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="limitMaxDiscount"
                      >
                        Giới hạn
                      </label>
                    </div>
                    <div className="form-check mr-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="maxDiscountLimit"
                        id="unlimitMaxDiscount"
                        value="unlimited"
                        checked={form.maxDiscount === null}
                        onChange={() => {
                          setForm((f) => ({ ...f!, maxDiscount: null }));
                          setMaxDiscountLimit("unlimited");
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="unlimitMaxDiscount"
                      >
                        Không giới hạn
                      </label>
                    </div>
                    {form.maxDiscount !== null && (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          name="maxDiscount"
                          value={form.maxDiscount ?? ""}
                          onChange={handleChange}
                          placeholder="Nhập số tiền"
                          min={0}
                          style={{ width: 160, marginLeft: 16 }}
                        />
                        <span style={{ marginLeft: 8 }}>đ</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className="col-md-4 mb-3">
                <label>Số lượt sử dụng tối đa</label>
                <input
                  type="number"
                  className="form-control"
                  name="usageLimit"
                  value={form.usageLimit ?? ""}
                  onChange={handleChange}
                  placeholder="100, vô hạn"
                  min={0}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>
                  Thời gian lưu mã giảm giá{" "}
                  <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="date"
                    className={`form-control ${error && (!form.startDate || !form.endDate)
                      ? "is-invalid"
                      : ""
                      }`}
                    name="startDate"
                    value={formatDateInput(form.startDate)}
                    onChange={handleChange}
                    required
                    style={{ maxWidth: 160 }}
                  />
                  <span className="mx-2">—</span>
                  <input
                    type="date"
                    className={`form-control ${error && (!form.startDate || !form.endDate)
                      ? "is-invalid"
                      : ""
                      }`}
                    name="endDate"
                    value={formatDateInput(form.endDate)}
                    onChange={handleChange}
                    required
                    style={{ maxWidth: 160 }}
                  />
                </div>
              </div>
            </div>

            <SectionApplyTarget
              targetType={form.targetType}
              selectedCategoryIds={categorySelect.selectedCategoryIds}
              selectedProductIds={productSelect.selectedProductIds}
              categories={categories}
              products={products}
              openCategoryModal={categorySelect.openCategoryModal}
              openProductModal={productSelect.openProductModal}
              onRemoveCategory={categorySelect.removeCategory}
              onRemoveProduct={productSelect.removeProduct}
              getCategoryName={getCategoryName}
              getProduct={getProduct}
              touched={categoryTouched}
            />

            <div className="form-group mt-4 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-cancel mr-2"
                onClick={() => router.back()}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-save" disabled={submitting}>
                {submitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ProductSelectModal
        show={productSelect.showProductModal}
        onClose={productSelect.closeProductModal}
        onSave={productSelect.saveSelectedProducts}
        products={products}
        categories={categories}
        selectedIds={productSelect.selectedProductIds}
      />

      <CategorySelectModal
        show={categorySelect.showCategoryModal}
        onClose={categorySelect.closeCategoryModal}
        onSave={categorySelect.saveSelectedCategories}
        categories={categories}
        selectedIds={categorySelect.selectedCategoryIds}
      />
    </main>
  );
}