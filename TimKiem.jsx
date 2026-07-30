
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "./api";

function thoiGianTuongDoi(ngayDangIso) {
  if (!ngayDangIso) return "";
  const giay = Math.floor((Date.now() - new Date(ngayDangIso).getTime()) / 1000);
  if (giay < 60) return "Vừa xong";
  if (giay < 3600) return Math.floor(giay / 60) + " phút trước";
  if (giay < 86400) return Math.floor(giay / 3600) + " giờ trước";
  return Math.floor(giay / 86400) + " ngày trước";
}
import {
  Search,
  MapPin,
  PawPrint,
  Clock,
  List,
  Map as MapIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";

const KHU_VUC_HUE = [
  "Đông Ba", "Vỹ Dạ", "Kim Long", "Thành Nội", "An Cựu",
  "Bến Ngự", "Phú Hội", "Trường An", "Xuân Phú",
];

const MOCK_TIN_DANG = [
  { id: 1, tieuDe: "Chó Poodle màu nâu bị lạc gần chợ Đông Ba", loaiThuCung: "cho", loaiTin: "mat", khuVuc: "Đông Ba", thoiGian: "2 giờ trước", trangThai: "dang_tim", mauNen: "from-amber-200 to-amber-100", lat: 16.4712, lng: 107.5810 },
  { id: 2, tieuDe: "Phát hiện mèo Tam Thể lạc tại khu vực Vỹ Dạ", loaiThuCung: "meo", loaiTin: "phat_hien", khuVuc: "Vỹ Dạ", thoiGian: "5 giờ trước", trangThai: "dang_tim", mauNen: "from-teal-200 to-teal-100", lat: 16.4610, lng: 107.6020 },
  { id: 3, tieuDe: "Chó Corgi tên Bún đi lạc khu vực Kim Long", loaiThuCung: "cho", loaiTin: "mat", khuVuc: "Kim Long", thoiGian: "Hôm qua", trangThai: "da_doan_tu", mauNen: "from-rose-200 to-rose-100", lat: 16.4830, lng: 107.5660 },
  { id: 4, tieuDe: "Mèo Anh lông ngắn lạc gần Thành Nội", loaiThuCung: "meo", loaiTin: "phat_hien", khuVuc: "Thành Nội", thoiGian: "Hôm qua", trangThai: "dang_tim", mauNen: "from-sky-200 to-sky-100", lat: 16.4698, lng: 107.5789 },
  { id: 5, tieuDe: "Chó lai màu vàng, đeo vòng cổ đỏ, lạc ở An Cựu", loaiThuCung: "cho", loaiTin: "mat", khuVuc: "An Cựu", thoiGian: "2 ngày trước", trangThai: "dang_tim", mauNen: "from-orange-200 to-orange-100", lat: 16.4520, lng: 107.5850 },
  { id: 6, tieuDe: "Thỏ trắng lạc tại khu vực Bến Ngự", loaiThuCung: "khac", loaiTin: "phat_hien", khuVuc: "Bến Ngự", thoiGian: "3 ngày trước", trangThai: "da_doan_tu", mauNen: "from-emerald-200 to-emerald-100", lat: 16.4580, lng: 107.5750 },
  { id: 7, tieuDe: "Mèo mướp con bị lạc gần Phú Hội, có đeo chuông", loaiThuCung: "meo", loaiTin: "mat", khuVuc: "Phú Hội", thoiGian: "4 ngày trước", trangThai: "dang_tim", mauNen: "from-purple-200 to-purple-100", lat: 16.4650, lng: 107.5950 },
  { id: 8, tieuDe: "Phát hiện chó Husky lạc gần khu vực Trường An", loaiThuCung: "cho", loaiTin: "phat_hien", khuVuc: "Trường An", thoiGian: "5 ngày trước", trangThai: "dang_tim", mauNen: "from-cyan-200 to-cyan-100", lat: 16.4750, lng: 107.5600 },
];

const NHAN_LOAI = { cho: "Chó", meo: "Mèo", khac: "Khác" };

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

function TinDangCard({ tin }) {
  return (
    <div className="group rounded-2xl border border-[#F0E4C4] bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {tin.hinhAnh && tin.hinhAnh.length > 0 ? (
        <img src={tin.hinhAnh[0]} alt={tin.tieuDe} className="h-36 w-full object-cover" />
      ) : (
        <div className={"h-36 w-full bg-gradient-to-br flex items-center justify-center " + tin.mauNen}>
          <PawPrint className="h-10 w-10 text-white/80" strokeWidth={1.5} />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#1F6F5C]">
            {NHAN_LOAI[tin.loaiThuCung]} · {tin.loaiTin === "mat" ? "Tin tìm chủ" : "Tin đăng tìm thấy"}
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-[#2B2420] leading-snug mb-3 line-clamp-2">
          {tin.tieuDe}
        </h3>
        <div className="flex items-center justify-between text-sm text-[#8A8072] mb-3">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{tin.khuVuc}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{thoiGianTuongDoi(tin.ngayDang)}</span>
        </div>
        <div className="flex items-center justify-between">
          <TheTrangThai trangThai={tin.trangThai} />
          <Link to={`/tin/${tin.id}`} className="text-sm font-semibold text-[#1F6F5C] hover:underline">
            Xem chi tiết →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TimKiem() {
  const [tuKhoa, setTuKhoa] = useState("");
  const [locLoaiThuCung, setLocLoaiThuCung] = useState("tat_ca");
  const [locLoaiTin, setLocLoaiTin] = useState("tat_ca");
  const [locKhuVuc, setLocKhuVuc] = useState("");
  const [locTrangThai, setLocTrangThai] = useState("tat_ca");
  const [cheDoXem, setCheDoXem] = useState("danh_sach");
  const [boLocMoRong, setBoLocMoRong] = useState(false);
  const [tinDuocChon, setTinDuocChon] = useState(null);

  const [danhSachTin, setDanhSachTin] = useState([]);
  const [dangTaiTin, setDangTaiTin] = useState(true);
  const [loiTaiTin, setLoiTaiTin] = useState("");

  useEffect(() => {
    api
      .danhSachTinDang({ so_luong: 100 })
      .then(setDanhSachTin)
      .catch((loi) => setLoiTaiTin(loi.message))
      .finally(() => setDangTaiTin(false));
  }, []);

  const ketQua = useMemo(() => {
    return danhSachTin.filter((tin) => {
      const khopLoaiThuCung = locLoaiThuCung === "tat_ca" || tin.loaiThuCung === locLoaiThuCung;
      const khopLoaiTin = locLoaiTin === "tat_ca" || tin.loaiTin === locLoaiTin;
      const khopKhuVuc = locKhuVuc === "" || tin.khuVuc === locKhuVuc;
      const khopTrangThai = locTrangThai === "tat_ca" || tin.trangThai === locTrangThai;
      const khopTuKhoa =
        tuKhoa.trim() === "" ||
        tin.tieuDe.toLowerCase().includes(tuKhoa.toLowerCase()) ||
        tin.khuVuc.toLowerCase().includes(tuKhoa.toLowerCase());
      return khopLoaiThuCung && khopLoaiTin && khopKhuVuc && khopTrangThai && khopTuKhoa;
    });
  }, [danhSachTin, tuKhoa, locLoaiThuCung, locLoaiTin, locKhuVuc, locTrangThai]);

  function xoaBoLoc() {
    setTuKhoa("");
    setLocLoaiThuCung("tat_ca");
    setLocLoaiTin("tat_ca");
    setLocKhuVuc("");
    setLocTrangThai("tat_ca");
  }

  const coBoLocDangAp = locLoaiThuCung !== "tat_ca" || locLoaiTin !== "tat_ca" || locKhuVuc !== "" || locTrangThai !== "tat_ca";

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
          <span className="text-sm font-semibold text-[#7A6F5D]">Tìm kiếm</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-8">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#2B2420] mb-5">
          Tìm kiếm tin đăng thú cưng
        </h1>

        {}
        <div className="bg-white rounded-2xl border border-[#F0E4C4] p-2 flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex items-center flex-1 gap-2 px-3">
            <Search className="h-4 w-4 text-[#8A8072] shrink-0" />
            <input
              type="text"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm theo khu vực, đặc điểm thú cưng..."
              className="flex-1 outline-none text-sm py-2.5 bg-transparent"
            />
          </div>
          <button
            onClick={() => setBoLocMoRong(!boLocMoRong)}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-[#1F6F5C] border border-[#E1F0EA] bg-[#E1F0EA] px-4 py-2.5 rounded-xl sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Bộ lọc {coBoLocDangAp && <span className="h-2 w-2 rounded-full bg-[#F0A93B]" />}
          </button>
        </div>

        {}
        {boLocMoRong && (
          <div className="bg-white rounded-2xl border border-[#F0E4C4] p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#7A6F5D] mb-2">Loại thú cưng</p>
              <div className="flex flex-wrap gap-1.5">
                {["tat_ca", "cho", "meo", "khac"].map((lt) => (
                  <button
                    key={lt}
                    onClick={() => setLocLoaiThuCung(lt)}
                    style={locLoaiThuCung === lt ? { backgroundColor: "#F0A93B", borderColor: "#F0A93B", color: "#FFFFFF" } : undefined}
                    className={
                      "text-xs px-3 py-1.5 rounded-full border font-semibold " +
                      (locLoaiThuCung === lt ? "" : "border-[#F0E4C4] text-[#7A6F5D] font-normal")
                    }
                  >
                    {lt === "tat_ca" ? "Tất cả" : NHAN_LOAI[lt]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#7A6F5D] mb-2">Loại tin đăng</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { ma: "tat_ca", nhan: "Tất cả" },
                  { ma: "mat", nhan: "Tin tìm chủ" },
                  { ma: "phat_hien", nhan: "Tin tìm thấy" },
                ].map((lt) => (
                  <button
                    key={lt.ma}
                    onClick={() => setLocLoaiTin(lt.ma)}
                    style={locLoaiTin === lt.ma ? { backgroundColor: "#F0A93B", borderColor: "#F0A93B", color: "#FFFFFF" } : undefined}
                    className={
                      "text-xs px-3 py-1.5 rounded-full border font-semibold " +
                      (locLoaiTin === lt.ma ? "" : "border-[#F0E4C4] text-[#7A6F5D] font-normal")
                    }
                  >
                    {lt.nhan}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#7A6F5D] mb-2">Khu vực</p>
              <select
                value={locKhuVuc}
                onChange={(e) => setLocKhuVuc(e.target.value)}
                className="w-full text-sm rounded-lg border border-[#F0E4C4] px-3 py-2 outline-none"
              >
                <option value="">Tất cả khu vực</option>
                {KHU_VUC_HUE.map((kv) => <option key={kv} value={kv}>{kv}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#7A6F5D] mb-2">Trạng thái</p>
              <div className="flex flex-wrap gap-1.5">
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
                      (locTrangThai === tt.ma ? "" : "border-[#F0E4C4] text-[#7A6F5D] font-normal")
                    }
                  >
                    {tt.nhan}
                  </button>
                ))}
              </div>
            </div>

            {coBoLocDangAp && (
              <button onClick={xoaBoLoc} className="sm:col-span-2 lg:col-span-4 flex items-center gap-1.5 text-xs font-semibold text-[#C1502E] justify-self-start">
                <X className="h-3.5 w-3.5" /> Xóa toàn bộ bộ lọc
              </button>
            )}
          </div>
        )}

        {}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[#7A6F5D]">
            Tìm thấy <b className="text-[#2B2420]">{ketQua.length}</b> tin đăng
          </p>
          <div className="flex bg-white border border-[#F0E4C4] rounded-xl p-1">
            <button
              onClick={() => setCheDoXem("danh_sach")}
              style={cheDoXem === "danh_sach" ? { backgroundColor: "#1F6F5C", color: "#FFFFFF" } : undefined}
              className={"flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg " + (cheDoXem === "danh_sach" ? "" : "text-[#7A6F5D]")}
            >
              <List className="h-3.5 w-3.5" /> Danh sách
            </button>
            <button
              onClick={() => setCheDoXem("ban_do")}
              style={cheDoXem === "ban_do" ? { backgroundColor: "#1F6F5C", color: "#FFFFFF" } : undefined}
              className={"flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg " + (cheDoXem === "ban_do" ? "" : "text-[#7A6F5D]")}
            >
              <MapIcon className="h-3.5 w-3.5" /> Bản đồ
            </button>
          </div>
        </div>

        {}
        {dangTaiTin && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E4C4]">
            <p className="text-[#8A8072] text-sm">Đang tải tin đăng...</p>
          </div>
        )}
        {!dangTaiTin && loiTaiTin && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E4C4]">
            <p className="text-[#C1502E] text-sm">{loiTaiTin}</p>
          </div>
        )}

        {}
        {!dangTaiTin && !loiTaiTin && ketQua.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E4C4]">
            <PawPrint className="h-10 w-10 text-[#F0E4C4] mx-auto mb-3" />
            <p className="text-[#8A8072] text-sm">Không tìm thấy tin đăng phù hợp. Thử bỏ bớt bộ lọc xem sao.</p>
          </div>
        )}

        {}
        {ketQua.length > 0 && cheDoXem === "danh_sach" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ketQua.map((tin) => <TinDangCard key={tin.id} tin={tin} />)}
          </div>
        )}

        {}
        {ketQua.length > 0 && cheDoXem === "ban_do" && (
          <div className="grid md:grid-cols-3 gap-5">
            {}
            <div className="md:col-span-2 relative h-[420px] rounded-2xl overflow-hidden border border-[#F0E4C4] bg-[#DCEEE6]">
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: "linear-gradient(#c8dfd4 1px, transparent 1px), linear-gradient(90deg, #c8dfd4 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }} />
              {ketQua.map((tin, i) => (
                <button
                  key={tin.id}
                  onClick={() => setTinDuocChon(tin)}
                  style={{ top: `${15 + ((i * 37) % 70)}%`, left: `${10 + ((i * 53) % 80)}%` }}
                  className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center group"
                >
                  <span className={
                    "h-8 w-8 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform group-hover:scale-110 " +
                    (tin.trangThai === "dang_tim" ? "bg-[#C1502E]" : "bg-[#1F6F5C]")
                  }>
                    <PawPrint className="h-4 w-4 text-white" />
                  </span>
                </button>
              ))}
            </div>

            {}
            <div>
              {tinDuocChon ? (
                <TinDangCard tin={tinDuocChon} />
              ) : (
                <div className="h-full flex items-center justify-center text-center rounded-2xl border border-dashed border-[#F0E4C4] bg-white p-6">
                  <p className="text-sm text-[#8A8072]">
                    Nhấn vào một điểm ghim trên bản đồ để xem thông tin tin đăng.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
