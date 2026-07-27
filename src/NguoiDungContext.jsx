/**
 * NguoiDungContext.jsx — Trạng thái đăng nhập dùng chung, nối Backend thật
 * -----------------------------------------------------------------
 * Trước đây file này chỉ giữ trạng thái trong bộ nhớ (useState), mất
 * hết khi F5 lại trang, và dangNhap()/dangXuat() không gọi API thật.
 *
 * Nay:
 *   - JWT được lưu vào localStorage (qua api.js: luuToken/xoaToken),
 *     nên F5 lại trang KHÔNG bị đăng xuất — đúng hành vi 1 web thật.
 *   - Lúc App khởi động, nếu có sẵn token trong localStorage, tự gọi
 *     GET /api/nguoi-dung/toi để lấy lại thông tin người dùng — đây
 *     chính là điều mà comment cũ ở đầu TrangAdmin.jsx từng nói:
 *     "kiểm tra role trong JWT trước khi hiển thị".
 *   - dangNhap(token, thongTinNguoiDung): gọi SAU KHI DangNhapDangKy.jsx
 *     đã gọi api.dangNhap()/api.dangKy() thành công — Context chỉ lưu
 *     lại kết quả, không tự gọi API xác thực.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, layTokenDaLuu, luuToken, xoaToken } from "./api";

const NguoiDungContext = createContext(null);

export function NguoiDungProvider({ children }) {
  const [nguoiDung, setNguoiDung] = useState(null);
  const [dangTaiPhienDangNhap, setDangTaiPhienDangNhap] = useState(true);

  // Chạy đúng 1 lần lúc App khởi động: nếu có token cũ trong trình
  // duyệt, thử lấy lại thông tin người dùng tương ứng.
  useEffect(() => {
    const token = layTokenDaLuu();
    if (!token) {
      setDangTaiPhienDangNhap(false);
      return;
    }
    api
      .layThongTinCuaToi()
      .then((duLieu) => setNguoiDung(duLieu))
      .catch(() => {
        // Token hết hạn hoặc không hợp lệ — xóa để tránh gọi API lặp lại lỗi
        xoaToken();
        setNguoiDung(null);
      })
      .finally(() => setDangTaiPhienDangNhap(false));
  }, []);

  function dangNhap(token, thongTinNguoiDung) {
    luuToken(token);
    setNguoiDung(thongTinNguoiDung);
  }

  function dangXuat() {
    xoaToken();
    setNguoiDung(null);
  }

  function capNhatHoSo(thongTinMoi) {
    setNguoiDung((truoc) => (truoc ? { ...truoc, ...thongTinMoi } : truoc));
  }

  const gia_tri = {
    nguoiDung,
    daDangNhap: nguoiDung !== null,
    laAdmin: nguoiDung?.vaiTro === "admin",
    dangTaiPhienDangNhap,
    dangNhap,
    dangXuat,
    capNhatHoSo,
  };

  return (
    <NguoiDungContext.Provider value={gia_tri}>
      {children}
    </NguoiDungContext.Provider>
  );
}

export function useNguoiDung() {
  const ctx = useContext(NguoiDungContext);
  if (!ctx) {
    throw new Error("useNguoiDung() phải được gọi bên trong <NguoiDungProvider>.");
  }
  return ctx;
}
