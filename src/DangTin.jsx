/**
 * DangTin.jsx — Giao diện trang "Đăng tin" hệ thống "Bốn Chân Về Nhà"
 * -------------------------------------------------------------------
 * Trang này phục vụ 2 use case ở Chương 3:
 *   - UC-06: Đăng tin thú cưng bị mất   (tác nhân: Người dùng)
 *   - UC-07: Đăng tin phát hiện thú cưng đi lạc (tác nhân: Người dùng)
 * Khách (Guest) không truy cập được trang này — trong dự án thật, route
 * này cần bọc trong <RouteRiengTu> hoặc kiểm tra token JWT trước khi
 * hiển thị (đã trình bày ở mục 2.3.5), chưa xử lý ở file preview này.
 *
 * Ghi chú tích hợp API thật (Backend FastAPI):
 *   - Ảnh: gửi bằng FormData (multipart/form-data) tới POST /api/tin-dang
 *   - Vị trí: mục "Chọn vị trí" bên dưới đang là bản rút gọn để xem giao
 *     diện. Trong dự án thật, thay khối "khoi-chon-vi-tri" bằng
 *     component bản đồ của thư viện bản đồ tương tác (kết hợp OpenStreetMap) (đã dùng ở trang Tìm kiếm/Bản đồ)
 *     với sự kiện onClick để lấy toạ độ người dùng chọn.
 *   - Nút "Dùng vị trí hiện tại" dùng Geolocation API thật của trình
 *     duyệt (navigator.geolocation), không phải dữ liệu giả.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "./api";
import {
  PawPrint,
  Camera,
  MapPin,
  X,
  Upload,
  Locate,
  Phone,
  CalendarDays,
  Eye,
  Search,
} from "lucide-react";

const KHU_VUC_HUE = [
  "Đông Ba", "Vỹ Dạ", "Kim Long", "Thành Nội", "An Cựu",
  "Bến Ngự", "Phú Hội", "Trường An", "Xuân Phú", "Vĩ Dạ",
];

export default function DangTin() {
  const navigate = useNavigate();
  // ---- Trạng thái của form ----
  const [loaiTin, setLoaiTin] = useState("mat"); // "mat" | "phat_hien"
  const [loaiThuCung, setLoaiThuCung] = useState("");
  const [tenThuCung, setTenThuCung] = useState("");
  const [moTa, setMoTa] = useState("");
  const [danhSachAnh, setDanhSachAnh] = useState([]); // [{ file, url }]
  const [khuVuc, setKhuVuc] = useState("");
  const [viTri, setViTri] = useState(null); // { lat, lng } | null
  const [ngayXayRa, setNgayXayRa] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [hienThiSDT, setHienThiSDT] = useState(true);
  const [dangLayViTri, setDangLayViTri] = useState(false);
  const [loi, setLoi] = useState({});
  const [daGuiThanhCong, setDaGuiThanhCong] = useState(false);
  const [dangGui, setDangGui] = useState(false);

  // ---- Xử lý chọn ảnh + tạo ảnh xem trước ----
  function chonAnh(e) {
    const files = Array.from(e.target.files).slice(0, 5 - danhSachAnh.length);
    const anhMoi = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setDanhSachAnh((truoc) => [...truoc, ...anhMoi]);
  }
  function xoaAnh(index) {
    setDanhSachAnh((truoc) => truoc.filter((_, i) => i !== index));
  }

  // ---- Lấy vị trí hiện tại bằng Geolocation API của trình duyệt ----
  function dungViTriHienTai() {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
      return;
    }
    setDangLayViTri(true);
    navigator.geolocation.getCurrentPosition(
      (viTriHienTai) => {
        setViTri({
          lat: viTriHienTai.coords.latitude,
          lng: viTriHienTai.coords.longitude,
        });
        setDangLayViTri(false);
      },
      () => {
        alert("Không lấy được vị trí. Bạn có thể chọn khu vực thủ công bên dưới.");
        setDangLayViTri(false);
      }
    );
  }

  // ---- Kiểm tra dữ liệu trước khi gửi ----
  function kiemTraForm() {
    const loiMoi = {};
    if (!loaiThuCung) loiMoi.loaiThuCung = "Vui lòng chọn loại thú cưng.";
    if (!moTa.trim()) loiMoi.moTa = "Vui lòng mô tả đặc điểm thú cưng.";
    if (danhSachAnh.length === 0) loiMoi.anh = "Vui lòng đăng ít nhất 1 ảnh.";
    if (!khuVuc) loiMoi.khuVuc = "Vui lòng chọn khu vực.";
    if (!ngayXayRa) loiMoi.ngayXayRa = "Vui lòng chọn ngày.";
    setLoi(loiMoi);
    return Object.keys(loiMoi).length === 0;
  }

  // ---- Gửi tin đăng ----
  async function guiTinDang(e) {
    e.preventDefault();
    if (!kiemTraForm()) return;

    setDangGui(true);
    try {
      await api.dangTinMoi({
        loaiTin, loaiThuCung, tenThuCung, moTa, khuVuc, viTri, danhSachAnh,
      });
      setDaGuiThanhCong(true);
    } catch (loiApi) {
      setLoi({ chung: loiApi.message });
    } finally {
      setDangGui(false);
    }
  }

  if (daGuiThanhCong) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] flex items-center justify-center px-5 font-['Be_Vietnam_Pro']">
        <div className="bg-white rounded-3xl shadow-lg border border-[#F0E4C4] max-w-md w-full text-center p-10">
          <div className="h-16 w-16 rounded-full bg-[#E1F0EA] text-[#1F6F5C] flex items-center justify-center mx-auto mb-5">
            <PawPrint className="h-8 w-8" />
          </div>
          <h2 className="font-['Baloo_2'] font-bold text-xl text-[#2B2420] mb-2">
            Đăng tin thành công!
          </h2>
          <p className="text-sm text-[#7A6F5D] leading-relaxed mb-6">
            Tin đăng của bạn đã được hiển thị cho cộng đồng quanh khu vực Huế.
            Hãy chú ý điện thoại để không bỏ lỡ tin nhắn liên hệ nhé.
          </p>
          <button
            onClick={() => setDaGuiThanhCong(false)}
            className="w-full bg-[#1F6F5C] text-white font-semibold py-3 rounded-xl hover:bg-[#195a4b] transition-colors mb-3"
          >
            Đăng thêm tin khác
          </button>
          <Link
            to="/ca-nhan"
            className="block w-full text-center border border-[#F0E4C4] text-[#5B5346] font-semibold py-3 rounded-xl hover:bg-[#FBF6EA] transition-colors"
          >
            Xem tin đăng của tôi
          </Link>
        </div>
      </div>
    );
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
          <span className="text-sm font-semibold text-[#7A6F5D]">Đăng tin</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="font-display font-extrabold text-3xl text-[#2B2420] mb-2">
          Đăng tin thú cưng
        </h1>
        <p className="text-[#7A6F5D] text-sm mb-8">
          Điền đầy đủ thông tin để cộng đồng quanh khu vực Huế có thể nhận ra
          và liên hệ với bạn nhanh nhất.
        </p>

        <form onSubmit={guiTinDang} className="space-y-7">
          {/* ---- Loại tin đăng ---- */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2420] mb-3">
              Bạn muốn đăng loại tin nào?
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoaiTin("mat")}
                className={
                  "text-left rounded-2xl border-2 p-4 transition-colors " +
                  (loaiTin === "mat"
                    ? "border-[#1F6F5C] bg-[#E1F0EA]"
                    : "border-[#F0E4C4] bg-white hover:border-[#F0A93B]")
                }
              >
                <PawPrint className={"h-6 w-6 mb-2 " + (loaiTin === "mat" ? "text-[#1F6F5C]" : "text-[#B9AE95]")} />
                <p className="font-semibold text-sm text-[#2B2420]">
                  Thú cưng của tôi bị mất
                </p>
                <p className="text-xs text-[#7A6F5D] mt-1">
                  Đăng tin tìm kiếm thú cưng đi lạc của bạn
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLoaiTin("phat_hien")}
                className={
                  "text-left rounded-2xl border-2 p-4 transition-colors " +
                  (loaiTin === "phat_hien"
                    ? "border-[#1F6F5C] bg-[#E1F0EA]"
                    : "border-[#F0E4C4] bg-white hover:border-[#F0A93B]")
                }
              >
                <Search className={"h-6 w-6 mb-2 " + (loaiTin === "phat_hien" ? "text-[#1F6F5C]" : "text-[#B9AE95]")} />
                <p className="font-semibold text-sm text-[#2B2420]">
                  Tôi phát hiện thú cưng đi lạc
                </p>
                <p className="text-xs text-[#7A6F5D] mt-1">
                  Thông báo để chủ nhân sớm tìm lại được
                </p>
              </button>
            </div>
          </div>

          {/* ---- Loại thú cưng ---- */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2420] mb-3">
              Loại thú cưng
            </label>
            <div className="flex gap-2">
              {[
                { ma: "cho", nhan: "Chó" },
                { ma: "meo", nhan: "Mèo" },
                { ma: "khac", nhan: "Khác" },
              ].map((lt) => (
                <button
                  type="button"
                  key={lt.ma}
                  onClick={() => setLoaiThuCung(lt.ma)}
                  className={
                    "px-5 py-2 rounded-full text-sm font-medium border transition-colors " +
                    (loaiThuCung === lt.ma
                      ? "bg-[#F0A93B] border-[#F0A93B] text-white font-semibold"
                      : "border-[#F0E4C4] bg-white text-[#7A6F5D] hover:border-[#F0A93B]")
                  }
                >
                  {lt.nhan}
                </button>
              ))}
            </div>
            {loi.loaiThuCung && <p className="text-xs text-[#C1502E] mt-2">{loi.loaiThuCung}</p>}
          </div>

          {/* ---- Tên thú cưng ---- */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2420] mb-2">
              Tên thú cưng {loaiTin === "phat_hien" && "(nếu biết)"}
            </label>
            <input
              type="text"
              value={tenThuCung}
              onChange={(e) => setTenThuCung(e.target.value)}
              placeholder={loaiTin === "mat" ? "Ví dụ: Bún, Mít, Lu Lu..." : "Để trống nếu không rõ tên"}
              className="w-full rounded-xl border border-[#F0E4C4] bg-white px-4 py-3 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
            />
          </div>

          {/* ---- Mô tả đặc điểm ---- */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2420] mb-2">
              Mô tả đặc điểm
            </label>
            <textarea
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              rows={4}
              placeholder="Màu lông, giống, kích thước, đặc điểm nhận dạng (vòng cổ, sẹo...), tình trạng sức khỏe nếu có..."
              className="w-full rounded-xl border border-[#F0E4C4] bg-white px-4 py-3 text-sm outline-none focus:border-[#1F6F5C] transition-colors resize-none"
            />
            {loi.moTa && <p className="text-xs text-[#C1502E] mt-2">{loi.moTa}</p>}
          </div>

          {/* ---- Ảnh minh họa ---- */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2420] mb-2">
              Hình ảnh (tối đa 5 ảnh)
            </label>
            <div className="flex flex-wrap gap-3">
              {danhSachAnh.map((anh, i) => (
                <div key={i} className="relative h-24 w-24 rounded-xl overflow-hidden border border-[#F0E4C4]">
                  <img src={anh.url} alt={`Ảnh ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => xoaAnh(i)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {danhSachAnh.length < 5 && (
                <label className="h-24 w-24 rounded-xl border-2 border-dashed border-[#F0E4C4] bg-white flex flex-col items-center justify-center text-[#B9AE95] cursor-pointer hover:border-[#F0A93B] hover:text-[#F0A93B] transition-colors">
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-[11px]">Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple hidden onChange={chonAnh} />
                </label>
              )}
            </div>
            {loi.anh && <p className="text-xs text-[#C1502E] mt-2">{loi.anh}</p>}
          </div>

          {/* ---- Khu vực + vị trí ---- */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2420] mb-2">
              Khu vực {loaiTin === "mat" ? "bị mất" : "phát hiện"}
            </label>
            <select
              value={khuVuc}
              onChange={(e) => setKhuVuc(e.target.value)}
              className="w-full rounded-xl border border-[#F0E4C4] bg-white px-4 py-3 text-sm outline-none focus:border-[#1F6F5C] mb-3"
            >
              <option value="">-- Chọn khu vực --</option>
              {KHU_VUC_HUE.map((kv) => (
                <option key={kv} value={kv}>{kv}</option>
              ))}
            </select>
            {loi.khuVuc && <p className="text-xs text-[#C1502E] mb-3">{loi.khuVuc}</p>}

            {/* Khối chọn vị trí — bản rút gọn để xem giao diện.
               Trong dự án thật thay bằng component bản đồ của thư viện bản đồ tương tác (kết hợp OpenStreetMap). */}
            <div className="rounded-xl border border-[#F0E4C4] bg-white p-4">
              <div className="h-32 rounded-lg bg-[#E1F0EA] flex items-center justify-center mb-3">
                {viTri ? (
                  <div className="text-center text-[#1F6F5C]">
                    <MapPin className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-xs font-mono">
                      {viTri.lat.toFixed(4)}, {viTri.lng.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#8FAFA5]">Chưa chọn vị trí trên bản đồ</p>
                )}
              </div>
              <button
                type="button"
                onClick={dungViTriHienTai}
                disabled={dangLayViTri}
                className="flex items-center gap-2 text-sm font-semibold text-[#1F6F5C] hover:underline disabled:opacity-50"
              >
                <Locate className="h-4 w-4" />
                {dangLayViTri ? "Đang lấy vị trí..." : "Dùng vị trí hiện tại"}
              </button>
            </div>
          </div>

          {/* ---- Ngày xảy ra ---- */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2420] mb-2">
              {loaiTin === "mat" ? "Ngày thú cưng bị mất" : "Ngày phát hiện"}
            </label>
            <div className="relative">
              <CalendarDays className="h-4 w-4 text-[#B9AE95] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={ngayXayRa}
                onChange={(e) => setNgayXayRa(e.target.value)}
                className="w-full rounded-xl border border-[#F0E4C4] bg-white pl-11 pr-4 py-3 text-sm outline-none focus:border-[#1F6F5C]"
              />
            </div>
            {loi.ngayXayRa && <p className="text-xs text-[#C1502E] mt-2">{loi.ngayXayRa}</p>}
          </div>

          {/* ---- Liên hệ ---- */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2420] mb-2">
              Số điện thoại liên hệ
            </label>
            <div className="relative mb-2">
              <Phone className="h-4 w-4 text-[#B9AE95] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full rounded-xl border border-[#F0E4C4] bg-white pl-11 pr-4 py-3 text-sm outline-none focus:border-[#1F6F5C]"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#7A6F5D] cursor-pointer">
              <input
                type="checkbox"
                checked={hienThiSDT}
                onChange={(e) => setHienThiSDT(e.target.checked)}
                className="accent-[#1F6F5C]"
              />
              <Eye className="h-3.5 w-3.5" />
              Hiển thị số điện thoại công khai trên tin đăng
            </label>
          </div>

          {loi.chung && (
            <p className="text-sm text-[#C1502E] bg-[#FCE9E1] rounded-xl px-4 py-3">{loi.chung}</p>
          )}

          {/* ---- Nút hành động ---- */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border border-[#F0E4C4] bg-white text-[#7A6F5D] font-semibold text-sm hover:bg-[#FBF6EA] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={dangGui}
              className="flex-1 py-3 rounded-xl bg-[#1F6F5C] text-white font-semibold text-sm hover:bg-[#195a4b] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Camera className="h-4 w-4" />
              {dangGui ? "Đang đăng..." : "Đăng tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
