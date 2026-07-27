/**
 * TrangCaNhan.jsx — Giao diện Trang cá nhân hệ thống "Bốn Chân Về Nhà"
 * -----------------------------------------------------------------
 * Trang này chỉ dành cho tác nhân Người dùng (User) đã đăng nhập —
 * Khách không truy cập được (giống trang Đăng tin, cần kiểm tra JWT
 * trước khi hiển thị trong dự án thật, chưa xử lý ở file preview này).
 *
 * Các use case liên quan ở Chương 3:
 *   - Cập nhật thông tin cá nhân       (tab "Thông tin tài khoản")
 *   - Sửa / xóa tin đăng của mình      (tab "Tin đăng của tôi")
 *   - Đánh dấu tin đã giải quyết (UC-13, nút "Đánh dấu đã đoàn tụ")
 *   - Quản lý hồ sơ ThuCung (theo ERD mục 4.2.1: 1 NguoiDung — n ThuCung)
 *
 * Ghi chú tích hợp API thật:
 *   - Lấy dữ liệu: GET /api/nguoi-dung/toi, GET /api/tin-dang?cua_toi=true,
 *     GET /api/thu-cung?cua_toi=true
 *   - Xóa tin: DELETE /api/tin-dang/{id}
 *   - Đánh dấu đã đoàn tụ: PATCH /api/tin-dang/{id} { trang_thai: "da_giai_quyet" }
 *   - Cập nhật hồ sơ: PUT /api/nguoi-dung/toi
 */

import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PawPrint,
  Pencil,
  Trash2,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  User,
  FileText,
  Camera,
  X,
  Lock,
  Mail,
  Phone,
  Upload,
} from "lucide-react";
import { useNguoiDung } from "./NguoiDungContext";
import AvatarNguoiDung from "./AvatarNguoiDung";
import { api } from "./api";

const NHAN_LOAI = { cho: "Chó", meo: "Mèo", khac: "Khác" };

const KHU_VUC_HUE = [
  "Đông Ba", "Vỹ Dạ", "Kim Long", "Thành Nội", "An Cựu",
  "Bến Ngự", "Phú Hội", "Trường An", "Xuân Phú",
];

const TIN_DANG_CUA_TOI = [
  { id: 1, tieuDe: "Chó Poodle màu nâu bị lạc gần chợ Đông Ba", loaiThuCung: "cho", khuVuc: "Đông Ba", moTa: "Lông xoăn màu nâu cà phê, đeo vòng cổ đỏ có lục lạc, khá nhút nhát với người lạ.", ngayXayRa: "2026-07-13", thoiGian: "2 giờ trước", trangThai: "dang_tim", mauNen: "from-amber-200 to-amber-100" },
  { id: 2, tieuDe: "Mèo Anh lông ngắn lạc gần Thành Nội", loaiThuCung: "meo", khuVuc: "Thành Nội", moTa: "Lông xám, mắt vàng, có đeo chuông nhỏ.", ngayXayRa: "2026-07-08", thoiGian: "1 tuần trước", trangThai: "da_doan_tu", mauNen: "from-sky-200 to-sky-100" },
  { id: 3, tieuDe: "Phát hiện chó lai lạc gần khu vực Bến Ngự", loaiThuCung: "cho", khuVuc: "Bến Ngự", moTa: "Chó lai vàng nâu, cỡ trung bình, không đeo vòng cổ.", ngayXayRa: "2026-07-01", thoiGian: "2 tuần trước", trangThai: "da_doan_tu", mauNen: "from-emerald-200 to-emerald-100" },
];

const THU_CUNG_CUA_TOI = [
  { id: 1, ten: "Bún", loai: "cho", giong: "Poodle", moTa: "Lông xoăn màu nâu, khoảng 2 tuổi, hay sủa khi có người lạ.", mauNen: "from-amber-200 to-amber-100" },
  { id: 2, ten: "Mimi", loai: "meo", giong: "Mèo Anh lông ngắn", moTa: "Lông xám, mắt vàng, tính tình hiền, thích được bế.", mauNen: "from-sky-200 to-sky-100" },
];

function TheTrangThai({ trangThai }) {
  const dangTim = trangThai === "dang_tim";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1 text-xs font-semibold " +
        (dangTim ? "bg-[#FCE9E1] text-[#C1502E]" : "bg-[#E1F0EA] text-[#1F6F5C]")
      }
    >
      <span className={"h-3.5 w-3.5 rounded-full border-2 bg-white " + (dangTim ? "border-[#C1502E]" : "border-[#1F6F5C]")} />
      {dangTim ? "Đang tìm" : "Đã đoàn tụ"}
    </span>
  );
}

export default function TrangCaNhan() {
  const { nguoiDung, capNhatHoSo } = useNguoiDung();
  const [thamSo] = useSearchParams();
  const [tabDangChon, setTabDangChon] = useState(thamSo.get("tab") || "tin_dang");
  const [danhSachTin, setDanhSachTin] = useState([]);
  const [dangTaiTin, setDangTaiTin] = useState(true);
  const [loiTaiTin, setLoiTaiTin] = useState("");
  const [locTrangThai, setLocTrangThai] = useState("tat_ca");
  const [tinCanXoa, setTinCanXoa] = useState(null);

  useEffect(() => {
    api
      .tinDangCuaToi()
      .then(setDanhSachTin)
      .catch((loi) => setLoiTaiTin(loi.message))
      .finally(() => setDangTaiTin(false));
  }, []);

  const [danhSachThuCung, setDanhSachThuCung] = useState(THU_CUNG_CUA_TOI);
  const [thuCungDangSua, setThuCungDangSua] = useState(null); // null = đóng modal
  const [anhXemTruocThuCung, setAnhXemTruocThuCung] = useState(null);
  const [loiThuCung, setLoiThuCung] = useState({});

  const [tinDangSua, setTinDangSua] = useState(null); // null = đóng modal
  const [loiSuaTin, setLoiSuaTin] = useState({});

  // Khởi tạo từ người dùng đang đăng nhập trong NguoiDungContext; nếu vì
  // lý do nào đó Context chưa có dữ liệu (route được xem trực tiếp khi
  // đang phát triển UI) thì rơi về dữ liệu mẫu để không hiện ô trống.
  const [hoTen, setHoTen] = useState(nguoiDung?.hoTen || "Trần Thu Thủy");
  const [email, setEmail] = useState(nguoiDung?.email || "thuthuy@example.com");
  const [soDienThoai, setSoDienThoai] = useState(nguoiDung?.soDienThoai || "0905 123 456");
  const [anhDaiDien, setAnhDaiDien] = useState(nguoiDung?.anhDaiDien || null);
  const [daLuuThongTin, setDaLuuThongTin] = useState(false);

  const [matKhauCu, setMatKhauCu] = useState("");
  const [matKhauMoi, setMatKhauMoi] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [loiMatKhau, setLoiMatKhau] = useState("");

  const tinHienThi = danhSachTin.filter(
    (tin) => locTrangThai === "tat_ca" || tin.trangThai === locTrangThai
  );

  async function danhDauDaDoanTu(id) {
    try {
      const tinMoi = await api.capNhatTrangThaiTinDang(id, "da_giai_quyet");
      setDanhSachTin((truoc) => truoc.map((t) => (t.id === id ? tinMoi : t)));
    } catch (loi) {
      alert("Không thể cập nhật: " + loi.message);
    }
  }

  // ---- Sửa bài đăng (UC-08) ----
  function moModalSuaTin(tin) {
    setTinDangSua({ ...tin });
    setLoiSuaTin({});
  }

  function dongModalSuaTin() {
    setTinDangSua(null);
    setLoiSuaTin({});
  }

  async function luuSuaTin(e) {
    e.preventDefault();
    const loiMoi = {};
    if (!tinDangSua.tieuDe.trim()) loiMoi.tieuDe = "Vui lòng nhập tiêu đề tin đăng.";
    if (!tinDangSua.moTa.trim()) loiMoi.moTa = "Vui lòng mô tả đặc điểm thú cưng.";
    if (!tinDangSua.khuVuc) loiMoi.khuVuc = "Vui lòng chọn khu vực.";
    setLoiSuaTin(loiMoi);
    if (Object.keys(loiMoi).length > 0) return;

    try {
      const tinMoi = await api.suaTinDang(tinDangSua.id, tinDangSua);
      setDanhSachTin((truoc) => truoc.map((t) => (t.id === tinDangSua.id ? tinMoi : t)));
      dongModalSuaTin();
    } catch (loi) {
      setLoiSuaTin({ chung: loi.message });
    }
  }

  async function xacNhanXoaTin() {
    try {
      await api.xoaTinDang(tinCanXoa.id);
      setDanhSachTin((truoc) => truoc.filter((t) => t.id !== tinCanXoa.id));
      setTinCanXoa(null);
    } catch (loi) {
      alert("Không thể xóa: " + loi.message);
    }
  }

  // ---- Xử lý hồ sơ Thú cưng (UC-05: Cập nhật thông tin thú cưng) ----
  function moModalThemThuCung() {
    setThuCungDangSua({ id: null, ten: "", loai: "", giong: "", moTa: "", mauNen: "from-amber-200 to-amber-100" });
    setAnhXemTruocThuCung(null);
    setLoiThuCung({});
  }

  function moModalSuaThuCung(tc) {
    setThuCungDangSua({ ...tc });
    setAnhXemTruocThuCung(null);
    setLoiThuCung({});
  }

  function dongModalThuCung() {
    setThuCungDangSua(null);
    setAnhXemTruocThuCung(null);
    setLoiThuCung({});
  }

  function chonAnhThuCung(e) {
    const file = e.target.files[0];
    if (file) setAnhXemTruocThuCung(URL.createObjectURL(file));
  }

  function luuThuCung(e) {
    e.preventDefault();
    const loiMoi = {};
    if (!thuCungDangSua.ten.trim()) loiMoi.ten = "Vui lòng nhập tên thú cưng.";
    if (!thuCungDangSua.loai) loiMoi.loai = "Vui lòng chọn loại thú cưng.";
    setLoiThuCung(loiMoi);
    if (Object.keys(loiMoi).length > 0) return;

    if (thuCungDangSua.id === null) {
      // Trong dự án thật: axios.post("/api/thu-cung", formData) kèm ảnh qua FormData
      setDanhSachThuCung((truoc) => [...truoc, { ...thuCungDangSua, id: Date.now() }]);
    } else {
      // Trong dự án thật: axios.put(`/api/thu-cung/${thuCungDangSua.id}`, formData)
      setDanhSachThuCung((truoc) => truoc.map((tc) => (tc.id === thuCungDangSua.id ? thuCungDangSua : tc)));
    }
    dongModalThuCung();
  }

  function xoaThuCung() {
    // Trong dự án thật: axios.delete(`/api/thu-cung/${thuCungDangSua.id}`)
    setDanhSachThuCung((truoc) => truoc.filter((tc) => tc.id !== thuCungDangSua.id));
    dongModalThuCung();
  }

  const [dangLuuThongTin, setDangLuuThongTin] = useState(false);
  const [loiLuuThongTin, setLoiLuuThongTin] = useState("");

  async function luuThongTinTaiKhoan(e) {
    e.preventDefault();
    setDangLuuThongTin(true);
    setLoiLuuThongTin("");
    try {
      const nguoiDungMoi = await api.capNhatThongTinCuaToi({ hoTen, soDienThoai });
      capNhatHoSo(nguoiDungMoi);
      setDaLuuThongTin(true);
      setTimeout(() => setDaLuuThongTin(false), 2500);
    } catch (loi) {
      setLoiLuuThongTin(loi.message);
    } finally {
      setDangLuuThongTin(false);
    }
  }

  async function chonAnhDaiDien(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAnhDaiDien(URL.createObjectURL(file)); // xem trước ngay lập tức, chưa cần chờ upload xong
    try {
      const nguoiDungMoi = await api.doiAnhDaiDien(file);
      setAnhDaiDien(nguoiDungMoi.anhDaiDien);
      capNhatHoSo(nguoiDungMoi);
    } catch (loi) {
      setLoiLuuThongTin("Tải ảnh lên thất bại: " + loi.message);
    }
  }

  function doiMatKhau(e) {
    e.preventDefault();
    if (matKhauMoi.length < 6) {
      setLoiMatKhau("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (matKhauMoi !== xacNhanMatKhau) {
      setLoiMatKhau("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoiMatKhau("");
    // Trong dự án thật: axios.put("/api/nguoi-dung/toi/doi-mat-khau", { mat_khau_cu: matKhauCu, mat_khau_moi: matKhauMoi })
    setMatKhauCu(""); setMatKhauMoi(""); setXacNhanMatKhau("");
    alert("Đổi mật khẩu thành công.");
  }

  const CAC_TAB = [
    { ma: "tin_dang", nhan: "Tin đăng của tôi", icon: FileText },
    { ma: "thu_cung", nhan: "Thú cưng của tôi", icon: PawPrint },
    { ma: "tai_khoan", nhan: "Thông tin tài khoản", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] font-['Be_Vietnam_Pro']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Baloo 2', sans-serif; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {/* ============ HEADER RÚT GỌN ============ */}
      <header className="sticky top-0 z-30 bg-[#FDEBC2]/90 backdrop-blur border-b border-[#F5E6BC]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-[#1F6F5C]">
            <PawPrint className="h-6 w-6" />
            Bốn Chân Về Nhà
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-semibold text-[#7A6F5D] hover:text-[#1F6F5C]">
              ← Trang chủ
            </Link>
            <span className="hidden sm:block text-sm font-semibold text-[#7A6F5D]">Trang cá nhân</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* ============ THẺ HỒ SƠ ============ */}
        <div className="bg-white rounded-2xl border border-[#F0E4C4] p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
          <AvatarNguoiDung
            nguoiDung={{ hoTen, anhDaiDien }}
            kichThuoc="h-20 w-20"
            coChu="text-2xl"
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-display font-bold text-xl text-[#2B2420]">{hoTen}</h1>
            <p className="text-sm text-[#8A8072] mt-1">Tham gia từ tháng 3/2026 · TP. Huế</p>
            <div className="flex justify-center sm:justify-start gap-5 mt-3 text-sm">
              <span><b className="text-[#2B2420]">{danhSachTin.length}</b> <span className="text-[#8A8072]">tin đăng</span></span>
              <span><b className="text-[#2B2420]">{danhSachTin.filter(t => t.trangThai === "da_doan_tu").length}</b> <span className="text-[#8A8072]">đã đoàn tụ</span></span>
              <span><b className="text-[#2B2420]">{danhSachThuCung.length}</b> <span className="text-[#8A8072]">thú cưng</span></span>
            </div>
          </div>
          <button
            onClick={() => setTabDangChon("tai_khoan")}
            className="flex items-center gap-2 text-sm font-semibold text-[#1F6F5C] border border-[#1F6F5C] px-4 py-2 rounded-xl hover:bg-[#1F6F5C] hover:text-white transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Sửa hồ sơ
          </button>
        </div>

        {/* ============ TAB ĐIỀU HƯỚNG ============ */}
        <div className="flex gap-1 bg-white border border-[#F0E4C4] rounded-xl p-1 mb-6 overflow-x-auto">
          {CAC_TAB.map((tab) => {
            const Icon = tab.icon;
            const dangChon = tabDangChon === tab.ma;
            return (
              <button
                key={tab.ma}
                onClick={() => setTabDangChon(tab.ma)}
                style={dangChon ? { backgroundColor: "#1F6F5C", color: "#FFFFFF" } : undefined}
                className={
                  "flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors " +
                  (dangChon ? "" : "text-[#7A6F5D] hover:bg-[#FBF6EA]")
                }
              >
                <Icon className="h-4 w-4" />
                {tab.nhan}
              </button>
            );
          })}
        </div>

        {/* ============ TAB: TIN ĐĂNG CỦA TÔI ============ */}
        {tabDangChon === "tin_dang" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1.5">
                {[
                  { ma: "tat_ca", nhan: "Tất cả" },
                  { ma: "dang_tim", nhan: "Đang tìm" },
                  { ma: "da_doan_tu", nhan: "Đã đoàn tụ" },
                ].map((tt) => (
                  <button
                    key={tt.ma}
                    onClick={() => setLocTrangThai(tt.ma)}
                    style={locTrangThai === tt.ma ? { backgroundColor: "#F0A93B", borderColor: "#F0A93B", color: "#FFFFFF" } : undefined}
                    className={
                      "text-xs px-3 py-1.5 rounded-full border font-semibold " +
                      (locTrangThai === tt.ma ? "" : "border-[#F0E4C4] bg-white text-[#7A6F5D] font-normal")
                    }
                  >
                    {tt.nhan}
                  </button>
                ))}
              </div>
              <Link
                to="/dang-tin"
                style={{ backgroundColor: "#F0A93B", color: "#FFFFFF" }}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Đăng tin mới
              </Link>
            </div>

            {dangTaiTin ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E4C4]">
                <p className="text-[#8A8072] text-sm">Đang tải tin đăng...</p>
              </div>
            ) : loiTaiTin ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E4C4]">
                <p className="text-[#C1502E] text-sm">{loiTaiTin}</p>
              </div>
            ) : tinHienThi.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E4C4]">
                <PawPrint className="h-10 w-10 text-[#F0E4C4] mx-auto mb-3" />
                <p className="text-[#8A8072] text-sm">Bạn chưa có tin đăng nào ở trạng thái này.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tinHienThi.map((tin) => (
                  <div key={tin.id} className="rounded-2xl border border-[#F0E4C4] bg-white overflow-hidden">
                    <div className={"h-32 bg-gradient-to-br flex items-center justify-center " + tin.mauNen}>
                      <PawPrint className="h-9 w-9 text-white/80" strokeWidth={1.5} />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold uppercase text-[#1F6F5C] tracking-wide">
                        {NHAN_LOAI[tin.loaiThuCung]}
                      </span>
                      <h3 className="text-sm font-semibold text-[#2B2420] leading-snug my-2 line-clamp-2">
                        {tin.tieuDe}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-[#8A8072] mb-3">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{tin.khuVuc}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{tin.thoiGian}</span>
                      </div>
                      <TheTrangThai trangThai={tin.trangThai} />

                      <div className="flex gap-2 mt-3 pt-3 border-t border-[#F0E4C4]">
                        <button
                          onClick={() => moModalSuaTin(tin)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#5B5346] border border-[#F0E4C4] py-2 rounded-lg hover:bg-[#FBF6EA]"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Sửa
                        </button>
                        {tin.trangThai === "dang_tim" && (
                          <button
                            onClick={() => danhDauDaDoanTu(tin.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1F6F5C] border border-[#1F6F5C] py-2 rounded-lg hover:bg-[#1F6F5C] hover:text-white"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Đã đoàn tụ
                          </button>
                        )}
                        <button
                          onClick={() => setTinCanXoa(tin)}
                          className="flex items-center justify-center text-xs font-semibold text-[#C1502E] border border-[#F0E4C4] px-2.5 py-2 rounded-lg hover:bg-[#FCE9E1]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ TAB: THÚ CƯNG CỦA TÔI ============ */}
        {tabDangChon === "thu_cung" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {danhSachThuCung.map((tc) => (
              <div key={tc.id} className="rounded-2xl border border-[#F0E4C4] bg-white overflow-hidden">
                <div className={"h-28 bg-gradient-to-br flex items-center justify-center " + tc.mauNen}>
                  <PawPrint className="h-8 w-8 text-white/80" strokeWidth={1.5} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#2B2420]">{tc.ten}</h3>
                  <p className="text-xs text-[#8A8072] mt-0.5">{NHAN_LOAI[tc.loai]} · {tc.giong}</p>
                  {tc.moTa && <p className="text-xs text-[#8A8072] mt-1.5 line-clamp-2">{tc.moTa}</p>}
                  <button
                    onClick={() => moModalSuaThuCung(tc)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#5B5346] border border-[#F0E4C4] py-2 rounded-lg hover:bg-[#FBF6EA]"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Sửa hồ sơ
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={moModalThemThuCung}
              className="rounded-2xl border-2 border-dashed border-[#F0E4C4] bg-white flex flex-col items-center justify-center gap-2 py-10 text-[#B9AE95] hover:border-[#F0A93B] hover:text-[#F0A93B] transition-colors"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm font-semibold">Thêm thú cưng</span>
            </button>
          </div>
        )}

        {/* ============ TAB: THÔNG TIN TÀI KHOẢN ============ */}
        {tabDangChon === "tai_khoan" && (
          <div className="grid md:grid-cols-2 gap-5">
            {/* Thông tin cá nhân */}
            <form onSubmit={luuThongTinTaiKhoan} className="bg-white rounded-2xl border border-[#F0E4C4] p-6 space-y-4">
              <h2 className="font-semibold text-[#2B2420] mb-1">Thông tin cá nhân</h2>

              <div className="flex items-center gap-4">
                <AvatarNguoiDung nguoiDung={{ hoTen, anhDaiDien }} kichThuoc="h-14 w-14" coChu="text-lg" />
                <label className="flex items-center gap-2 text-xs font-semibold text-[#5B5346] border border-[#F0E4C4] px-3 py-2 rounded-lg cursor-pointer hover:bg-[#FBF6EA]">
                  <Upload className="h-3.5 w-3.5" />
                  Đổi ảnh đại diện
                  <input type="file" accept="image/*" hidden onChange={chonAnhDaiDien} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Họ và tên</label>
                <div className="relative">
                  <User className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    readOnly
                    title="Chưa hỗ trợ đổi email trong bản này"
                    className="w-full rounded-xl border border-[#F0E4C4] bg-[#FBF6EA] text-[#8A8072] pl-10 pr-4 py-2.5 text-sm outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Số điện thoại</label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                  />
                </div>
              </div>

              {loiLuuThongTin && (
                <p className="text-xs text-[#C1502E] bg-[#FCE9E1] rounded-lg px-3 py-2">{loiLuuThongTin}</p>
              )}
              <button
                type="submit"
                disabled={dangLuuThongTin}
                style={{ backgroundColor: "#1F6F5C", color: "#FFFFFF" }}
                className="w-full font-semibold text-sm py-2.5 rounded-xl transition-colors hover:opacity-90 disabled:opacity-60"
              >
                {dangLuuThongTin ? "Đang lưu..." : daLuuThongTin ? "Đã lưu ✓" : "Lưu thay đổi"}
              </button>
            </form>

            {/* Đổi mật khẩu */}
            <form onSubmit={doiMatKhau} className="bg-white rounded-2xl border border-[#F0E4C4] p-6 space-y-4">
              <h2 className="font-semibold text-[#2B2420] mb-1">Đổi mật khẩu</h2>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Mật khẩu hiện tại</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={matKhauCu}
                    onChange={(e) => setMatKhauCu(e.target.value)}
                    className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={matKhauMoi}
                    onChange={(e) => setMatKhauMoi(e.target.value)}
                    className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#B9AE95] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={xacNhanMatKhau}
                    onChange={(e) => setXacNhanMatKhau(e.target.value)}
                    className="w-full rounded-xl border border-[#F0E4C4] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                  />
                </div>
              </div>

              {loiMatKhau && <p className="text-xs text-[#C1502E]">{loiMatKhau}</p>}

              <button type="submit" className="w-full border border-[#1F6F5C] text-[#1F6F5C] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#1F6F5C] hover:text-white transition-colors">
                Đổi mật khẩu
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ============ MODAL XÁC NHẬN XÓA TIN ============ */}
      {tinCanXoa && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-5" onClick={() => setTinCanXoa(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#2B2420]">Xóa tin đăng?</h3>
              <button onClick={() => setTinCanXoa(null)}><X className="h-5 w-5 text-[#8A8072]" /></button>
            </div>
            <p className="text-sm text-[#7A6F5D] mb-5">
              Tin "<b>{tinCanXoa.tieuDe}</b>" sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setTinCanXoa(null)}
                className="flex-1 border border-[#F0E4C4] text-[#5B5346] font-semibold text-sm py-2.5 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={xacNhanXoaTin}
                style={{ backgroundColor: "#C1502E", color: "#FFFFFF" }}
                className="flex-1 font-semibold text-sm py-2.5 rounded-xl"
              >
                Xóa tin
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ============ MODAL SỬA BÀI ĐĂNG (UC-08) ============ */}
      {tinDangSua && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-5 py-8 overflow-y-auto" onClick={dongModalSuaTin}>
          <form
            onSubmit={luuSuaTin}
            className="bg-white rounded-2xl max-w-lg w-full p-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#2B2420]">Sửa bài đăng</h3>
              <button type="button" onClick={dongModalSuaTin}><X className="h-5 w-5 text-[#8A8072]" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Tiêu đề tin đăng</label>
                <input
                  type="text"
                  value={tinDangSua.tieuDe}
                  onChange={(e) => setTinDangSua({ ...tinDangSua, tieuDe: e.target.value })}
                  className="w-full rounded-xl border border-[#F0E4C4] px-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                />
                {loiSuaTin.tieuDe && <p className="text-xs text-[#C1502E] mt-1.5">{loiSuaTin.tieuDe}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Loại thú cưng</label>
                <div
                  className="inline-flex px-4 py-1.5 rounded-full text-sm border border-[#F0E4C4] text-[#7A6F5D] bg-[#FBF6EA]"
                  title="Chưa hỗ trợ đổi loại thú cưng sau khi đăng tin"
                >
                  {NHAN_LOAI[tinDangSua.loaiThuCung]}
                </div>
                <p className="text-xs text-[#B9AE95] mt-1.5">Không thể đổi loại thú cưng sau khi đã đăng tin.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Mô tả đặc điểm</label>
                <textarea
                  value={tinDangSua.moTa}
                  onChange={(e) => setTinDangSua({ ...tinDangSua, moTa: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-[#F0E4C4] px-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C] resize-none"
                />
                {loiSuaTin.moTa && <p className="text-xs text-[#C1502E] mt-1.5">{loiSuaTin.moTa}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Khu vực</label>
                  <select
                    value={tinDangSua.khuVuc}
                    onChange={(e) => setTinDangSua({ ...tinDangSua, khuVuc: e.target.value })}
                    className="w-full rounded-xl border border-[#F0E4C4] px-3 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                  >
                    {KHU_VUC_HUE.map((kv) => <option key={kv} value={kv}>{kv}</option>)}
                  </select>
                  {loiSuaTin.khuVuc && <p className="text-xs text-[#C1502E] mt-1.5">{loiSuaTin.khuVuc}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Ngày xảy ra</label>
                  <input
                    type="date"
                    value={tinDangSua.ngayXayRa}
                    onChange={(e) => setTinDangSua({ ...tinDangSua, ngayXayRa: e.target.value })}
                    className="w-full rounded-xl border border-[#F0E4C4] px-3 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                  />
                </div>
              </div>

              <p className="text-xs text-[#8A8072] bg-[#FBF6EA] rounded-lg px-3 py-2">
                Muốn đổi ảnh hoặc trạng thái tin đăng? Đóng cửa sổ này rồi dùng nút "Đã đoàn tụ" hoặc liên hệ quản trị viên nếu cần hỗ trợ thêm.
              </p>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={dongModalSuaTin}
                className="flex-1 border border-[#F0E4C4] text-[#5B5346] font-semibold text-sm py-2.5 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "#1F6F5C", color: "#FFFFFF" }}
                className="flex-1 font-semibold text-sm py-2.5 rounded-xl transition-opacity hover:opacity-90"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============ MODAL SỬA / THÊM HỒ SƠ THÚ CƯNG (UC-05) ============ */}
      {thuCungDangSua && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-5 py-8 overflow-y-auto" onClick={dongModalThuCung}>
          <form
            onSubmit={luuThuCung}
            className="bg-white rounded-2xl max-w-md w-full p-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#2B2420]">
                {thuCungDangSua.id === null ? "Thêm thú cưng" : "Sửa hồ sơ thú cưng"}
              </h3>
              <button type="button" onClick={dongModalThuCung}><X className="h-5 w-5 text-[#8A8072]" /></button>
            </div>

            {/* Ảnh đại diện */}
            <div className="flex items-center gap-4 mb-4">
              <div className={"h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br flex items-center justify-center shrink-0 " + thuCungDangSua.mauNen}>
                {anhXemTruocThuCung ? (
                  <img src={anhXemTruocThuCung} alt="Xem trước" className="h-full w-full object-cover" />
                ) : (
                  <PawPrint className="h-7 w-7 text-white/80" />
                )}
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#5B5346] border border-[#F0E4C4] px-3 py-2 rounded-lg cursor-pointer hover:bg-[#FBF6EA]">
                <Upload className="h-3.5 w-3.5" />
                Chọn ảnh đại diện
                <input type="file" accept="image/*" hidden onChange={chonAnhThuCung} />
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Tên thú cưng</label>
                <input
                  type="text"
                  value={thuCungDangSua.ten}
                  onChange={(e) => setThuCungDangSua({ ...thuCungDangSua, ten: e.target.value })}
                  placeholder="Ví dụ: Bún, Mimi..."
                  className="w-full rounded-xl border border-[#F0E4C4] px-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                />
                {loiThuCung.ten && <p className="text-xs text-[#C1502E] mt-1.5">{loiThuCung.ten}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Loại thú cưng</label>
                <div className="flex gap-2">
                  {["cho", "meo", "khac"].map((loai) => (
                    <button
                      key={loai}
                      type="button"
                      onClick={() => setThuCungDangSua({ ...thuCungDangSua, loai })}
                      style={thuCungDangSua.loai === loai ? { backgroundColor: "#F0A93B", borderColor: "#F0A93B", color: "#FFFFFF" } : undefined}
                      className={"px-4 py-1.5 rounded-full text-sm border font-medium " + (thuCungDangSua.loai === loai ? "" : "border-[#F0E4C4] text-[#7A6F5D]")}
                    >
                      {NHAN_LOAI[loai]}
                    </button>
                  ))}
                </div>
                {loiThuCung.loai && <p className="text-xs text-[#C1502E] mt-1.5">{loiThuCung.loai}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Giống</label>
                <input
                  type="text"
                  value={thuCungDangSua.giong}
                  onChange={(e) => setThuCungDangSua({ ...thuCungDangSua, giong: e.target.value })}
                  placeholder="Ví dụ: Poodle, Mèo Anh lông ngắn..."
                  className="w-full rounded-xl border border-[#F0E4C4] px-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F5D] mb-1.5">Đặc điểm nhận dạng</label>
                <textarea
                  value={thuCungDangSua.moTa}
                  onChange={(e) => setThuCungDangSua({ ...thuCungDangSua, moTa: e.target.value })}
                  rows={3}
                  placeholder="Màu lông, kích thước, vết sẹo, tính cách..."
                  className="w-full rounded-xl border border-[#F0E4C4] px-4 py-2.5 text-sm outline-none focus:border-[#1F6F5C] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              {thuCungDangSua.id !== null && (
                <button
                  type="button"
                  onClick={xoaThuCung}
                  style={{ backgroundColor: "#FCE9E1", color: "#C1502E" }}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Xóa
                </button>
              )}
              <button
                type="button"
                onClick={dongModalThuCung}
                className="flex-1 border border-[#F0E4C4] text-[#5B5346] font-semibold text-sm py-2.5 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "#1F6F5C", color: "#FFFFFF" }}
                className="flex-1 font-semibold text-sm py-2.5 rounded-xl transition-opacity hover:opacity-90"
              >
                Lưu hồ sơ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
