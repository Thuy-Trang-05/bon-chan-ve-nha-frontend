/**
 * ThongBao.jsx — Giao diện trang "Thông báo"
 * -----------------------------------------------------------------
 * Trang này hiển thị danh sách thông báo của Người dùng đang đăng
 * nhập — gồm 2 loại: thông báo có tin nhắn mới (loai_thong_bao =
 * "TinNhan", tự động tạo khi có người gửi tin nhắn, xem
 * tin_nhan_router.py) và thông báo hệ thống (loai_thong_bao =
 * "HeThong", ví dụ: tin đăng bị gỡ, báo cáo đã được xử lý...).
 *
 * Ghi chú tích hợp API thật (Backend FastAPI):
 *   - Lấy danh sách:      GET   /api/thong-bao
 *   - Đánh dấu đã đọc 1:  PATCH /api/thong-bao/{id}/da-doc
 *   - Chưa có sẵn endpoint "đánh dấu tất cả đã đọc" — nút bên dưới
 *     đang giả lập bằng cách gọi PATCH lần lượt cho từng thông báo
 *     chưa đọc; nếu số lượng thông báo lớn, nên bổ sung riêng 1
 *     endpoint PATCH /api/thong-bao/danh-dau-tat-ca-da-doc để đỡ tốn
 *     nhiều lượt gọi API.
 *   - Trang này cũng cần kiểm tra JWT trước khi hiển thị, giống các
 *     trang DangTin.jsx, TrangCaNhan.jsx, NhanTin.jsx.
 *
 * Ghi chú kỹ thuật: file này ưu tiên dùng inline style cho các phần
 * bố cục/màu sắc quan trọng (thay vì chỉ dùng class Tailwind dạng
 * bg-[#hex], disabled:..., shrink-0...) vì một số class dạng đó đã
 * từng không hiển thị đúng ở môi trường xem trước của dự án (xem lại
 * các lần sửa NhanTin.jsx).
 */

import React, { useState, useEffect } from "react";
import { api } from "./api";
import { Link } from "react-router-dom";
import {
  PawPrint,
  MessageCircleHeart,
  Bell,
  CheckCheck,
  Trash2,
} from "lucide-react";

/* ---------------------------------------------------------------
   1. DỮ LIỆU MẪU
   Trong dự án thật sẽ thay bằng kết quả gọi GET /api/thong-bao.
---------------------------------------------------------------- */
const DANH_SACH_THONG_BAO_MAU = [
  {
    id: 1,
    loai: "TinNhan",
    tieuDe: "Bạn có tin nhắn mới",
    noiDung: "Về tin đăng: Chó Poodle màu nâu bị lạc gần chợ Đông Ba",
    thoiGian: "5 phút trước",
    daDoc: false,
  },
  {
    id: 2,
    loai: "HeThong",
    tieuDe: "Báo cáo của bạn đã được xử lý",
    noiDung: "Quản trị viên đã xem xét và gỡ tin đăng bạn báo cáo do nội dung sai sự thật.",
    thoiGian: "1 giờ trước",
    daDoc: false,
  },
  {
    id: 3,
    loai: "TinNhan",
    tieuDe: "Bạn có tin nhắn mới",
    noiDung: "Về tin đăng: Mèo Anh lông ngắn lạc gần Thành Nội",
    thoiGian: "3 giờ trước",
    daDoc: true,
  },
  {
    id: 4,
    loai: "HeThong",
    tieuDe: "Tin đăng của bạn sắp hết hạn hiển thị",
    noiDung: "Tin \"Chó Corgi tên Bún đi lạc khu vực Kim Long\" đã đăng hơn 30 ngày. Hãy cập nhật nếu bé vẫn chưa được tìm thấy.",
    thoiGian: "Hôm qua",
    daDoc: true,
  },
  {
    id: 5,
    loai: "HeThong",
    tieuDe: "Chào mừng bạn đến với Bốn Chân Về Nhà!",
    noiDung: "Cảm ơn bạn đã tham gia cộng đồng. Hãy hoàn thiện hồ sơ cá nhân để mọi người dễ liên hệ hơn nhé.",
    thoiGian: "3 ngày trước",
    daDoc: true,
  },
];

const MAU_SAC_THEO_LOAI = {
  TinNhan: { nen: "#FCE9E1", chu: "#C1502E" },
  HeThong: { nen: "#E1F0EA", chu: "#1F6F5C" },
};

/* ---------------------------------------------------------------
   2. COMPONENT NHỎ: Một dòng thông báo
---------------------------------------------------------------- */
function DongThongBao({ thongBao, onDanhDauDaDoc, onXoa }) {
  const mau = MAU_SAC_THEO_LOAI[thongBao.loai] || MAU_SAC_THEO_LOAI.HeThong;
  const Icon = thongBao.loai === "TinNhan" ? MessageCircleHeart : Bell;

  function xuLyBamVao() {
    if (!thongBao.daDoc) onDanhDauDaDoc(thongBao.id);
  }

  const noiDungDong = (
    <>
      <div
        style={{
          height: "40px",
          width: "40px",
          borderRadius: "9999px",
          flex: "0 0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: mau.nen,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: mau.chu }} />
      </div>

      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <p className="text-[#2B2420]" style={{ fontSize: "14px", fontWeight: 700 }}>
            {thongBao.tieuDe}
          </p>
          <span className="text-[#B9AE95]" style={{ fontSize: "11px", flexShrink: 0 }}>
            {thongBao.thoiGian}
          </span>
        </div>
        <p className="text-[#7A6F5D]" style={{ fontSize: "13px", marginTop: "2px", lineHeight: 1.5 }}>
          {thongBao.noiDung}
        </p>
      </div>

      {!thongBao.daDoc && (
        <span
          style={{
            height: "8px",
            width: "8px",
            borderRadius: "9999px",
            backgroundColor: "#C1502E",
            flexShrink: 0,
            marginTop: "4px",
          }}
        />
      )}
    </>
  );

  return (
    <div
      className="border border-[#F0E4C4]"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px",
        borderRadius: "16px",
        backgroundColor: thongBao.daDoc ? "#FFFFFF" : "#FBF6EA",
        position: "relative",
      }}
    >
      {thongBao.loai === "TinNhan" ? (
        <Link
          to="/nhan-tin"
          onClick={xuLyBamVao}
          style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: "1 1 auto", minWidth: 0, textDecoration: "none" }}
        >
          {noiDungDong}
        </Link>
      ) : (
        <div
          onClick={xuLyBamVao}
          style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: "1 1 auto", minWidth: 0, cursor: thongBao.daDoc ? "default" : "pointer" }}
        >
          {noiDungDong}
        </div>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onXoa(thongBao.id);
        }}
        title="Xóa thông báo"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          flexShrink: 0,
          color: "#D8CFB8",
        }}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   3. COMPONENT CHÍNH: Trang Thông báo
---------------------------------------------------------------- */
export default function ThongBao() {
  const [danhSach, setDanhSach] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loiTai, setLoiTai] = useState("");
  const [tabDangChon, setTabDangChon] = useState("tat_ca"); // "tat_ca" | "chua_doc"

  useEffect(() => {
    api
      .danhSachThongBao()
      .then(setDanhSach)
      .catch((loi) => setLoiTai(loi.message))
      .finally(() => setDangTai(false));
  }, []);

  const soChuaDoc = danhSach.filter((tb) => !tb.daDoc).length;

  const danhSachHienThi = danhSach.filter((tb) =>
    tabDangChon === "chua_doc" ? !tb.daDoc : true
  );

  function danhDauDaDoc(id) {
    setDanhSach((truoc) => truoc.map((tb) => (tb.id === id ? { ...tb, daDoc: true } : tb)));
    api.danhDauDaDoc(id).catch(() => {}); // giao diện đã cập nhật ngay, lỗi mạng ở đây không quan trọng bằng UX mượt
  }

  async function danhDauTatCaDaDoc() {
    const banSao = danhSach;
    setDanhSach((truoc) => truoc.map((tb) => ({ ...tb, daDoc: true })));
    try {
      await api.danhDauTatCaDaDoc();
    } catch (loi) {
      setDanhSach(banSao); // gọi API thất bại thì trả lại trạng thái cũ
      alert("Không thể đánh dấu tất cả đã đọc: " + loi.message);
    }
  }

  async function xoaThongBao(id) {
    const banSao = danhSach;
    setDanhSach((truoc) => truoc.filter((tb) => tb.id !== id));
    try {
      await api.xoaThongBao(id);
    } catch (loi) {
      setDanhSach(banSao);
      alert("Không thể xóa: " + loi.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] font-['Be_Vietnam_Pro']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Baloo 2', sans-serif; }
      `}</style>

      {/* ============ HEADER RÚT GỌN ============ */}
      <header className="sticky top-0 z-30 bg-[#FDEBC2]/90 backdrop-blur border-b border-[#F5E6BC]">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-[#1F6F5C]">
            <PawPrint className="h-6 w-6" />
            Bốn Chân Về Nhà
          </Link>
          <span className="text-sm font-semibold text-[#7A6F5D]">Thông báo</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="bg-white rounded-3xl border border-[#F0E4C4] shadow-sm" style={{ padding: "24px" }}>
          {/* ---- Tiêu đề + nút đánh dấu tất cả ---- */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
            <h1 className="font-display font-extrabold text-2xl text-[#2B2420]">
              Thông báo
              {soChuaDoc > 0 && (
                <span
                  className="text-white"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "22px",
                    height: "22px",
                    borderRadius: "9999px",
                    backgroundColor: "#C1502E",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginLeft: "8px",
                    padding: "0 6px",
                    verticalAlign: "middle",
                  }}
                >
                  {soChuaDoc}
                </span>
              )}
            </h1>

            {soChuaDoc > 0 && (
              <button
                type="button"
                onClick={danhDauTatCaDaDoc}
                className="text-[#1F6F5C]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <CheckCheck className="h-4 w-4" />
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* ---- Tab lọc ---- */}
          <div
            className="bg-[#FBF6EA] border border-[#F0E4C4]"
            style={{ display: "flex", gap: "4px", borderRadius: "12px", padding: "4px", marginBottom: "18px" }}
          >
            {[
              { key: "tat_ca", nhan: "Tất cả" },
              { key: "chua_doc", nhan: `Chưa đọc${soChuaDoc > 0 ? ` (${soChuaDoc})` : ""}` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTabDangChon(tab.key)}
                style={{
                  flex: "1 1 0%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  backgroundColor: tabDangChon === tab.key ? "#1F6F5C" : "transparent",
                  color: tabDangChon === tab.key ? "#FFFFFF" : "#7A6F5D",
                }}
              >
                {tab.nhan}
              </button>
            ))}
          </div>

          {/* ---- Danh sách thông báo ---- */}
          {dangTai ? (
            <p className="text-center text-sm text-[#8A8072] py-12">Đang tải thông báo...</p>
          ) : loiTai ? (
            <p className="text-center text-sm text-[#C1502E] py-12">{loiTai}</p>
          ) : danhSachHienThi.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 16px" }}>
              <Bell className="h-9 w-9" style={{ color: "#E9E2D3", margin: "0 auto 12px" }} />
              <p className="text-[#8A8072]" style={{ fontSize: "13px" }}>
                {tabDangChon === "chua_doc"
                  ? "Bạn đã đọc hết thông báo rồi, không còn gì mới cả."
                  : "Chưa có thông báo nào."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {danhSachHienThi.map((tb) => (
                <DongThongBao
                  key={tb.id}
                  thongBao={tb}
                  onDanhDauDaDoc={danhDauDaDoc}
                  onXoa={xoaThongBao}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
