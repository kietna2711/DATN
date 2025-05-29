"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "../admin.css";
// Nếu dùng CKEditor 4
// import CKEditor from "ckeditor4-react";

type Post = {
  id: string;
  title: string;
  category: string;
  date: string;
  visible: boolean;
};

const initialPosts: Post[] = [
  {
    id: "BV001",
    title: "10 ý tưởng trang trí phòng khách hiện đại",
    category: "Nội thất",
    date: "05/25/2025",
    visible: true,
  },
  {
    id: "BV002",
    title: "Phong thủy phòng ngủ cho gia đình trẻ",
    category: "Phong thủy",
    date: "05/20/2025",
    visible: false,
  },
];

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  // State cho form tạo bài viết
  const [form, setForm] = useState({
    title: "",
    date: "",
    thumbnail: null as File | null,
    category: "",
    content: "",
    description: "",
    seoTitle: "",
    metaDescription: "",
    tags: "",
    allowComment: false,
    priority: false,
  });

  // Xử lý toggle ẩn/hiện
  const handleToggleVisibility = (id: string) => {
    setPosts(posts =>
      posts.map(post =>
        post.id === id ? { ...post, visible: !post.visible } : post
      )
    );
  };

  // Xử lý xóa bài viết
  const handleDeletePost = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setPosts(posts => posts.filter(post => post.id !== id));
    }
  };

  // Xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as any;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Xử lý submit form (demo, chưa lưu vào bảng)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Thêm bài viết mới vào bảng (demo, chưa xử lý upload file và CKEditor)
    setPosts([
      ...posts,
      {
        id: `BV${(posts.length + 1).toString().padStart(3, "0")}`,
        title: form.title,
        category: form.category,
        date: form.date,
        visible: true,
      },
    ]);
    setForm({
      title: "",
      date: "",
      thumbnail: null,
      category: "",
      content: "",
      description: "",
      seoTitle: "",
      metaDescription: "",
      tags: "",
      allowComment: false,
      priority: false,
    });
  };

  return (
    <main className="app-content">
      <div className="app-title">
        <ul className="app-breadcrumb breadcrumb">
          <li className="breadcrumb-item">Danh sách bài viết</li>
          <li className="breadcrumb-item"><a href="#">Tạo bài viết mới</a></li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">Tạo mới bài viết</h3>
            <div className="tile-body">
              <form className="row" onSubmit={handleSubmit}>
                <div className="form-group col-md-6">
                  <label className="control-label">Tiêu đề bài viết</label>
                  <input className="form-control" type="text" name="title" value={form.title} onChange={handleChange} placeholder="Nhập tiêu đề bài viết" required />
                </div>
                <div className="form-group col-md-6">
                  <label className="control-label">Ngày đăng</label>
                  <input className="form-control" type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                  <label className="control-label">Ảnh đại diện (thumbnail)</label>
                  <input className="form-control" type="file" name="thumbnail" accept="image/*" onChange={handleChange} />
                </div>
                <div className="form-group col-md-6">
                  <label className="control-label">Danh mục</label>
                  <select className="form-control" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">-- Chọn danh mục --</option>
                    <option>Nội thất</option>
                    <option>Phong thủy</option>
                    <option>Kiến trúc</option>
                    <option>Khuyến mãi</option>
                  </select>
                </div>
                <div className="form-group col-md-12">
                  <label className="control-label">Nội dung bài viết</label>
                  {/* <CKEditor data={form.content} onChange={evt => setForm({ ...form, content: evt.editor.getData() })} /> */}
                  <textarea className="form-control" name="content" value={form.content} onChange={handleChange} placeholder="Nhập nội dung bài viết" />
                </div>
                <div className="form-group col-md-12">
                  <label className="control-label">Mô tả ngắn</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Nhập mô tả ngắn" />
                </div>
                <div className="form-group col-md-6">
                  <label className="control-label">SEO Title</label>
                  <input className="form-control" type="text" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="SEO Title" />
                </div>
                <div className="form-group col-md-6">
                  <label className="control-label">Meta Description</label>
                  <input className="form-control" type="text" name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="Meta Description" />
                </div>
                <div className="form-group col-md-6">
                  <label className="control-label">Tag / Thẻ</label>
                  <input className="form-control" type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="VD: sofa, nội thất phòng khách" />
                </div>
                <div className="form-group col-md-3">
                  <div className="form-check mt-4">
                    <input className="form-check-input" type="checkbox" name="allowComment" checked={form.allowComment} onChange={handleChange} id="allowComment" />
                    <label className="form-check-label" htmlFor="allowComment">Cho phép bình luận</label>
                  </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="form-check mt-4">
                    <input className="form-check-input" type="checkbox" name="priority" checked={form.priority} onChange={handleChange} id="priority" />
                    <label className="form-check-label" htmlFor="priority">Ưu tiên hiển thị</label>
                  </div>
                </div>
                <div className="form-group col-md-12">
                  <button className="btn btn-save" type="submit">Lưu lại</button>
                  <button className="btn btn-cancel" type="button" onClick={() => setForm({
                    title: "",
                    date: "",
                    thumbnail: null,
                    category: "",
                    content: "",
                    description: "",
                    seoTitle: "",
                    metaDescription: "",
                    tags: "",
                    allowComment: false,
                    priority: false,
                  })}>Hủy bỏ</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Danh sách bài viết */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="tile">
            <h3 className="tile-title">Danh sách bài viết</h3>
            <div className="tile-body">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tiêu đề bài viết</th>
                    <th>Danh mục</th>
                    <th>Ngày đăng</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.title}</td>
                      <td>{post.category}</td>
                      <td>{post.date}</td>
                      <td>
                        <span className={`badge ${post.visible ? "bg-success" : "bg-secondary"}`}>
                          {post.visible ? "Hiển thị" : "Đã ẩn"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-light btn-sm toggle-visibility"
                          type="button"
                          title="Ẩn/Hiện"
                          onClick={() => handleToggleVisibility(post.id)}
                        >
                          <i className={`fas ${post.visible ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm btn-delete-post"
                          type="button"
                          title="Xóa"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">Không có bài viết nào.</td>
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