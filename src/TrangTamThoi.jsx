/**
 * TrangTamThoi.jsx — Các trang chưa nằm trong phạm vi sửa lần này
 * -----------------------------------------------------------------
 * Trước đây file này giữ khung tạm cho Đăng tin, Tìm kiếm, Đăng nhập,
 * Đăng ký, Chi tiết tin đăng — nay các trang đó đã có bản thật
 * (DangTin.jsx, TimKiem.jsx, DangNhapDangKy.jsx, ChiTietTinDang.jsx),
 * nên các khung tạm tương ứng đã được gỡ bỏ khỏi file này.
 *
 * Chỉ còn "Quên mật khẩu" là chưa có trang thật, giữ khung tạm ở đây
 * để nút "Quên mật khẩu?" ở DangNhapDangKy.jsx không dẫn tới link chết.
 */

import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, ArrowLeft } from "lucide-react";

function TrangDangXayDung({ tieuDe, moTa }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] font-['Be_Vietnam_Pro'] flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl border border-[#E9E2D3] p-10 max-w-md w-full text-center">
        <div className="h-14 w-14 rounded-2xl bg-[#E1F0EA] text-[#1F6F5C] flex items-center justify-center mx-auto mb-4">
          <PawPrint className="h-7 w-7" />
        </div>
        <h1 className="font-bold text-xl text-[#2B2420] mb-2">{tieuDe}</h1>
        <p className="text-sm text-[#8A8072] mb-6">{moTa}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F6F5C] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Trang chủ
        </Link>
      </div>
    </div>
  );
}

export function TrangQuenMatKhauTam() {
  return (
    <TrangDangXayDung
      tieuDe="Trang Quên mật khẩu"
      moTa="Biểu mẫu đặt lại mật khẩu qua email sẽ được xây dựng ở đây (chưa nằm trong đặc tả use case ở Chương 3, có thể bổ sung ở mục Hướng phát triển)."
    />
  );
}
