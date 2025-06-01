import { Category } from "@/app/types/categoryD";
import React from "react";

type Props = {
  categories: (Category & { checked?: boolean })[]; // đảm bảo có thuộc tính `checked`
  selectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleCheck: (_id: string) => void;
  onToggleVisibility: (_id: string) => void;
  onDelete: (_id: string) => void;
  onEdit: (_id: string) => void;
};

export const CategoryTable = ({
  categories = [],
  selectAll,
  onToggleSelectAll,
  onToggleCheck,
  onToggleVisibility,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <table className="table table-hover table-bordered">
      <thead>
        <tr>
          <th style={{ width: "10px" }}>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={onToggleSelectAll}
            />
          </th>
          <th>Tên danh mục</th>
          <th>Trạng thái</th>
          <th>Ẩn/Hiện</th>
          <th>Sửa</th>
          <th>Xóa</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((cat) => (
            <tr key={cat._id}>
              <td>
                <input
                  type="checkbox"
                  checked={cat.checked || false}
                  onChange={() => onToggleCheck(cat._id)}
                />
              </td>
              <td>{cat.name}</td>
              <td>
                <span
                  className={`badge ${cat.hidden ? "bg-secondary" : "bg-success"}`}
                >
                  {cat.hidden ? "Đã ẩn" : "Hiển thị"}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => onToggleVisibility(cat._id)}
                >
                  <i className={`fas ${cat.hidden ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => onEdit(cat._id)}
                >
                  <i className="fas fa-edit"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(cat._id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">
              Không có danh mục nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
