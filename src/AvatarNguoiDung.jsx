/**
 * AvatarNguoiDung.jsx — Avatar dùng chung cho Header và Trang cá nhân
 * -----------------------------------------------------------------
 * Trước đây góc phải Header (TrangChu) và thẻ hồ sơ (TrangCaNhan) chỉ
 * vẽ 1 vòng tròn màu chứa chữ cái đầu của tên — không có chỗ nào hiện
 * ẢNH đại diện thật, kể cả khi người dùng đã tải ảnh lên.
 *
 * Component này ưu tiên hiện ảnh (nguoiDung.anhDaiDien) nếu có; nếu
 * không có ảnh (tài khoản mới, chưa tải ảnh lên) thì mới rơi về chữ
 * cái đầu như bản cũ, để giao diện không bao giờ "trống rỗng".
 */

import React from "react";

export default function AvatarNguoiDung({ nguoiDung, kichThuoc = "h-9 w-9", coChu = "text-sm" }) {
  const ten = nguoiDung?.hoTen?.trim();
  const chuDauTien = ten ? ten.charAt(0).toUpperCase() : "?";

  if (nguoiDung?.anhDaiDien) {
    return (
      <img
        src={nguoiDung.anhDaiDien}
        alt={ten || "Ảnh đại diện"}
        className={kichThuoc + " rounded-full object-cover shrink-0 border border-[#E9E2D3]"}
      />
    );
  }

  return (
    <div
      style={{ backgroundColor: "#1F6F5C", color: "#FFFFFF" }}
      className={kichThuoc + " " + coChu + " rounded-full flex items-center justify-center font-semibold shrink-0"}
    >
      {chuDauTien}
    </div>
  );
}
