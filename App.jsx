
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

function YeuCauDangNhap({ children }) {
  const { daDangNhap, dangTaiPhienDangNhap } = useNguoiDung();
  if (dangTaiPhienDangNhap) return null;
  return daDangNhap ? children : <Navigate to="/dang-nhap" replace />;
}

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
