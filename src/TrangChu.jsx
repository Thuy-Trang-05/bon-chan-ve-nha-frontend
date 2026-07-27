/**
 * TrangChu.jsx — Giao diện Trang chủ hệ thống "Bốn Chân Về Nhà"
 * ------------------------------------------------------------
 * Đây là trang chủ chính thức (không phải bản demo), dùng dữ liệu mẫu
 * (MOCK_TIN_DANG) để hiển thị trước khi nối với API thật từ Backend.
 *
 * Cách nối dữ liệu thật (khi Backend đã sẵn sàng):
 *   1. Xóa mảng MOCK_TIN_DANG bên dưới.
 *   2. Trong useEffect, gọi API thật, ví dụ:
 *        useEffect(() => {
 *          axios.get("/api/tin-dang?limit=6&sort=moi_nhat")
 *               .then(res => setDanhSachTin(res.data));
 *        }, []);
 *   3. Khi dùng trong dự án thật, thay các nút điều hướng (hiện đang
 *      dùng onClick + alert/console.log) bằng <Link to="..."> của
 *      react-router-dom, vì file này được viết độc lập để xem trước
 *      giao diện, chưa gắn Router.
 *
 * Thư viện dùng: React (useState, useEffect), lucide-react (icon).
 * Không dùng thư viện ngoài nào khác để giữ code đơn giản, dễ đọc.
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  PawPrint,
  Menu,
  X,
  Clock,
  ShieldCheck,
  MessageCircleHeart,
  MessageCircle,
  Bell,
  Camera,
  Users,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useNguoiDung } from "./NguoiDungContext";
import AvatarNguoiDung from "./AvatarNguoiDung";
import { api } from "./api";

// Tin đăng thật từ Backend chỉ có ngayDang (thời điểm chính xác), không
// có sẵn chuỗi "2 giờ trước" như dữ liệu mẫu cũ — hàm này tự tính.
function thoiGianTuongDoi(ngayDangIso) {
  if (!ngayDangIso) return "";
  const giay = Math.floor((Date.now() - new Date(ngayDangIso).getTime()) / 1000);
  if (giay < 60) return "Vừa xong";
  if (giay < 3600) return Math.floor(giay / 60) + " phút trước";
  if (giay < 86400) return Math.floor(giay / 3600) + " giờ trước";
  return Math.floor(giay / 86400) + " ngày trước";
}

/* ---------------------------------------------------------------
   1. DỮ LIỆU MẪU
   Trong dự án thật, phần này sẽ được thay bằng dữ liệu lấy từ API
   (GET /api/tin-dang). Giữ nguyên cấu trúc object thì Component bên
   dưới không cần sửa gì thêm khi nối API thật.
---------------------------------------------------------------- */
const MOCK_TIN_DANG = [
  {
    id: 1,
    tieuDe: "Chó Poodle màu nâu bị lạc gần chợ Đông Ba",
    loai: "cho",
    khuVuc: "Đông Ba",
    thoiGian: "2 giờ trước",
    trangThai: "dang_tim",
    mauNen: "from-amber-200 to-amber-100",
  },
  {
    id: 2,
    tieuDe: "Phát hiện mèo Tam Thể lạc tại khu vực Vỹ Dạ",
    loai: "meo",
    khuVuc: "Vỹ Dạ",
    thoiGian: "5 giờ trước",
    trangThai: "dang_tim",
    mauNen: "from-teal-200 to-teal-100",
  },
  {
    id: 3,
    tieuDe: "Chó Corgi tên Bún đi lạc khu vực Kim Long",
    loai: "cho",
    khuVuc: "Kim Long",
    thoiGian: "Hôm qua",
    trangThai: "da_doan_tu",
    mauNen: "from-rose-200 to-rose-100",
  },
  {
    id: 4,
    tieuDe: "Mèo Anh lông ngắn lạc gần Thành Nội",
    loai: "meo",
    khuVuc: "Thành Nội",
    thoiGian: "Hôm qua",
    trangThai: "dang_tim",
    mauNen: "from-sky-200 to-sky-100",
  },
  {
    id: 5,
    tieuDe: "Chó lai màu vàng, đeo vòng cổ đỏ, lạc ở An Cựu",
    loai: "cho",
    khuVuc: "An Cựu",
    thoiGian: "2 ngày trước",
    trangThai: "dang_tim",
    mauNen: "from-orange-200 to-orange-100",
  },
  {
    id: 6,
    tieuDe: "Thỏ trắng lạc tại khu vực Bến Ngự",
    loai: "khac",
    khuVuc: "Bến Ngự",
    thoiGian: "3 ngày trước",
    trangThai: "da_doan_tu",
    mauNen: "from-emerald-200 to-emerald-100",
  },
];

const NHAN_LOAI = { cho: "Chó", meo: "Mèo", khac: "Khác" };

/* ---------------------------------------------------------------
   2. COMPONENT NHỎ: Thẻ trạng thái kiểu "vòng cổ thú cưng"
   Dùng chung cho mọi nơi cần hiển thị trạng thái tin đăng.
---------------------------------------------------------------- */
function TheTrangThai({ trangThai }) {
  const dangTim = trangThai === "dang_tim";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1 text-xs font-semibold " +
        (dangTim
          ? "bg-[#FCE9E1] text-[#C1502E]"
          : "bg-[#E1F0EA] text-[#1F6F5C]")
      }
    >
      <span
        className={
          "h-3.5 w-3.5 rounded-full border-2 " +
          (dangTim ? "border-[#C1502E] bg-white" : "border-[#1F6F5C] bg-white")
        }
      />
      {dangTim ? "Đang tìm" : "Đã đoàn tụ"}
    </span>
  );
}

/* ---------------------------------------------------------------
   3. COMPONENT NHỎ: Thẻ hiển thị một tin đăng
---------------------------------------------------------------- */
function TinDangCard({ tin }) {
  return (
    <div className="group rounded-2xl border border-[#E9E2D3] bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Hiện ảnh thật nếu có (tin.hinhAnh), rơi về màu nền minh họa nếu chưa có ảnh */}
      {tin.hinhAnh && tin.hinhAnh.length > 0 ? (
        <img
          src={tin.hinhAnh[0]}
          alt={tin.tieuDe}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div
          className={
            "h-40 w-full bg-gradient-to-br flex items-center justify-center " +
            tin.mauNen
          }
        >
          <PawPrint className="h-12 w-12 text-white/80" strokeWidth={1.5} />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#1F6F5C]">
            {NHAN_LOAI[tin.loaiThuCung]}
          </span>
          <TheTrangThai trangThai={tin.trangThai} />
        </div>

        <h3 className="font-['Be_Vietnam_Pro'] text-[15px] font-semibold text-[#2B2420] leading-snug mb-3 line-clamp-2">
          {tin.tieuDe}
        </h3>

        <div className="flex items-center justify-between text-sm text-[#8A8072]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {tin.khuVuc}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {thoiGianTuongDoi(tin.ngayDang)}
          </span>
        </div>

        <Link
          to={`/tin/${tin.id}`}
          className="mt-4 block w-full text-center rounded-xl border border-[#1F6F5C] py-2 text-sm font-semibold text-[#1F6F5C] hover:bg-[#1F6F5C] hover:text-white transition-colors"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   4. COMPONENT CHÍNH: Trang chủ
---------------------------------------------------------------- */
export default function TrangChu() {
  const [danhSachTin, setDanhSachTin] = useState([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [locLoai, setLocLoai] = useState("tat_ca");
  const [menuMoRong, setMenuMoRong] = useState(false);
  const { nguoiDung, daDangNhap, dangXuat, laAdmin } = useNguoiDung();
  const [menuTaiKhoanMoRong, setMenuTaiKhoanMoRong] = useState(false);

  const [dangTaiTin, setDangTaiTin] = useState(true);
  const [loiTaiTin, setLoiTaiTin] = useState("");

  useEffect(() => {
    api
      .danhSachTinDang({ so_luong: 6 })
      .then(setDanhSachTin)
      .catch((loi) => setLoiTaiTin(loi.message))
      .finally(() => setDangTaiTin(false));
  }, []);

  // Lọc tin đăng theo từ khóa và loại thú cưng — xử lý ngay trên
  // Frontend vì trang chủ chỉ hiển thị một số tin nổi bật gần đây.
  // Trang "Tìm kiếm" đầy đủ (UC-12) sẽ gọi API lọc từ Backend.
  const tinHienThi = danhSachTin.filter((tin) => {
    const khopLoai = locLoai === "tat_ca" || tin.loaiThuCung === locLoai;
    const khopTuKhoa =
      tuKhoa.trim() === "" ||
      tin.tieuDe.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      tin.khuVuc.toLowerCase().includes(tuKhoa.toLowerCase());
    return khopLoai && khopTuKhoa;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] font-['Be_Vietnam_Pro']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Baloo 2', sans-serif; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-30 bg-[#FDEBC2]/90 backdrop-blur border-b border-[#F5E6BC]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-[#1F6F5C]">
            <PawPrint className="h-6 w-6" />
            Bốn Chân Về Nhà
          </Link>

          {/* Menu ngang — máy tính */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A443B]">
            <a href="#trang-chu" className="text-[#1F6F5C] font-semibold">
              Trang chủ
            </a>
            <a href="#tin-dang" className="hover:text-[#1F6F5C]">
              Tin đăng
            </a>
            <a href="#ban-do" className="hover:text-[#1F6F5C]">
              Bản đồ
            </a>
            <a href="#cach-hoat-dong" className="hover:text-[#1F6F5C]">
              Cách hoạt động
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {daDangNhap && (
              <>
                <Link to="/thong-bao" title="Thông báo" className="text-[#4A443B] hover:text-[#1F6F5C] p-1.5">
                  <Bell className="h-5 w-5" />
                </Link>
                <Link to="/nhan-tin" title="Nhắn tin" className="text-[#4A443B] hover:text-[#1F6F5C] p-1.5">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </>
            )}
            {daDangNhap ? (
              <div className="relative">
                <button
                  onClick={() => setMenuTaiKhoanMoRong((v) => !v)}
                  aria-label="Mở menu tài khoản"
                  className="block"
                >
                  <AvatarNguoiDung nguoiDung={nguoiDung} kichThuoc="h-9 w-9" />
                </button>
                {menuTaiKhoanMoRong && (
                  <>
                    {/* Lớp phủ trong suốt để bấm ra ngoài là đóng menu */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuTaiKhoanMoRong(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-52 bg-white rounded-xl border border-[#F0E4C4] shadow-lg py-1.5 overflow-hidden">
                      <p className="px-4 py-2 text-sm font-semibold text-[#2B2420] truncate border-b border-[#F0E4C4] mb-1">
                        {nguoiDung?.hoTen}
                      </p>
                      <Link
                        to="/ca-nhan"
                        onClick={() => setMenuTaiKhoanMoRong(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#4A443B] hover:bg-[#FBF6EA]"
                      >
                        <User className="h-4 w-4" />
                        Trang cá nhân
                      </Link>
                      <Link
                        to="/ca-nhan?tab=tai_khoan"
                        onClick={() => setMenuTaiKhoanMoRong(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#4A443B] hover:bg-[#FBF6EA]"
                      >
                        <Settings className="h-4 w-4" />
                        Cài đặt
                      </Link>
                      {laAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuTaiKhoanMoRong(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#6B4C93] hover:bg-[#FBF6EA] font-semibold"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Trang quản trị
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setMenuTaiKhoanMoRong(false);
                          dangXuat();
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#C1502E] hover:bg-[#FCE9E1]"
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/dang-nhap"
                  className="text-sm font-semibold text-[#4A443B] hover:text-[#1F6F5C] px-3 py-2"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  className="text-sm font-semibold text-white bg-[#1F6F5C] hover:bg-[#195a4b] px-4 py-2 rounded-xl transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
            <Link
              to={daDangNhap ? "/dang-tin" : "/dang-nhap"}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#F0A93B] hover:bg-[#e09b2e] px-4 py-2 rounded-xl transition-colors"
            >
              <Camera className="h-4 w-4" />
              Đăng tin
            </Link>
          </div>

          {/* Nút menu — điện thoại */}
          <button
            className="md:hidden text-[#2B2420]"
            onClick={() => setMenuMoRong(!menuMoRong)}
            aria-label="Mở menu"
          >
            {menuMoRong ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu điện thoại */}
        {menuMoRong && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-3 text-sm font-medium text-[#4A443B] border-t border-[#F5E6BC] bg-[#FBE1A6]">
            <a href="#trang-chu" className="pt-3">
              Trang chủ
            </a>
            <a href="#tin-dang">Tin đăng</a>
            <a href="#ban-do">Bản đồ</a>
            <a href="#cach-hoat-dong">Cách hoạt động</a>
            <div className="flex gap-2 pt-2">
              {daDangNhap ? (
                <Link
                  to="/ca-nhan"
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-[#1F6F5C] border border-[#1F6F5C] px-4 py-2 rounded-xl"
                >
                  <AvatarNguoiDung nguoiDung={nguoiDung} kichThuoc="h-5 w-5" coChu="text-[10px]" />
                  Trang cá nhân
                </Link>
              ) : (
                <Link
                  to="/dang-nhap"
                  className="flex-1 text-center text-sm font-semibold text-[#1F6F5C] border border-[#1F6F5C] px-4 py-2 rounded-xl"
                >
                  Đăng nhập
                </Link>
              )}
              <Link
                to={daDangNhap ? "/dang-tin" : "/dang-nhap"}
                className="flex-1 text-center text-sm font-semibold text-white bg-[#F0A93B] px-4 py-2 rounded-xl"
              >
                Đăng tin
              </Link>
            </div>
            {daDangNhap && (
              <div className="flex gap-2">
                <Link
                  to="/ca-nhan?tab=tai_khoan"
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#4A443B] border border-[#F0E4C4] px-4 py-2 rounded-xl"
                >
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </Link>
                <button
                  onClick={dangXuat}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#C1502E] border border-[#F0E4C4] px-4 py-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            )}
            {laAdmin && (
              <Link
                to="/admin"
                className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-[#6B4C93] px-4 py-2 rounded-xl"
              >
                <ShieldCheck className="h-4 w-4" />
                Trang quản trị
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section id="trang-chu" className="max-w-6xl mx-auto px-5 pt-14 pb-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-[#E1F0EA] text-[#1F6F5C] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Dành cho cộng đồng nuôi thú cưng tại Huế
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-[#2B2420] leading-tight mb-4">
              Giúp những chiếc <span className="text-[#1F6F5C]">chân nhỏ</span>{" "}
              tìm được đường về nhà
            </h1>
            <p className="text-[#5B5346] text-base leading-relaxed mb-7">
              Đăng tin thú cưng bị lạc, hoặc chia sẻ thú lạc bạn vừa gặp — chỉ
              trong vài phút. Bốn Chân Về Nhà kết nối "Sen" và cộng đồng xung
              quanh Thành phố Huế để mỗi cuộc đoàn tụ đến nhanh hơn.
            </p>

            {/* Thanh tìm kiếm nhanh */}
            <div className="bg-white rounded-2xl p-2 flex items-center gap-2 shadow-sm border border-[#E9E2D3] mb-4">
              <Search className="h-5 w-5 text-[#8A8072] ml-2" />
              <input
                type="text"
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
                placeholder="Tìm theo khu vực, đặc điểm thú cưng..."
                className="flex-1 outline-none text-sm py-2 text-[#2B2420] bg-transparent"
              />
              <button className="bg-[#1F6F5C] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#195a4b] transition-colors">
                Tìm kiếm
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {["tat_ca", "cho", "meo", "khac"].map((loai) => (
                <button
                  key={loai}
                  onClick={() => setLocLoai(loai)}
                  style={locLoai === loai ? { backgroundColor: "#F0A93B", borderColor: "#F0A93B", color: "#FFFFFF" } : undefined}
                  className={
                    "text-sm px-4 py-1.5 rounded-full border transition-colors font-semibold " +
                    (locLoai === loai ? "" : "border-[#E9E2D3] text-[#5B5346] hover:border-[#F0A93B] font-normal")
                  }
                >
                  {loai === "tat_ca" ? "Tất cả" : NHAN_LOAI[loai]}
                </button>
              ))}
            </div>
          </div>

          {/* Ảnh minh họa hero */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#F0A93B] via-[#F3C070] to-[#1F6F5C]/30 flex items-center justify-center">
              <PawPrint className="h-28 w-28 text-white/90" strokeWidth={1} />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg border border-[#E9E2D3] px-5 py-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#E1F0EA] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-[#1F6F5C]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#2B2420] leading-none">
                  128 thú cưng
                </p>
                <p className="text-xs text-[#8A8072]">đã đoàn tụ cùng gia đình</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DANH SÁCH TIN ĐĂNG ============ */}
      <section id="tin-dang" className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#2B2420]">
              Tin đăng gần đây
            </h2>
            <p className="text-sm text-[#8A8072] mt-1">
              Cập nhật mới nhất từ cộng đồng quanh khu vực Huế
            </p>
          </div>
          <Link
            to="/tim-kiem"
            className="hidden sm:block text-sm font-semibold text-[#1F6F5C] hover:underline whitespace-nowrap"
          >
            Xem tất cả →
          </Link>
        </div>

        {dangTaiTin ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E9E2D3]">
            <p className="text-[#8A8072] text-sm">Đang tải tin đăng...</p>
          </div>
        ) : loiTaiTin ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E9E2D3]">
            <p className="text-[#C1502E] text-sm">{loiTaiTin}</p>
          </div>
        ) : tinHienThi.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E9E2D3]">
            <PawPrint className="h-10 w-10 text-[#E9E2D3] mx-auto mb-3" />
            <p className="text-[#8A8072] text-sm">
              Không tìm thấy tin đăng phù hợp. Thử từ khóa khác xem sao.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tinHienThi.map((tin) => (
              <TinDangCard key={tin.id} tin={tin} />
            ))}
          </div>
        )}
      </section>

      {/* ============ CÁCH HOẠT ĐỘNG ============ */}
      <section id="cach-hoat-dong" className="bg-white border-y border-[#E9E2D3]">
        <div className="max-w-6xl mx-auto px-5 py-14">
          <h2 className="font-display font-bold text-2xl text-[#2B2420] text-center mb-10">
            Chỉ 3 bước để bắt đầu
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="h-6 w-6" />,
                tieuDe: "Đăng tin kèm ảnh",
                mota:
                  "Chụp ảnh, chọn khu vực và đánh dấu vị trí trên bản đồ — chỉ mất chưa đến 2 phút.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                tieuDe: "Cộng đồng lan tỏa",
                mota:
                  "Tin đăng hiển thị ngay cho mọi người quanh khu vực Huế, kể cả khách chưa có tài khoản.",
              },
              {
                icon: <MessageCircleHeart className="h-6 w-6" />,
                tieuDe: "Kết nối & đoàn tụ",
                mota:
                  "Liên hệ trực tiếp qua tin đăng, xác nhận đặc điểm và đón thú cưng trở về nhà.",
              },
            ].map((buoc, i) => (
              <div key={i} className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-[#E1F0EA] text-[#1F6F5C] flex items-center justify-center mx-auto mb-4">
                  {buoc.icon}
                </div>
                <h3 className="font-semibold text-[#2B2420] mb-2">
                  {i + 1}. {buoc.tieuDe}
                </h3>
                <p className="text-sm text-[#8A8072] leading-relaxed max-w-xs mx-auto">
                  {buoc.mota}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BẢN ĐỒ TEASER ============ */}
      <section id="ban-do" className="max-w-6xl mx-auto px-5 py-14">
        <div className="rounded-3xl bg-[#1F6F5C] px-8 py-12 md:flex items-center justify-between gap-8">
          <div className="text-white mb-6 md:mb-0">
            <h2 className="font-display font-bold text-2xl mb-2">
              Xem tin đăng ngay trên bản đồ
            </h2>
            <p className="text-white/80 text-sm max-w-md">
              Mọi tin đăng đều được ghim vị trí thực tế trong Thành phố Huế —
              giúp bạn nhanh chóng biết thú cưng đi lạc gần khu vực nào.
            </p>
          </div>
          <Link
            to="/tim-kiem"
            className="shrink-0 bg-white text-[#1F6F5C] font-semibold px-6 py-3 rounded-xl hover:bg-[#F0A93B] hover:text-white transition-colors flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Mở bản đồ đầy đủ
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#E9E2D3] bg-white">
        <div className="max-w-6xl mx-auto px-5 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-[#1F6F5C] mb-2">
              <PawPrint className="h-5 w-5" />
              Bốn Chân Về Nhà
            </div>
            <p className="text-sm text-[#8A8072] leading-relaxed">
              Nền tảng hỗ trợ tìm kiếm thú cưng đi lạc trong phạm vi Thành phố
              Huế.
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#2B2420] mb-3 text-sm">
              Điều hướng
            </p>
            <ul className="space-y-2 text-sm text-[#8A8072]">
              <li><Link to="/" className="hover:text-[#1F6F5C]">Trang chủ</Link></li>
              <li><a href="#tin-dang" className="hover:text-[#1F6F5C]">Tin đăng</a></li>
              <li><Link to="/tim-kiem" className="hover:text-[#1F6F5C]">Bản đồ</Link></li>
              <li><Link to={daDangNhap ? "/dang-tin" : "/dang-nhap"} className="hover:text-[#1F6F5C]">Đăng tin</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#2B2420] mb-3 text-sm">
              Tài khoản
            </p>
            <ul className="space-y-2 text-sm text-[#8A8072]">
              {daDangNhap ? (
                <li><Link to="/ca-nhan" className="hover:text-[#1F6F5C]">Trang cá nhân</Link></li>
              ) : (
                <>
                  <li><Link to="/dang-nhap" className="hover:text-[#1F6F5C]">Đăng nhập</Link></li>
                  <li><Link to="/dang-ky" className="hover:text-[#1F6F5C]">Đăng ký</Link></li>
                </>
              )}
              <li><Link to="/ca-nhan" className="hover:text-[#1F6F5C]">Tin đăng của tôi</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#2B2420] mb-3 text-sm">
              Liên hệ
            </p>
            <p className="text-sm text-[#8A8072]">
              Đồ án niên luận — Khoa Công nghệ thông tin,
              <br />
              Trường Đại học Khoa học Huế.
            </p>
          </div>
        </div>
        <div className="text-center text-xs text-[#8A8072] pb-6">
          © 2026 Bốn Chân Về Nhà. Đồ án niên luận sinh viên.
        </div>
      </footer>
    </div>
  );
}
