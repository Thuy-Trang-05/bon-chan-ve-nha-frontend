
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  ShieldCheck,
  LayoutGrid,
  FileText,
  Users,
  Flag,
  MapPin,
  Clock,
  EyeOff,
  RotateCcw,
  Lock,
  Unlock,
  X,
  CheckCircle2,
  ScanSearch,
  AlertTriangle,
  Mail,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { useNguoiDung } from "./NguoiDungContext";
import AvatarNguoiDung from "./AvatarNguoiDung";
import { api } from "./api";

const MAU = { teal: "#1F6F5C", amber: "#F0A93B", coral: "#C1502E", chuDam: "#2B2420", chuNhat: "#7A6F5D" };

const TIN_DANG_QUAN_TRI = [
  { id: 1, tieuDe: "Chó Poodle màu nâu bị lạc gần chợ Đông Ba", moTa: "Lông xoăn màu nâu cà phê, đeo vòng cổ đỏ có lục lạc, khá nhút nhát với người lạ.", nguoiDang: "Trần Thu Thủy", khuVuc: "Đông Ba", thoiGian: "2 giờ trước", trangThai: "hien_thi" },
  { id: 2, tieuDe: "Phát hiện mèo Tam Thể lạc tại khu vực Vỹ Dạ", moTa: "Mèo tam thể, khoảng 1 tuổi, không đeo vòng cổ, khá dạn người.", nguoiDang: "Phạm Uyển Nhi", khuVuc: "Vỹ Dạ", thoiGian: "5 giờ trước", trangThai: "hien_thi" },
  { id: 3, tieuDe: "[Nghi ngờ spam] Bán chó cảnh giá rẻ, ib zalo...", moTa: "Nội dung quảng cáo bán thú cưng, không đúng mục đích tìm/trả thú lạc của hệ thống.", nguoiDang: "user_ct123", khuVuc: "An Cựu", thoiGian: "1 ngày trước", trangThai: "da_an" },
  { id: 4, tieuDe: "Chó Corgi tên Bún đi lạc khu vực Kim Long", moTa: "Chó Corgi lông vàng trắng, đã được chủ nhận lại sau 3 ngày đăng tin.", nguoiDang: "Võ Thị Thùy Trang", khuVuc: "Kim Long", thoiGian: "2 ngày trước", trangThai: "da_giai_quyet" },
];

const HO_SO_NGUOI_DANG = {
  "Trần Thu Thủy": { baoCaoTruocDo: [] },
  "Phạm Uyển Nhi": { baoCaoTruocDo: [] },
  "user_ct123": {
    baoCaoTruocDo: [
      { tieuDeTin: "[Nghi ngờ spam] Bán chó cảnh giá rẻ, ib zalo...", lyDo: "Nghi ngờ lừa đảo", ngay: "1 ngày trước", trangThai: "cho_xu_ly" },
      { tieuDeTin: "Thanh lý phụ kiện thú cưng inbox zalo...", lyDo: "Nội dung không phù hợp", ngay: "3 tuần trước", trangThai: "da_xu_ly" },
    ],
  },
  "Võ Thị Thùy Trang": { baoCaoTruocDo: [] },
};

const NGUOI_DUNG_QUAN_TRI = [
  { id: 1, ten: "Trần Thu Thủy", email: "thuthuy@example.com", ngayThamGia: "12/03/2026", soTin: 3, dangHoatDong: true },
  { id: 2, ten: "Phạm Uyển Nhi", email: "uyennhi@example.com", ngayThamGia: "28/03/2026", soTin: 5, dangHoatDong: true },
  { id: 3, ten: "user_ct123", email: "ct123@mail.com", ngayThamGia: "02/07/2026", soTin: 1, dangHoatDong: false },
  { id: 4, ten: "Võ Thị Thùy Trang", email: "thuytrang@example.com", ngayThamGia: "15/03/2026", soTin: 4, dangHoatDong: true },
];

const BAO_CAO_QUAN_TRI = [
  { id: 1, tinLienQuan: "[Nghi ngờ spam] Bán chó cảnh giá rẻ, ib zalo...", lyDo: "Nghi ngờ lừa đảo", nguoiBaoCao: "Trần Thu Thủy", ngay: "1 ngày trước", trangThai: "cho_xu_ly" },
  { id: 2, tinLienQuan: "Mèo Anh lông ngắn lạc gần Thành Nội", lyDo: "Tin đăng trùng lặp", nguoiBaoCao: "Phạm Uyển Nhi", ngay: "2 ngày trước", trangThai: "cho_xu_ly" },
  { id: 3, tinLienQuan: "Chó lai màu vàng, đeo vòng cổ đỏ, lạc ở An Cựu", lyDo: "Thông tin sai sự thật", nguoiBaoCao: "Võ Thị Thùy Trang", ngay: "4 ngày trước", trangThai: "da_xu_ly" },
];

function NutMau({ mau, children, onClick, nho }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: mau, color: "#FFFFFF" }}
      className={"flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-opacity hover:opacity-90 " + (nho ? "text-xs px-2.5 py-1.5" : "text-sm px-4 py-2")}
    >
      {children}
    </button>
  );
}

function TheTrangThaiTin({ trangThai }) {
  const cauHinh = {
    hien_thi: { nen: "#E1F0EA", chu: MAU.teal, nhan: "Đang hiển thị" },
    da_an: { nen: "#FCE9E1", chu: MAU.coral, nhan: "Đã gỡ" },
    da_giai_quyet: { nen: "#EAE6F2", chu: "#6B4C93", nhan: "Đã đoàn tụ" },
  }[trangThai];
  return (
    <span style={{ backgroundColor: cauHinh.nen, color: cauHinh.chu }} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
      {cauHinh.nhan}
    </span>
  );
}

export default function TrangAdmin() {
  const { nguoiDung, dangXuat } = useNguoiDung();
  const [tabDangChon, setTabDangChon] = useState("tong_quan");
  const [danhSachTin, setDanhSachTin] = useState([]);
  const [danhSachNguoiDung, setDanhSachNguoiDung] = useState([]);
  const [danhSachBaoCao, setDanhSachBaoCao] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loiTai, setLoiTai] = useState("");
  const [nguoiDungCanKhoa, setNguoiDungCanKhoa] = useState(null);
  const [tinDoiChieu, setTinDoiChieu] = useState(null);

  useEffect(() => {
    Promise.all([api.admin.danhSachTinDang(), api.admin.danhSachNguoiDung(), api.admin.danhSachBaoCao()])
      .then(([tin, nguoiDung, baoCao]) => {
        setDanhSachTin(tin);
        setDanhSachNguoiDung(nguoiDung);
        setDanhSachBaoCao(baoCao);
      })
      .catch((loi) => setLoiTai(loi.message))
      .finally(() => setDangTai(false));
  }, []);

  function layBaoCaoTruocDo(nguoiDangId) {
    return danhSachBaoCao.filter((b) => b.nguoiBiBaoCaoId === nguoiDangId);
  }

  async function toggleTrangThaiTin(id) {
    const tinHienTai = danhSachTin.find((t) => t.id === id);
    if (!tinHienTai) return;
    try {
      const tinMoi =
        tinHienTai.trangThai === "da_an"
          ? await api.admin.hienTinDang(id)
          : await api.admin.anTinDang(id);
      setDanhSachTin((truoc) => truoc.map((t) => (t.id === id ? tinMoi : t)));
    } catch (loi) {
      alert("Không thể cập nhật tin đăng: " + loi.message);
    }
  }

  async function xacNhanKhoaTaiKhoan() {
    try {
      const nguoiDungMoi = await api.admin.khoaMoKhoaNguoiDung(nguoiDungCanKhoa.id);
      setDanhSachNguoiDung((truoc) => truoc.map((n) => (n.id === nguoiDungCanKhoa.id ? nguoiDungMoi : n)));
      setNguoiDungCanKhoa(null);
    } catch (loi) {
      alert("Không thể cập nhật tài khoản: " + loi.message);
      setNguoiDungCanKhoa(null);
    }
  }

  async function xuLyBaoCao(id) {
    try {
      const baoCaoMoi = await api.admin.xuLyBaoCao(id);
      setDanhSachBaoCao((truoc) => truoc.map((b) => (b.id === id ? baoCaoMoi : b)));
    } catch (loi) {
      alert("Không thể xử lý báo cáo: " + loi.message);
    }
  }

  async function goTinViPham(baoCao) {
    try {
      const [tinMoi] = await Promise.all([api.admin.anTinDang(baoCao.tinDangId), api.admin.xuLyBaoCao(baoCao.id)]);
      setDanhSachTin((truoc) => truoc.map((t) => (t.id === baoCao.tinDangId ? tinMoi : t)));
      setDanhSachBaoCao((truoc) => truoc.map((b) => (b.id === baoCao.id ? { ...b, trangThai: "da_xu_ly" } : b)));
    } catch (loi) {
      alert("Không thể gỡ tin: " + loi.message);
    }
  }

  const soTinChoXuLy = danhSachBaoCao.filter((b) => b.trangThai === "cho_xu_ly").length;

  const CAC_TAB = [
    { ma: "tong_quan", nhan: "Tổng quan", icon: LayoutGrid },
    { ma: "tin_dang", nhan: "Kiểm duyệt tin đăng", icon: FileText },
    { ma: "nguoi_dung", nhan: "Người dùng", icon: Users },
    { ma: "bao_cao", nhan: "Báo cáo vi phạm", icon: Flag, soLuong: soTinChoXuLy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] font-['Be_Vietnam_Pro']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Baloo 2', sans-serif; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {}
      <header className="sticky top-0 z-30 bg-[#FDEBC2]/90 backdrop-blur border-b border-[#F5E6BC]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-[#1F6F5C]">
            <PawPrint className="h-6 w-6" />
            Bốn Chân Về Nhà
          </Link>
          <div className="flex items-center gap-3">
            <span style={{ backgroundColor: "#6B4C93", color: "#FFFFFF" }} className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" />
              Chế độ quản trị
            </span>
            <AvatarNguoiDung nguoiDung={nguoiDung} kichThuoc="h-9 w-9" />
            <button
              onClick={dangXuat}
              title="Đăng xuất"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#7A6F5D] hover:text-[#C1502E]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-8">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#2B2420] mb-6">
          Bảng điều khiển quản trị
        </h1>

        {dangTai ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E4C4]">
            <p className="text-[#8A8072] text-sm">Đang tải dữ liệu quản trị...</p>
          </div>
        ) : loiTai ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E4C4]">
            <p className="text-[#C1502E] text-sm">{loiTai}</p>
          </div>
        ) : (
        <>
        {}
        <div className="flex gap-1 bg-white border border-[#F0E4C4] rounded-xl p-1 mb-6 overflow-x-auto">
          {CAC_TAB.map((tab) => {
            const Icon = tab.icon;
            const dangChon = tabDangChon === tab.ma;
            return (
              <button
                key={tab.ma}
                onClick={() => setTabDangChon(tab.ma)}
                style={dangChon ? { backgroundColor: MAU.teal, color: "#FFFFFF" } : undefined}
                className={
                  "relative flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors " +
                  (dangChon ? "" : "text-[#7A6F5D] hover:bg-[#FBF6EA]")
                }
              >
                <Icon className="h-4 w-4" />
                {tab.nhan}
                {!!tab.soLuong && (
                  <span
                    style={{ backgroundColor: dangChon ? "#FFFFFF" : MAU.coral, color: dangChon ? MAU.teal : "#FFFFFF" }}
                    className="text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center"
                  >
                    {tab.soLuong}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {}
        {tabDangChon === "tong_quan" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { nhan: "Tổng tin đăng", giaTri: danhSachTin.length, mau: MAU.teal },
              { nhan: "Đã đoàn tụ", giaTri: danhSachTin.filter((t) => t.trangThai === "da_giai_quyet").length, mau: "#6B4C93" },
              { nhan: "Tổng người dùng", giaTri: danhSachNguoiDung.length, mau: MAU.amber },
              { nhan: "Báo cáo chờ xử lý", giaTri: soTinChoXuLy, mau: MAU.coral },
            ].map((tk) => (
              <div key={tk.nhan} className="bg-white rounded-2xl border border-[#F0E4C4] p-5">
                <p className="text-xs font-semibold text-[#8A8072] uppercase mb-2">{tk.nhan}</p>
                <p style={{ color: tk.mau }} className="text-3xl font-bold font-display">{tk.giaTri}</p>
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-4 bg-white rounded-2xl border border-[#F0E4C4] p-5">
              <h2 className="font-semibold text-[#2B2420] mb-3">Việc cần xử lý</h2>
              {soTinChoXuLy === 0 ? (
                <p className="text-sm text-[#8A8072]">Không có báo cáo nào đang chờ xử lý. 🎉</p>
              ) : (
                <button
                  onClick={() => setTabDangChon("bao_cao")}
                  className="text-sm font-semibold text-[#1F6F5C] hover:underline"
                >
                  Có {soTinChoXuLy} báo cáo vi phạm đang chờ xử lý →
                </button>
              )}
            </div>
          </div>
        )}

        {}
        {tabDangChon === "tin_dang" && (
          <div className="bg-white rounded-2xl border border-[#F0E4C4] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0E4C4] text-left text-xs text-[#8A8072] uppercase">
                  <th className="px-5 py-3 font-semibold">Tin đăng</th>
                  <th className="px-5 py-3 font-semibold">Người đăng</th>
                  <th className="px-5 py-3 font-semibold">Trạng thái</th>
                  <th className="px-5 py-3 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {danhSachTin.map((tin) => (
                  <tr key={tin.id} className="border-b border-[#F0E4C4] last:border-0">
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-medium text-[#2B2420] line-clamp-2">{tin.tieuDe}</p>
                      <div className="flex items-center gap-3 text-xs text-[#8A8072] mt-1">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tin.khuVuc}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tin.thoiGian}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#5B5346]">{tin.nguoiDang}</td>
                    <td className="px-5 py-4"><TheTrangThaiTin trangThai={tin.trangThai} /></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setTinDoiChieu(tin)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#7A6F5D] border border-[#F0E4C4] px-2.5 py-1.5 rounded-lg hover:bg-[#FBF6EA]"
                        >
                          <ScanSearch className="h-3.5 w-3.5" /> Đối chiếu hồ sơ
                        </button>
                        {tin.trangThai === "da_an" ? (
                          <NutMau mau={MAU.teal} nho onClick={() => toggleTrangThaiTin(tin.id)}>
                            <RotateCcw className="h-3.5 w-3.5" /> Khôi phục
                          </NutMau>
                        ) : tin.trangThai === "hien_thi" ? (
                          <NutMau mau={MAU.coral} nho onClick={() => toggleTrangThaiTin(tin.id)}>
                            <EyeOff className="h-3.5 w-3.5" /> Gỡ tin
                          </NutMau>
                        ) : (
                          <span className="text-xs text-[#B9AE95]">Đã kết thúc</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {}
        {tabDangChon === "nguoi_dung" && (
          <div className="bg-white rounded-2xl border border-[#F0E4C4] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0E4C4] text-left text-xs text-[#8A8072] uppercase">
                  <th className="px-5 py-3 font-semibold">Người dùng</th>
                  <th className="px-5 py-3 font-semibold">Ngày tham gia</th>
                  <th className="px-5 py-3 font-semibold">Số tin đăng</th>
                  <th className="px-5 py-3 font-semibold">Trạng thái</th>
                  <th className="px-5 py-3 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {danhSachNguoiDung.map((nd) => (
                  <tr key={nd.id} className="border-b border-[#F0E4C4] last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div style={{ backgroundColor: MAU.teal, color: "#FFFFFF" }} className="h-8 w-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0">
                          {nd.ten.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-[#2B2420]">{nd.ten}</p>
                          <p className="text-xs text-[#8A8072]">{nd.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#5B5346]">{nd.ngayThamGia}</td>
                    <td className="px-5 py-4 text-[#5B5346]">{nd.soTin}</td>
                    <td className="px-5 py-4">
                      <span
                        style={nd.dangHoatDong ? { backgroundColor: "#E1F0EA", color: MAU.teal } : { backgroundColor: "#FCE9E1", color: MAU.coral }}
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      >
                        {nd.dangHoatDong ? "Đang hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {nd.dangHoatDong ? (
                        <NutMau mau={MAU.coral} nho onClick={() => setNguoiDungCanKhoa(nd)}>
                          <Lock className="h-3.5 w-3.5" /> Khóa
                        </NutMau>
                      ) : (
                        <NutMau mau={MAU.teal} nho onClick={() => setNguoiDungCanKhoa(nd)}>
                          <Unlock className="h-3.5 w-3.5" /> Mở khóa
                        </NutMau>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {}
        {tabDangChon === "bao_cao" && (
          <div className="space-y-3">
            {danhSachBaoCao.map((bc) => (
              <div key={bc.id} className="bg-white rounded-2xl border border-[#F0E4C4] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span style={{ backgroundColor: "#FCE9E1", color: MAU.coral }} className="text-xs font-semibold px-2.5 py-1 rounded-full">
                      {bc.lyDo}
                    </span>
                    {bc.trangThai === "da_xu_ly" && (
                      <span style={{ backgroundColor: "#E1F0EA", color: MAU.teal }} className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Đã xử lý
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#2B2420]">{bc.tinLienQuan}</p>
                  <p className="text-xs text-[#8A8072] mt-1">Báo cáo bởi {bc.nguoiBaoCao} · {bc.ngay}</p>
                </div>

                {bc.trangThai === "cho_xu_ly" && (
                  <div className="flex gap-2 shrink-0">
                    <NutMau mau={MAU.coral} onClick={() => goTinViPham(bc)}>
                      <EyeOff className="h-4 w-4" /> Gỡ tin vi phạm
                    </NutMau>
                    <button
                      onClick={() => xuLyBaoCao(bc.id)}
                      className="text-sm font-semibold text-[#7A6F5D] border border-[#F0E4C4] px-4 py-2 rounded-lg hover:bg-[#FBF6EA]"
                    >
                      Bỏ qua
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </div>

      {}
      {tinDoiChieu && (() => {
        const nguoiDang = danhSachNguoiDung.find((n) => n.id === tinDoiChieu.nguoiDangId);
        const soTinCuaNguoiDang = danhSachTin.filter((t) => t.nguoiDangId === tinDoiChieu.nguoiDangId).length;
        const baoCaoTruocDo = layBaoCaoTruocDo(tinDoiChieu.nguoiDangId);
        const baoCaoChuaXuLy = baoCaoTruocDo.filter((b) => b.trangThai === "cho_xu_ly");

        return (
          <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-5 py-8 overflow-y-auto" onClick={() => setTinDoiChieu(null)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#2B2420] flex items-center gap-2">
                  <ScanSearch className="h-5 w-5 text-[#1F6F5C]" />
                  Đối chiếu hồ sơ trước khi xử lý
                </h3>
                <button onClick={() => setTinDoiChieu(null)}><X className="h-5 w-5 text-[#8A8072]" /></button>
              </div>

              {}
              {baoCaoChuaXuLy.length > 0 && (
                <div style={{ backgroundColor: "#FCE9E1" }} className="flex items-start gap-2.5 rounded-xl p-3.5 mb-4">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: MAU.coral }} />
                  <p className="text-xs leading-relaxed" style={{ color: MAU.coral }}>
                    Tài khoản này đang có <b>{baoCaoChuaXuLy.length} báo cáo vi phạm chưa xử lý</b> ở những tin khác. Cân nhắc kỹ trước khi quyết định.
                  </p>
                </div>
              )}

              {}
              <div className="border border-[#F0E4C4] rounded-xl p-4 mb-3">
                <p className="text-xs font-semibold text-[#8A8072] uppercase mb-1.5">Tin đăng đang xử lý</p>
                <p className="text-sm font-semibold text-[#2B2420] mb-1">{tinDoiChieu.tieuDe}</p>
                <p className="text-xs text-[#5B5346] mb-2">{tinDoiChieu.moTa}</p>
                <div className="flex items-center gap-3 text-xs text-[#8A8072]">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tinDoiChieu.khuVuc}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tinDoiChieu.thoiGian}</span>
                  <TheTrangThaiTin trangThai={tinDoiChieu.trangThai} />
                </div>
              </div>

              {}
              <div className="border border-[#F0E4C4] rounded-xl p-4 mb-3">
                <p className="text-xs font-semibold text-[#8A8072] uppercase mb-2">Người đăng</p>
                <div className="flex items-center gap-3 mb-2">
                  <div style={{ backgroundColor: MAU.teal, color: "#FFFFFF" }} className="h-9 w-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                    {tinDoiChieu.nguoiDang.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2B2420]">{tinDoiChieu.nguoiDang}</p>
                    {nguoiDang && <p className="text-xs text-[#8A8072] flex items-center gap-1"><Mail className="h-3 w-3" />{nguoiDang.email}</p>}
                  </div>
                </div>
                {nguoiDang && (
                  <div className="flex items-center gap-4 text-xs text-[#7A6F5D]">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />Tham gia {nguoiDang.ngayThamGia}</span>
                    <span>{soTinCuaNguoiDang} tin đã đăng</span>
                    <span
                      style={nguoiDang.dangHoatDong ? { color: MAU.teal } : { color: MAU.coral }}
                      className="font-semibold"
                    >
                      {nguoiDang.dangHoatDong ? "Đang hoạt động" : "Đã khóa"}
                    </span>
                  </div>
                )}
              </div>

              {}
              <div className="border border-[#F0E4C4] rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-[#8A8072] uppercase mb-2">Lịch sử báo cáo liên quan đến người này</p>
                {baoCaoTruocDo.length === 0 ? (
                  <p className="text-xs text-[#8A8072]">Chưa từng bị báo cáo trước đây.</p>
                ) : (
                  <div className="space-y-2">
                    {baoCaoTruocDo.map((bc, i) => (
                      <div key={i} className="flex items-start justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <p className="text-[#2B2420] font-medium line-clamp-1">{bc.tinLienQuan}</p>
                          <p className="text-[#8A8072]">{bc.lyDo} · {bc.ngay}</p>
                        </div>
                        <span
                          style={bc.trangThai === "cho_xu_ly" ? { backgroundColor: "#FCE9E1", color: MAU.coral } : { backgroundColor: "#E1F0EA", color: MAU.teal }}
                          className="shrink-0 px-2 py-0.5 rounded-full font-semibold"
                        >
                          {bc.trangThai === "cho_xu_ly" ? "Chưa xử lý" : "Đã xử lý"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {}
              <div className="flex flex-wrap gap-2">
                {tinDoiChieu.trangThai === "hien_thi" ? (
                  <NutMau mau={MAU.coral} onClick={() => { toggleTrangThaiTin(tinDoiChieu.id); setTinDoiChieu(null); }}>
                    <EyeOff className="h-4 w-4" /> Gỡ tin này
                  </NutMau>
                ) : tinDoiChieu.trangThai === "da_an" ? (
                  <NutMau mau={MAU.teal} onClick={() => { toggleTrangThaiTin(tinDoiChieu.id); setTinDoiChieu(null); }}>
                    <RotateCcw className="h-4 w-4" /> Khôi phục tin này
                  </NutMau>
                ) : null}

                {nguoiDang && nguoiDang.dangHoatDong && (
                  <button
                    onClick={() => { setNguoiDungCanKhoa(nguoiDang); setTinDoiChieu(null); }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#7A6F5D] border border-[#F0E4C4] px-4 py-2 rounded-lg hover:bg-[#FBF6EA]"
                  >
                    <Lock className="h-3.5 w-3.5" /> Khóa tài khoản người này
                  </button>
                )}

                <button
                  onClick={() => setTinDoiChieu(null)}
                  className="ml-auto text-sm font-semibold text-[#7A6F5D] px-4 py-2"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {}
      {nguoiDungCanKhoa && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-5" onClick={() => setNguoiDungCanKhoa(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#2B2420]">
                {nguoiDungCanKhoa.dangHoatDong ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
              </h3>
              <button onClick={() => setNguoiDungCanKhoa(null)}><X className="h-5 w-5 text-[#8A8072]" /></button>
            </div>
            <p className="text-sm text-[#7A6F5D] mb-5">
              Tài khoản "<b>{nguoiDungCanKhoa.ten}</b>"{" "}
              {nguoiDungCanKhoa.dangHoatDong
                ? "sẽ không thể đăng nhập hoặc đăng tin cho đến khi được mở khóa lại."
                : "sẽ được phép đăng nhập và sử dụng hệ thống bình thường trở lại."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setNguoiDungCanKhoa(null)}
                className="flex-1 border border-[#F0E4C4] text-[#5B5346] font-semibold text-sm py-2.5 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={xacNhanKhoaTaiKhoan}
                style={{ backgroundColor: nguoiDungCanKhoa.dangHoatDong ? MAU.coral : MAU.teal, color: "#FFFFFF" }}
                className="flex-1 font-semibold text-sm py-2.5 rounded-xl"
              >
                {nguoiDungCanKhoa.dangHoatDong ? "Khóa tài khoản" : "Mở khóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
