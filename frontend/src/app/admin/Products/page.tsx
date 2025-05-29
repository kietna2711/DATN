"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";

type Product = {
  id: string;
  name: string;
  image: string;
  desc: string;
  price: number;
  quantity: number;
  size: string;
  category: string;
  status: string;
  checked: boolean;
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [clock, setClock] = useState("");
  const [form, setForm] = useState<Omit<Product, "checked">>({
    id: "",
    name: "",
    image: "",
    desc: "",
    price: 0,
    quantity: 0,
    size: "",
    category: "",
    status: "Còn hàng",
  });

  // Fetch sản phẩm từ backend nodejs
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data = await res.json();

        // Flatten: mỗi variant là một Product
        const mappedProducts: Product[] = [];
        data.forEach((prod: any) => {
          prod.variants.forEach((variant: any) => {
            mappedProducts.push({
              id: prod._id + "-" + variant._id,
              name: prod.name,
image: prod.image.startsWith("http")
  ? prod.image
  : `http://localhost:3000/images/${prod.image}`,

              desc: prod.description,
              price: variant.price,
              quantity: variant.quantity,
              size: variant.size,
              category: prod.categoryId?.name || "",
              status: variant.quantity > 0 ? "Còn hàng" : "Hết hàng",
              checked: false,
            });
          });
        });

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      }
    }
    fetchProducts();
  }, []);

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

  // Chọn tất cả
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setProducts(products =>
      products.map(p => ({ ...p, checked: !selectAll }))
    );
  };

  // Chọn từng dòng
  const handleCheck = (idx: number) => {
    setProducts(products =>
      products.map((p, i) =>
        i === idx ? { ...p, checked: !p.checked } : p
      )
    );
  };

  // Xóa sản phẩm
  const handleDelete = (idx: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products => products.filter((_, i) => i !== idx));
    }
  };

  // Xóa tất cả sản phẩm đã chọn
  const handleDeleteAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) {
      setProducts(products => products.filter(p => !p.checked));
      setSelectAll(false);
    }
  };

  // Mở modal sửa
  const openEditModal = (idx: number) => {
    const p = products[idx];
    setEditIndex(idx);
    setForm({
      id: p.id,
      name: p.name,
      image: p.image,
      desc: p.desc,
      price: p.price,
      quantity: p.quantity,
      size: p.size,
      category: p.category,
      status: p.status,
    });
    setShowModal(true);
  };

  // Xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as any;
    if (type === "file") {
      setForm({ ...form, image: files[0] ? URL.createObjectURL(files[0]) : "" });
    } else if (type === "number") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Lưu sản phẩm (chỉ sửa trên frontend)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      setProducts(products =>
        products.map((p, i) =>
          i === editIndex ? { ...p, ...form } : p
        )
      );
    }
    setShowModal(false);
  };

  // In bảng sản phẩm
  const handlePrint = () => {
    const printContent = document.getElementById("sampleTable")?.outerHTML;
    if (printContent) {
      const win = window.open('', '', 'height=700,width=700');
      if (win) {
        win.document.write(printContent);
        win.document.close();
        win.print();
      }
    }
  };

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số sản phẩm mỗi trang

  // Tính toán phân trang
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentProducts = products.slice(startIdx, endIdx);

  return (
    <div className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb side">
          <li className="breadcrumb-item active"><a href="#"><b>Danh sách sản phẩm</b></a></li>
        </ul>
        <div id="clock">{clock}</div>
      </div>
      <div className="row element-button">
        <div className="col-sm-2">
          <a className="btn btn-add btn-sm" href="/form-add-san-pham.html" title="Thêm">
            <i className="fas fa-plus"></i> Tạo mới sản phẩm
          </a>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-delete btn-sm" type="button" title="Xóa tất cả" onClick={handleDeleteAll}>
            <i className="fas fa-trash-alt"></i> Xóa tất cả
          </button>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-delete btn-sm print-file" type="button" title="In" onClick={handlePrint}>
            <i className="fas fa-print"></i> In dữ liệu
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <div className="tile-body">
              <table className="table table-hover table-bordered" id="sampleTable">
                <thead>
                  <tr>
                    <th style={{ width: "10px" }}>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th>ID sản phẩm</th>
                    <th style={{ width: "150px" }}>Tên sản phẩm</th>
                    <th style={{ width: "20px" }}>Ảnh</th>
                    <th style={{ width: "300px" }}>Mô tả</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Size</th>
                    <th>Danh mục</th>
                    <th>Trạng thái</th>
                    <th style={{ width: "100px" }}>Tính năng</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((p, idx) => (
                    <tr key={p.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={p.checked}
                          onChange={() => handleCheck(startIdx + idx)}
                        />
                      </td>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>
                        <img className="img-card-person" src={p.image} alt="" width={50} />
                      </td>
                      <td>{p.desc}</td>
                      <td>{p.price.toLocaleString()}đ</td>
                      <td>{p.quantity}</td>
                      <td>{p.size}</td>
                      <td>{p.category}</td>
                      <td>{p.status}</td>
                      <td className="table-td-center">
                        <button
                          className="btn btn-primary btn-sm trash"
                          type="button"
                          title="Xóa"
                          onClick={() => handleDelete(startIdx + idx)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                        <button
                          className="btn btn-primary btn-sm edit"
                          type="button"
                          title="Sửa"
                          onClick={() => openEditModal(startIdx + idx)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentProducts.length === 0 && (
                    <tr>
                      <td colSpan={11} className="text-center">Không có sản phẩm nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Modal Sửa Sản Phẩm */}
              {showModal && (
                <div className="modal d-block" tabIndex={-1} role="dialog" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                          <h5 className="modal-title">Chỉnh sửa thông tin sản phẩm</h5>
                          <button type="button" className="close" onClick={() => setShowModal(false)}>
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="row">
                            <div className="form-group col-md-6">
                              <label className="control-label">ID sản phẩm</label>
                              <input className="form-control" type="text" required value={form.id} disabled />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="control-label">Tên sản phẩm</label>
                              <input className="form-control" type="text" required name="name" value={form.name} onChange={handleChange} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="control-label">Giá</label>
                              <input className="form-control" type="number" required name="price" value={form.price} onChange={handleChange} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="control-label">Số lượng</label>
                              <input className="form-control" type="number" required name="quantity" value={form.quantity} onChange={handleChange} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="control-label">Size</label>
                              <input className="form-control" type="text" required name="size" value={form.size} onChange={handleChange} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="control-label">Danh mục</label>
                              <input className="form-control" type="text" required name="category" value={form.category} onChange={handleChange} />
                            </div>
                            <div className="form-group col-md-6">
                              <label className="control-label">Trạng thái</label>
                              <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                                <option>Còn hàng</option>
                                <option>Hết hàng</option>
                                <option>Ngừng kinh doanh</option>
                              </select>
                            </div>
                            <div className="form-group col-md-6">
                              <label className="control-label">Ảnh</label>
                              <input className="form-control" type="file" name="img" onChange={handleChange} />
                              {form.image && (
                                <img src={form.image} alt="Ảnh sản phẩm" width={50} className="mt-2" />
                              )}
                            </div>
                            <div className="form-group col-md-12">
                              <label className="control-label">Mô tả</label>
                              <textarea className="form-control" required name="desc" value={form.desc} onChange={handleChange} />
                            </div>
                          </div>
                          <a href="#" style={{ float: "right", fontWeight: 600, color: "#ea0000" }}>Chỉnh sửa nâng cao</a>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-save" type="submit">Lưu lại</button>
                          <button className="btn btn-cancel" type="button" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
              {/* End Modal */}
              {/* Phân trang và tổng số */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Hiện {totalItems === 0 ? 0 : startIdx + 1} đến {Math.min(endIdx, totalItems)} của {totalItems} sản phẩm
                </div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        Lùi
                      </button>
                    </li>
                    {/* Hiển thị tối đa 3 số trang */}
                    {(() => {
                      let start = Math.max(1, currentPage - 1);
                      let end = Math.min(totalPages, start + 2);
                      if (end - start < 2) start = Math.max(1, end - 2);
                      const pages = [];
                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <li key={i} className={`page-item${currentPage === i ? " active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i)}>
                              {i}
                            </button>
                          </li>
                        );
                      }
                      return pages;
                    })()}
                    <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Tiếp
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}