
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PawPrint,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  MessageCircleHeart,
  X,
} from "lucide-react";
import { useNguoiDung } from "./NguoiDungContext";
import { api } from "./api";

export default function DangNhapDangKy() {
  const navigate = useNavigate();
  const diaChi = useLocation();
  const { dangNhap } = useNguoiDung();

  const [cheDo, setCheDo] = useState(diaChi.pathname === "/dang-ky" ? "dang_ky" : "dang_nhap");

  const [emailDangNhap, setEmailDangNhap] = useState("");
  const [matKhauDangNhap, setMatKhauDangNhap] = useState("");
  const [ghiNhoDangNhap, setGhiNhoDangNhap] = useState(true);
  const [hienMatKhauDangNhap, setHienMatKhauDangNhap] = useState(false);

  const [hoTen, setHoTen] = useState("");
  const [emailDangKy, setEmailDangKy] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [matKhauDangKy, setMatKhauDangKy] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [hienMatKhauDangKy, setHienMatKhauDangKy] = useState(false);
  const [dongYDieuKhoan, setDongYDieuKhoan] = useState(false);

  const [loi, setLoi] = useState({});
  const [dangXuLy, setDangXuLy] = useState(false);
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState("");
  const [loiChung, setLoiChung] = useState("");

  function doiCheDo(cheDoMoi) {
    setCheDo(cheDoMoi);
    setLoi({});
    setLoiChung("");
    setThongBaoThanhCong("");
  }

  function kiemTraDangNhap() {
    const loiMoi = {};
    if (!emailDangNhap.trim()) loiMoi.emailDangNhap = "Vui lòng nhập email.";
    if (!matKhauDangNhap) loiMoi.matKhauDangNhap = "Vui lòng nhập mật khẩu.";
    setLoi(loiMoi);
    return Object.keys(loiMoi).length === 0;
  }

  function kiemTraDangKy() {
    const loiMoi = {};
    if (!hoTen.trim()) loiMoi.hoTen = "Vui lòng nhập họ và tên.";
    if (!emailDangKy.trim()) loiMoi.emailDangKy = "Vui lòng nhập email.";
    if (soDienThoai && !/^[0-9]{9,11}$/.test(soDienThoai.replace(/\s/g, ""))) {
      loiMoi.soDienThoai = "Số điện thoại không hợp lệ.";
    }
    if (matKhauDangKy.length < 6) {
      loiMoi.matKhauDangKy = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (xacNhanMatKhau !== matKhauDangKy) {
      loiMoi.xacNhanMatKhau = "Mật khẩu xác nhận không khớp.";
    }
    if (!dongYDieuKhoan) {
      loiMoi.dongYDieuKhoan = "Bạn cần đồng ý với điều khoản sử dụng.";
    }
    setLoi(loiMoi);
    return Object.keys(loiMoi).length === 0;
  }

  async function xuLyDangNhap(e) {
    e.preventDefault();
    if (!kiemTraDangNhap()) return;

    setDangXuLy(true);
    setLoiChung("");
    try {
      const { accessToken, nguoiDung: nguoiDungMoi } = await api.dangNhap({
        email: emailDangNhap,
        mat_khau: matKhauDangNhap,
      });
      setThongBaoThanhCong("Đăng nhập thành công! Đang chuyển về Trang chủ...");
      dangNhap(accessToken, nguoiDungMoi);
      setTimeout(() => navigate("/"), 600);
    } catch (loi) {
      setLoiChung(loi.message);
    } finally {
      setDangXuLy(false);
    }
  }

  async function xuLyDangKy(e) {
    e.preventDefault();
    if (!kiemTraDangKy()) return;

    setDangXuLy(true);
    setLoiChung("");
    try {
      await api.dangKy({
        ho_ten: hoTen,
        email: emailDangKy,
        mat_khau: matKhauDangKy,
        so_dien_thoai: soDienThoai || null,
      });
      setThongBaoThanhCong("Tạo tài khoản thành công! Bạn có thể đăng nhập ngay.");
      setCheDo("dang_nhap");
      setEmailDangNhap(emailDangKy);
    } catch (loi) {
      setLoiChung(loi.message);
    } finally {
      setDangXuLy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] font-['Be_Vietnam_Pro']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Baloo 2', sans-serif; }
      `}</style>

      {}
      <header className="sticky top-0 z-30 bg-[#FDEBC2]/90 backdrop-blur border-b border-[#F5E6BC]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-[#1F6F5C]">
            <PawPrint className="h-6 w-6" />
            Bốn Chân Về Nhà
          </Link>
          <span className="text-sm font-semibold text-[#7A6F5D]">
            {cheDo === "dang_nhap" ? "Đăng nhập" : "Đăng ký"}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {}
          <div className="hidden md:block">
            <div className="relative">
              <div
                className="rounded-3xl flex items-center justify-center w-full"
                style={{
                  aspectRatio: "1 / 1",
                  background: "linear-gradient(135deg, #F0A93B 0%, #F3C070 50%, rgba(31,111,92,0.35) 100%)",
                }}
              >
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
              <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-lg border border-[#E9E2D3] px-5 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#FCE9E1] flex items-center justify-center">
                  <MessageCircleHeart className="h-5 w-5 text-[#C1502E]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2B2420] leading-none">Cộng đồng Huế</p>
                  <p className="text-xs text-[#8A8072]">luôn sẵn sàng giúp đỡ</p>
                </div>
              </div>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#2B2420] mt-10 leading-snug">
              Mỗi tài khoản là một cơ hội
              <br />
              đưa thú cưng về nhà
            </h2>
            <p className="text-[#7A6F5D] text-sm leading-relaxed mt-3 max-w-sm">
              Đăng nhập để đăng tin, nhắn tin trực tiếp với người tìm thấy thú
              cưng, và quản lý hồ sơ thú cưng của riêng bạn.
            </p>
          </div>

          {}
          <div className="bg-white rounded-3xl shadow-lg border border-[#F0E4C4] p-7 sm:p-9 w-full max-w-md mx-auto md:mx-0">
            {}
            <div className="flex gap-1 bg-[#FBF6EA] border border-[#F0E4C4] rounded-xl p-1 mb-7">
              <button
                type="button"
                onClick={() => doiCheDo("dang_nhap")}
                style={cheDo === "dang_nhap" ? { backgroundColor: "#1F6F5C", color: "#FFFFFF" } : undefined}
                className={
                  "flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors " +
                  (cheDo === "dang_nhap" ? "" : "text-[#7A6F5D] hover:bg-white")
                }
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => doiCheDo("dang_ky")}
                style={cheDo === "dang_ky" ? { backgroundColor: "#1F6F5C", color: "#FFFFFF" } : undefined}
                className={
                  "flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors " +
                  (cheDo === "dang_ky" ? "" : "text-[#7A6F5D] hover:bg-white")
                }
              >
                Đăng ký
              </button>
            </div>

            {loiChung && (
              <div className="flex items-center gap-2 bg-[#FCE9E1] text-[#C1502E] text-sm font-medium rounded-xl px-4 py-3 mb-5">
                <X className="h-4 w-4 shrink-0" />
                {loiChung}
              </div>
            )}

            {thongBaoThanhCong && (
              <div className="flex items-center gap-2 bg-[#E1F0EA] text-[#1F6F5C] text-sm font-medium rounded-xl px-4 py-3 mb-5">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {thongBaoThanhCong}
              </div>
            )}

            {}
            {cheDo === "dang_nhap" && (
              <form onSubmit={xuLyDangNhap} className="space-y-4">
                <div>
                  <h1 className="font-display font-extrabold text-2xl text-[#2B2420] mb-1">
                    Chào bạn quay lại!
                  </h1>
                  <p className="text-sm text-[#8A8072]">
                    Đăng nhập để tiếp tục hành trình tìm về tổ ấm.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailDangNhap}
                      onChange={(e) => setEmailDangNhap(e.target.value)}
                      placeholder="ban@example.com"
                      className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
                    />
                  </div>
                  {loi.emailDangNhap && (
                    <p className="text-xs text-[#C1502E] mt-1.5">{loi.emailDangNhap}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={hienMatKhauDangNhap ? "text" : "password"}
                      value={matKhauDangNhap}
                      onChange={(e) => setMatKhauDangNhap(e.target.value)}
                      placeholder="Nhập mật khẩu của bạn"
                      className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setHienMatKhauDangNhap((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B9AE95] hover:text-[#7A6F5D]"
                    >
                      {hienMatKhauDangNhap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loi.matKhauDangNhap && (
                    <p className="text-xs text-[#C1502E] mt-1.5">{loi.matKhauDangNhap}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-[#7A6F5D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ghiNhoDangNhap}
                      onChange={(e) => setGhiNhoDangNhap(e.target.checked)}
                      className="accent-[#1F6F5C]"
                    />
                    Ghi nhớ đăng nhập
                  </label>
                  <Link to="/quen-mat-khau" className="text-[#1F6F5C] font-semibold hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={dangXuLy}
                  style={{ backgroundColor: "#1F6F5C", color: "#FFFFFF" }}
                  className="w-full font-semibold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {dangXuLy ? "Đang đăng nhập..." : "Đăng nhập"}
                  {!dangXuLy && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="text-center text-sm text-[#7A6F5D] pt-1">
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => doiCheDo("dang_ky")}
                    className="text-[#1F6F5C] font-semibold hover:underline"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </form>
            )}

            {}
            {cheDo === "dang_ky" && (
              <form onSubmit={xuLyDangKy} className="space-y-4">
                <div>
                  <h1 className="font-display font-extrabold text-2xl text-[#2B2420] mb-1">
                    Tạo tài khoản mới
                  </h1>
                  <p className="text-sm text-[#8A8072]">
                    Tham gia cộng đồng "Sen" tại Huế chỉ trong 1 phút.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={hoTen}
                      onChange={(e) => setHoTen(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
                    />
                  </div>
                  {loi.hoTen && <p className="text-xs text-[#C1502E] mt-1.5">{loi.hoTen}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailDangKy}
                      onChange={(e) => setEmailDangKy(e.target.value)}
                      placeholder="ban@example.com"
                      className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
                    />
                  </div>
                  {loi.emailDangKy && <p className="text-xs text-[#C1502E] mt-1.5">{loi.emailDangKy}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">
                    Số điện thoại <span className="font-normal text-[#B9AE95]">(không bắt buộc)</span>
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={soDienThoai}
                      onChange={(e) => setSoDienThoai(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
                    />
                  </div>
                  {loi.soDienThoai && <p className="text-xs text-[#C1502E] mt-1.5">{loi.soDienThoai}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={hienMatKhauDangKy ? "text" : "password"}
                        value={matKhauDangKy}
                        onChange={(e) => setMatKhauDangKy(e.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-9 py-2.5 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setHienMatKhauDangKy((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B9AE95] hover:text-[#7A6F5D]"
                      >
                        {hienMatKhauDangKy ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">
                      Xác nhận
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={hienMatKhauDangKy ? "text" : "password"}
                        value={xacNhanMatKhau}
                        onChange={(e) => setXacNhanMatKhau(e.target.value)}
                        placeholder="Nhập lại"
                        className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C] transition-colors"
                      />
                    </div>
                  </div>
                </div>
                {(loi.matKhauDangKy || loi.xacNhanMatKhau) && (
                  <p className="text-xs text-[#C1502E] -mt-2">
                    {loi.matKhauDangKy || loi.xacNhanMatKhau}
                  </p>
                )}

                <div>
                  <label className="flex items-start gap-2 text-sm text-[#7A6F5D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dongYDieuKhoan}
                      onChange={(e) => setDongYDieuKhoan(e.target.checked)}
                      className="accent-[#1F6F5C] mt-0.5"
                    />
                    <span>
                      Tôi đồng ý với{" "}
                      <span className="text-[#1F6F5C] font-semibold hover:underline">
                        Điều khoản sử dụng
                      </span>{" "}
                      của Bốn Chân Về Nhà
                    </span>
                  </label>
                  {loi.dongYDieuKhoan && (
                    <p className="text-xs text-[#C1502E] mt-1.5">{loi.dongYDieuKhoan}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={dangXuLy}
                  style={{ backgroundColor: "#1F6F5C", color: "#FFFFFF" }}
                  className="w-full font-semibold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {dangXuLy ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                  {!dangXuLy && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="text-center text-sm text-[#7A6F5D] pt-1">
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => doiCheDo("dang_nhap")}
                    className="text-[#1F6F5C] font-semibold hover:underline"
                  >
                    Đăng nhập
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
