/**
 * App.jsx — Điểm nối các trang của hệ thống "Bốn Chân Về Nhà"
 * -----------------------------------------------------------------
 * Trước đây TrangChu, TrangCaNhan, TrangAdmin là 3 file độc lập, không
 * trang nào biết tới trang nào — các nút "Đăng tin", avatar, logo...
 * chỉ là <button onClick={...}> rỗng hoặc <a href="#..."> trỏ vào
 * chính trang đó. File này khai báo Route cho từng trang và bọc toàn
 * bộ App trong NguoiDungProvider để trạng thái đăng nhập (avatar, tên,
 * vai trò) nhất quán khi chuyển qua lại giữa các trang.
 *
 * Lưu ý: mỗi trang vẫn nằm ở 1 file .jsx riêng như cũ (không gộp
 * chung), App.jsx chỉ import và khai báo đường dẫn.
 *
 * Kiểm soát quyền truy cập theo vai trò (Khách / Người dùng / Admin)
 * nêu trong các comment "chưa xử lý ở file preview này" của từng
 * trang cần làm ở tầng Backend (middleware kiểm tra JWT) — ở đây chỉ
 * minh họa bằng <YeuCauDangNhap> / <YeuCauAdmin> đơn giản, tương ứng
 * tiền điều kiện đã đặc tả ở Chương 3 cho từng Use Case.
 *
 * /dang-nhap và /dang-ky cùng dùng chung 1 component DangNhapDangKy —
 * component đó tự đọc URL (useLocation) để biết mở sẵn tab nào.
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { NguoiDungProvider, useNguoiDung } from "./NguoiDungContext";
import TrangChu from "./TrangChu";
import TrangCaNhan from "./TrangCaNhan";
import TrangAdmin from "./TrangAdmin";
import TimKiem from "./TimKiem";
import NhanTin from "./NhanTin";
import ThongBao from "./ThongBao";
import DangTin from "./DangTin";
import DangNhapDangKy from "./DangNhapDangKy";
import ChiTietTinDang from "./ChiTietTinDang";
import { TrangQuenMatKhauTam } from "./TrangTamThoi";

// Bảo vệ các trang chỉ dành cho Người dùng đã đăng nhập (vd: UC-06, UC-08...)
function YeuCauDangNhap({ children }) {
  const { daDangNhap, dangTaiPhienDangNhap } = useNguoiDung();
  if (dangTaiPhienDangNhap) return null; // đợi xác minh token xong, tránh đá nhầm lúc F5
  return daDangNhap ? children : <Navigate to="/dang-nhap" replace />;
}

// Bảo vệ Trang quản trị — chỉ tác nhân Admin mới truy cập được (mục 3.1)
function YeuCauAdmin({ children }) {
  const { laAdmin, dangTaiPhienDangNhap } = useNguoiDung();
  if (dangTaiPhienDangNhap) return null;
  return laAdmin ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <NguoiDungProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrangChu />} />
          <Route
            path="/ca-nhan"
            element={
              <YeuCauDangNhap>
                <TrangCaNhan />
              </YeuCauDangNhap>
            }
          />
          <Route
            path="/admin"
            element={
              <YeuCauAdmin>
                <TrangAdmin />
              </YeuCauAdmin>
            }
          />
          <Route
            path="/dang-tin"
            element={
              <YeuCauDangNhap>
                <DangTin />
              </YeuCauDangNhap>
            }
          />
          <Route path="/tim-kiem" element={<TimKiem />} />
          <Route path="/tin/:id" element={<ChiTietTinDang />} />
          <Route
            path="/nhan-tin"
            element={
              <YeuCauDangNhap>
                <NhanTin />
              </YeuCauDangNhap>
            }
          />
          <Route
            path="/thong-bao"
            element={
              <YeuCauDangNhap>
                <ThongBao />
              </YeuCauDangNhap>
            }
          />
          <Route path="/dang-nhap" element={<DangNhapDangKy />} />
          <Route path="/dang-ky" element={<DangNhapDangKy />} />
          <Route path="/quen-mat-khau" element={<TrangQuenMatKhauTam />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </NguoiDungProvider>
  );
}
