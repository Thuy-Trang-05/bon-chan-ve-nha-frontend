/**
 * NhanTin.jsx — Giao diện trang "Nhắn tin trực tiếp giữa người dùng"
 * -----------------------------------------------------------------
 * Trang này phục vụ UC-18 (Nhắn tin trực tiếp, thuộc phạm vi mở rộng)
 * ở Chương 3. Trang chỉ dành cho Người dùng đã đăng nhập — giống
 * DangTin.jsx và TrangCaNhan.jsx, cần kiểm tra JWT trước khi hiển thị
 * trong dự án thật, chưa xử lý ở file preview này.
 *
 * Ghi chú tích hợp API thật (Backend FastAPI):
 *   - Xem 1 hội thoại: GET /api/tin-nhan/hoi-thoai/{tin_dang_id}/{nguoi_kia_id}
 *   - Gửi tin nhắn:     POST /api/tin-nhan
 *                       body: { tin_dang_id, nguoi_nhan_id, noi_dung }
 *
 *   LƯU Ý QUAN TRỌNG: Backend hiện tại CHƯA có sẵn endpoint liệt kê
 *   "tất cả hội thoại của tôi" (để hiển thị cột danh sách bên trái).
 *   Cần bổ sung thêm, ví dụ GET /api/tin-nhan/hoi-thoai-cua-toi, trả
 *   về mỗi hội thoại kèm tin nhắn cuối cùng và số tin chưa đọc. Trang
 *   này đang dùng DANH_SACH_HOI_THOAI mẫu bên dưới để xem trước giao
 *   diện trong lúc chờ bổ sung endpoint đó.
 *
 *   Backend hiện xử lý nhắn tin theo kiểu REST thông thường (gửi =
 *   POST, xem = GET), chưa dùng WebSocket thời gian thực (đã ghi chú
 *   ở mục 6.3 - Hướng phát triển). Vì vậy trong dự án thật, danh sách
 *   tin nhắn nên được làm mới định kỳ bằng setInterval() gọi lại GET,
 *   thay vì chờ tin nhắn tự đẩy về như ứng dụng chat thật.
 */

import React, { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "./api";
import { useNguoiDung } from "./NguoiDungContext";
import {
  PawPrint,
  ArrowLeft,
  Send,
  Search,
  CheckCheck,
  Check,
  MapPin,
  MessageCircle,
} from "lucide-react";

/* ---------------------------------------------------------------
   1. DỮ LIỆU MẪU
   Trong dự án thật, DANH_SACH_HOI_THOAI sẽ lấy từ API liệt kê hội
   thoại (xem ghi chú ở đầu file), còn tin nhắn của hội thoại đang mở
   sẽ lấy từ GET /api/tin-nhan/hoi-thoai/{tin_dang_id}/{nguoi_kia_id}.
---------------------------------------------------------------- */
const DANH_SACH_HOI_THOAI = [
  {
    id: 1,
    tinDangId: 101,
    tieuDeTin: "Chó Poodle màu nâu bị lạc gần chợ Đông Ba",
    nguoiKiaId: 12,
    tenNguoiKia: "Lê Minh Anh",
    tinNhanCuoi: "Dạ em thấy đúng con này rồi ạ, để em gửi thêm ảnh cho chị nhé",
    cuaToi: false,
    thoiGian: "5 phút trước",
    soChuaDoc: 2,
    mauNen: "from-amber-200 to-amber-100",
  },
  {
    id: 2,
    tinDangId: 104,
    tieuDeTin: "Mèo Anh lông ngắn lạc gần Thành Nội",
    nguoiKiaId: 8,
    tenNguoiKia: "Phạm Gia Bảo",
    tinNhanCuoi: "Cảm ơn bạn nhiều, mình sẽ ra nhận bé chiều nay",
    cuaToi: true,
    thoiGian: "2 giờ trước",
    soChuaDoc: 0,
    mauNen: "from-sky-200 to-sky-100",
  },
  {
    id: 3,
    tinDangId: 97,
    tieuDeTin: "Chó Corgi tên Bún đi lạc khu vực Kim Long",
    nguoiKiaId: 21,
    tenNguoiKia: "Ngô Thảo Vy",
    tinNhanCuoi: "Bạn ơi bé còn ở đó không, mình đến ngay được không ạ?",
    cuaToi: false,
    thoiGian: "Hôm qua",
    soChuaDoc: 0,
    mauNen: "from-rose-200 to-rose-100",
  },
];

// Tin nhắn mẫu, ứng với hội thoại có id = 1 ở trên.
// Khóa "cuaToi: true" nghĩa là tin nhắn do người đang đăng nhập gửi.
const TIN_NHAN_MAU = {
  1: [
    { id: 1, cuaToi: false, noiDung: "Chào bạn, mình thấy tin đăng chó Poodle bị lạc của bạn", gui_luc: "09:12", daDoc: true },
    { id: 2, cuaToi: false, noiDung: "Mình vừa gặp một bé giống y vậy ở gần cầu Trường Tiền, cách chợ Đông Ba không xa", gui_luc: "09:13", daDoc: true },
    { id: 3, cuaToi: true, noiDung: "Ôi thật ạ? Bé có đeo vòng cổ màu đỏ không anh/chị?", gui_luc: "09:20", daDoc: true },
    { id: 4, cuaToi: false, noiDung: "Dạ em thấy đúng con này rồi ạ, để em gửi thêm ảnh cho chị nhé", gui_luc: "09:24", daDoc: false },
  ],
};

const NGUOI_DUNG_HIEN_TAI_ID = 1; // demo: id người đang đăng nhập

/* ---------------------------------------------------------------
   2. COMPONENT NHỎ: Một dòng trong danh sách hội thoại
---------------------------------------------------------------- */
function DongHoiThoai({ hoiThoai, dangChon, onChon }) {
  return (
    <button
      onClick={() => onChon(hoiThoai)}
      className={
        "w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-colors " +
        (dangChon ? "bg-[#E1F0EA]" : "hover:bg-[#FBF6EA]")
      }
    >
      <div
        className={
          "h-11 w-11 rounded-full bg-gradient-to-br shrink-0 flex items-center justify-center text-sm font-bold text-white " +
          hoiThoai.mauNen
        }
      >
        {hoiThoai.tenNguoiKia.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#2B2420] truncate">
            {hoiThoai.tenNguoiKia}
          </p>
          <span className="text-[11px] text-[#B9AE95] shrink-0">{hoiThoai.thoiGian}</span>
        </div>
        <p className="text-[11px] text-[#1F6F5C] font-medium truncate flex items-center gap-1 mt-0.5">
          <PawPrint className="h-3 w-3 shrink-0" />
          {hoiThoai.tieuDeTin}
        </p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-xs text-[#8A8072] truncate">
            {hoiThoai.cuaToi && <span className="text-[#B9AE95]">Bạn: </span>}
            {hoiThoai.tinNhanCuoi}
          </p>
          {hoiThoai.soChuaDoc > 0 && (
            <span
              style={{ backgroundColor: "#C1502E", color: "#FFFFFF", minWidth: "20px" }}
              className="shrink-0 h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center"
            >
              {hoiThoai.soChuaDoc}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------
   3. COMPONENT NHỎ: Một bong bóng tin nhắn
---------------------------------------------------------------- */
function BongBongTinNhan({ tin }) {
  return (
    <div className={"flex " + (tin.cuaToi ? "justify-end" : "justify-start")}>
      <div
        style={tin.cuaToi ? { backgroundColor: "#1F6F5C", color: "#FFFFFF", maxWidth: "70%" } : { maxWidth: "70%" }}
        className={
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed " +
          (tin.cuaToi
            ? "rounded-br-sm"
            : "bg-white border border-[#F0E4C4] text-[#2B2420] rounded-bl-sm")
        }
      >
        <p>{tin.noiDung}</p>
        <div
          className={
            "flex items-center gap-1 mt-1 text-[10px] " +
            (tin.cuaToi ? "justify-end" : "text-[#B9AE95]")
          }
          style={tin.cuaToi ? { opacity: 0.75 } : undefined}
        >
          {tin.gui_luc}
          {tin.cuaToi && (tin.daDoc ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   4. COMPONENT CHÍNH: Trang Nhắn tin
---------------------------------------------------------------- */
export default function NhanTin() {
  const { nguoiDung } = useNguoiDung();
  const [danhSachHoiThoai, setDanhSachHoiThoai] = useState([]);
  const [dangTaiHoiThoai, setDangTaiHoiThoai] = useState(true);
  const [loiHoiThoai, setLoiHoiThoai] = useState("");
  const [hoiThoaiDangChon, setHoiThoaiDangChon] = useState(null);
  const [tinNhanHienTai, setTinNhanHienTai] = useState([]);
  const [dangTaiTinNhan, setDangTaiTinNhan] = useState(false);
  const [tuKhoaTimHoiThoai, setTuKhoaTimHoiThoai] = useState("");
  const [noiDungDangNhap, setNoiDungDangNhap] = useState("");
  const [hienThiChatOMobile, setHienThiChatOMobile] = useState(false);
  const cuoiDanhSachTinNhanRef = useRef(null);

  const [thamSo] = useSearchParams();

  // Tải danh sách hội thoại khi mở trang. Nếu trang được mở kèm tham số
  // (?tinDangId=...&nguoiKiaId=...) — tức bấm "Nhắn tin" từ trang Chi
  // tiết tin đăng — tự chọn đúng hội thoại đó; nếu 2 người CHƯA từng
  // nhắn tin (nên chưa có trong danh sách trả về từ Backend), tự tạo 1
  // "hội thoại nháp" ở đầu danh sách để người dùng gõ tin nhắn đầu tiên.
  useEffect(() => {
    const tinDangIdThamSo = thamSo.get("tinDangId");
    const nguoiKiaIdThamSo = thamSo.get("nguoiKiaId");

    api
      .danhSachHoiThoaiCuaToi()
      .then((ds) => {
        if (tinDangIdThamSo && nguoiKiaIdThamSo) {
          const idCanTim = `${tinDangIdThamSo}-${nguoiKiaIdThamSo}`;
          const daCoSan = ds.find((h) => h.id === idCanTim);
          if (daCoSan) {
            setDanhSachHoiThoai(ds);
            setHoiThoaiDangChon(daCoSan);
          } else {
            const hoiThoaiNhap = {
              id: idCanTim,
              tinDangId: Number(tinDangIdThamSo),
              nguoiKiaId: Number(nguoiKiaIdThamSo),
              tenNguoiKia: thamSo.get("tenNguoiKia") || "Người dùng",
              tieuDeTin: thamSo.get("tieuDeTin") || "",
              tinNhanCuoi: "",
              cuaToi: false,
              thoiGian: "Cuộc trò chuyện mới",
              soChuaDoc: 0,
              mauNen: "from-amber-200 to-amber-100",
            };
            setDanhSachHoiThoai([hoiThoaiNhap, ...ds]);
            setHoiThoaiDangChon(hoiThoaiNhap);
          }
        } else {
          setDanhSachHoiThoai(ds);
          if (ds.length > 0) setHoiThoaiDangChon(ds[0]);
        }
      })
      .catch((loi) => setLoiHoiThoai(loi.message))
      .finally(() => setDangTaiHoiThoai(false));
  }, []);

  // Mỗi khi đổi hội thoại đang chọn, tải lại đúng tin nhắn của hội thoại đó
  useEffect(() => {
    if (!hoiThoaiDangChon || !nguoiDung) return;
    setDangTaiTinNhan(true);
    api
      .xemHoiThoai(hoiThoaiDangChon.tinDangId, hoiThoaiDangChon.nguoiKiaId, nguoiDung.nguoiDungId)
      .then(setTinNhanHienTai)
      .catch(() => setTinNhanHienTai([]))
      .finally(() => setDangTaiTinNhan(false));
  }, [hoiThoaiDangChon, nguoiDung]);

  // Tự phát hiện màn hình nhỏ bằng JS thay vì chỉ dựa vào class Tailwind
  // "sm:" — vì một số môi trường xem trước không áp dụng đúng breakpoint
  // của Tailwind, khiến cột chat bị ẩn luôn kể cả trên màn hình lớn.
  const [manHinhNho, setManHinhNho] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    function xuLyThayDoiKichThuoc() {
      setManHinhNho(window.innerWidth < 640);
    }
    window.addEventListener("resize", xuLyThayDoiKichThuoc);
    return () => window.removeEventListener("resize", xuLyThayDoiKichThuoc);
  }, []);

  // Trên màn hình nhỏ: chỉ hiện 1 cột tại một thời điểm (danh sách hoặc chat).
  // Trên màn hình lớn: luôn hiện cả 2 cột cùng lúc.
  const hienCotTrai = !manHinhNho || !hienThiChatOMobile;
  const hienCotPhai = !manHinhNho || hienThiChatOMobile;

  // Tự cuộn xuống tin nhắn mới nhất mỗi khi đổi hội thoại hoặc có tin mới
  useEffect(() => {
    cuoiDanhSachTinNhanRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tinNhanHienTai.length, hoiThoaiDangChon]);

  const hoiThoaiHienThi = danhSachHoiThoai.filter((ht) => {
    const tuKhoa = tuKhoaTimHoiThoai.trim().toLowerCase();
    if (!tuKhoa) return true;
    return (
      ht.tenNguoiKia.toLowerCase().includes(tuKhoa) ||
      ht.tieuDeTin.toLowerCase().includes(tuKhoa)
    );
  });

  function chonHoiThoai(hoiThoai) {
    setHoiThoaiDangChon(hoiThoai);
    setHienThiChatOMobile(true);
  }

  async function guiTinNhan(e) {
    e.preventDefault();
    const noiDung = noiDungDangNhap.trim();
    if (!noiDung || !hoiThoaiDangChon) return;

    setNoiDungDangNhap(""); // xóa ô nhập ngay để cảm giác phản hồi nhanh
    try {
      const tinNhanMoi = await api.guiTinNhan({
        tinDangId: hoiThoaiDangChon.tinDangId,
        nguoiNhanId: hoiThoaiDangChon.nguoiKiaId,
        noiDung,
      });
      setTinNhanHienTai((truoc) => [...truoc, tinNhanMoi]);
    } catch (loi) {
      alert("Gửi tin nhắn thất bại: " + loi.message);
      setNoiDungDangNhap(noiDung); // trả lại nội dung để người dùng gửi lại
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
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-[#1F6F5C]">
            <PawPrint className="h-6 w-6" />
            Bốn Chân Về Nhà
          </Link>
          <span className="text-sm font-semibold text-[#7A6F5D]">Nhắn tin</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-6">
        <div
          className="bg-white rounded-3xl border border-[#F0E4C4] shadow-sm overflow-hidden flex"
          style={{ height: "75vh", minHeight: "520px" }}
        >
          {/* ============ CỘT TRÁI: DANH SÁCH HỘI THOẠI ============ */}
          <div
            className="border-r border-[#F0E4C4] flex-col shrink-0"
            style={{
              display: hienCotTrai ? "flex" : "none",
              width: manHinhNho ? "100%" : "320px",
            }}
          >
            <div className="p-4 border-b border-[#F0E4C4]">
              <h1 className="font-display font-bold text-lg text-[#2B2420] mb-3">
                Hội thoại
              </h1>
              <div className="relative">
                <Search className="h-4 w-4 text-[#B9AE95] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tuKhoaTimHoiThoai}
                  onChange={(e) => setTuKhoaTimHoiThoai(e.target.value)}
                  placeholder="Tìm theo tên hoặc tin đăng..."
                  className="w-full rounded-xl border border-[#F0E4C4] bg-[#FBF6EA] pl-9 pr-3 py-2 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {dangTaiHoiThoai ? (
                <p className="text-center text-xs text-[#8A8072] py-10">Đang tải hội thoại...</p>
              ) : loiHoiThoai ? (
                <p className="text-center text-xs text-[#C1502E] py-10 px-4">{loiHoiThoai}</p>
              ) : hoiThoaiHienThi.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <MessageCircle className="h-8 w-8 text-[#E9E2D3] mx-auto mb-2" />
                  <p className="text-xs text-[#8A8072]">Không tìm thấy hội thoại phù hợp.</p>
                </div>
              ) : (
                hoiThoaiHienThi.map((ht) => (
                  <DongHoiThoai
                    key={ht.id}
                    hoiThoai={ht}
                    dangChon={hoiThoaiDangChon?.id === ht.id}
                    onChon={chonHoiThoai}
                  />
                ))
              )}
            </div>
          </div>

          {/* ============ CỘT PHẢI: KHUNG CHAT ============ */}
          <div
            className="flex-1 flex-col min-w-0"
            style={{ display: hienCotPhai ? "flex" : "none" }}
          >
            {!hoiThoaiDangChon ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <MessageCircle className="h-10 w-10 text-[#E9E2D3] mb-3" />
                <p className="text-sm text-[#8A8072]">
                  Chọn một hội thoại bên trái để bắt đầu nhắn tin.
                </p>
              </div>
            ) : (
              <>
                {/* ---- Header khung chat ---- */}
                <div className="flex items-center gap-3 p-4 border-b border-[#F0E4C4]">
                  {manHinhNho && (
                    <button
                      onClick={() => setHienThiChatOMobile(false)}
                      className="text-[#7A6F5D]"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  )}
                  <div
                    className={
                      "h-10 w-10 rounded-full bg-gradient-to-br shrink-0 flex items-center justify-center text-sm font-bold text-white " +
                      hoiThoaiDangChon.mauNen
                    }
                  >
                    {hoiThoaiDangChon.tenNguoiKia.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2B2420] truncate">
                      {hoiThoaiDangChon.tenNguoiKia}
                    </p>
                    <Link
                      to={`/tin/${hoiThoaiDangChon.tinDangId}`}
                      className="text-xs text-[#1F6F5C] font-medium flex items-center gap-1 hover:underline truncate"
                    >
                      <MapPin className="h-3 w-3 shrink-0" />
                      {hoiThoaiDangChon.tieuDeTin}
                    </Link>
                  </div>
                </div>

                {/* ---- Danh sách tin nhắn ---- */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#FDF9F0]">
                  {dangTaiTinNhan ? (
                    <p className="text-center text-xs text-[#8A8072] mt-6">Đang tải tin nhắn...</p>
                  ) : tinNhanHienTai.length === 0 ? (
                    <p className="text-center text-xs text-[#B9AE95] mt-6">
                      Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!
                    </p>
                  ) : (
                    tinNhanHienTai.map((tin) => <BongBongTinNhan key={tin.id} tin={tin} />)
                  )}
                  <div ref={cuoiDanhSachTinNhanRef} />
                </div>

                {/* ---- Ô nhập tin nhắn ---- */}
                <form
                  onSubmit={guiTinNhan}
                  className="border-t border-[#F0E4C4]"
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px" }}
                >
                  <input
                    type="text"
                    value={noiDungDangNhap}
                    onChange={(e) => setNoiDungDangNhap(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="border border-[#F0E4C4] bg-[#FBF6EA]"
                    style={{
                      flex: "1 1 auto",
                      minWidth: 0,
                      borderRadius: "12px",
                      padding: "10px 16px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!noiDungDangNhap.trim()}
                    style={{
                      height: "40px",
                      width: "40px",
                      flex: "0 0 40px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: noiDungDangNhap.trim() ? "#1F6F5C" : "#D8CFB8",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: noiDungDangNhap.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
