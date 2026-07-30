
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "./api";

function dinhDangNgay(ngayIso) {
  if (!ngayIso) return "";
  const d = new Date(ngayIso);
  return `Đăng lúc ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}, ngày ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
}
import {
  PawPrint,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Flag,
  ArrowLeft,
  Navigation,
  X,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";

const TIN_MAU = {
  id: 1,
  tieuDe: "Chó Poodle màu nâu bị lạc gần chợ Đông Ba",
  loaiThuCung: "cho",
  loaiTin: "mat",
  trangThai: "dang_tim",
  khuVuc: "Đông Ba, TP. Huế",
  thoiGianDang: "Đăng lúc 14:20, hôm nay",
  ngayXayRa: "13/07/2026",
  lat: 16.4695,
  lng: 107.5855,
  moTa:
    "Bé Poodle tên Bún, khoảng 2 tuổi, lông xoăn màu nâu cà phê, nặng khoảng 4kg. " +
    "Đeo vòng cổ da màu đỏ, có lục lạc nhỏ phát ra tiếng kêu khi di chuyển. " +
    "Bé khá nhút nhát với người lạ nhưng không cắn, chỉ chạy trốn khi bị tiếp cận gần. " +
    "Đi lạc từ khoảng 12 giờ trưa gần khu vực chợ Đông Ba, mong mọi người để ý giúp gia đình.",
  anh: [
    "from-amber-300 to-amber-100",
    "from-orange-300 to-orange-100",
    "from-yellow-300 to-yellow-100",
  ],
  nguoiDang: { ten: "Trần Thu Thủy", hienThiSDT: true, soDienThoai: "0905 123 456" },
};

const GOI_Y_ANH_TUONG_DONG = [
  { id: 5, tieuDe: "Chó lai màu vàng, đeo vòng cổ đỏ, lạc ở An Cựu", khuVuc: "An Cựu", thoiGian: "2 ngày trước", trangThai: "dang_tim", mauNen: "from-orange-200 to-orange-100", doGiong: 87 },
  { id: 8, tieuDe: "Phát hiện chó Husky lạc gần khu vực Trường An", khuVuc: "Trường An", thoiGian: "5 ngày trước", trangThai: "dang_tim", mauNen: "from-cyan-200 to-cyan-100", doGiong: 74 },
  { id: 2, tieuDe: "Phát hiện mèo Tam Thể lạc tại khu vực Vỹ Dạ", khuVuc: "Vỹ Dạ", thoiGian: "5 giờ trước", trangThai: "dang_tim", mauNen: "from-teal-200 to-teal-100", doGiong: 61 },
].sort((a, b) => b.doGiong - a.doGiong);

const LY_DO_BAO_CAO = [
  "Thông tin sai sự thật",
  "Nội dung không phù hợp",
  "Nghi ngờ lừa đảo",
  "Tin đăng trùng lặp",
  "Khác",
];

function TheTrangThai({ trangThai, kichThuocLon }) {
  const dangTim = trangThai === "dang_tim";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1 font-semibold " +
        (kichThuocLon ? "text-sm" : "text-xs") + " " +
        (dangTim ? "bg-[#FCE9E1] text-[#C1502E]" : "bg-[#E1F0EA] text-[#1F6F5C]")
      }
    >
      <span className={"rounded-full border-2 bg-white " + (kichThuocLon ? "h-4 w-4" : "h-3.5 w-3.5") + " " + (dangTim ? "border-[#C1502E]" : "border-[#1F6F5C]")} />
      {dangTim ? "Đang tìm" : "Đã đoàn tụ"}
    </span>
  );
}

export default function ChiTietTinDang() {
  const { id } = useParams();
  const [tin, setTin] = useState(null);
  const [dangTai, setDangTai] = useState(true);
  const [loiTai, setLoiTai] = useState("");
  const [anhDangChon, setAnhDangChon] = useState(0);
  const [hienModalBaoCao, setHienModalBaoCao] = useState(false);
  const [lyDoBaoCao, setLyDoBaoCao] = useState("");
  const [moTaBaoCao, setMoTaBaoCao] = useState("");
  const [daGuiBaoCao, setDaGuiBaoCao] = useState(false);
  const [dangGuiBaoCao, setDangGuiBaoCao] = useState(false);

  useEffect(() => {
    setDangTai(true);
    setLoiTai("");
    api
      .chiTietTinDang(id)
      .then(setTin)
      .catch((loi) => setLoiTai(loi.message))
      .finally(() => setDangTai(false));
  }, [id]);

  async function guiBaoCao() {
    if (!lyDoBaoCao) return;
    setDangGuiBaoCao(true);
    try {
      const lyDoDayDu = moTaBaoCao ? `${lyDoBaoCao}: ${moTaBaoCao}` : lyDoBaoCao;
      await api.baoCaoViPham(tin.id, lyDoDayDu);
      setDaGuiBaoCao(true);
    } catch (loi) {
      alert("Gửi báo cáo thất bại: " + loi.message);
    } finally {
      setDangGuiBaoCao(false);
    }
  }

  function dongModalBaoCao() {
    setHienModalBaoCao(false);
    setDaGuiBaoCao(false);
    setLyDoBaoCao("");
    setMoTaBaoCao("");
  }

  if (dangTai) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] flex items-center justify-center">
        <p className="text-[#8A8072] text-sm">Đang tải tin đăng...</p>
      </div>
    );
  }

  if (loiTai || !tin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDEBC2] via-[#FDF3DA] to-[#FEFAF1] flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-[#C1502E] text-sm mb-4">{loiTai || "Không tìm thấy tin đăng."}</p>
          <Link to="/tim-kiem" className="text-sm font-semibold text-[#1F6F5C] hover:underline">
            ← Quay lại tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  const linkChiDuong = `https://www.google.com/maps/dir/?api=1&destination=${tin.viDo},${tin.kinhDo}`;
  const linkNhanTin = tin.nguoiDang
    ? `/nhan-tin?tinDangId=${tin.id}&nguoiKiaId=${tin.nguoiDang.id}` +
      `&tenNguoiKia=${encodeURIComponent(tin.nguoiDang.hoTen || "")}` +
      `&tieuDeTin=${encodeURIComponent(tin.tieuDe || "")}`
    : "/nhan-tin";

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
          <Link to="/tim-kiem" className="flex items-center gap-1.5 text-sm font-semibold text-[#7A6F5D] hover:text-[#1F6F5C]">
            <ArrowLeft className="h-4 w-4" />
            Quay lại tìm kiếm
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-8 grid lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <div>
            {tin.hinhAnh && tin.hinhAnh.length > 0 ? (
              <>
                <img
                  src={tin.hinhAnh[anhDangChon]}
                  alt={tin.tieuDe}
                  className="h-72 w-full rounded-2xl object-cover"
                />
                {tin.hinhAnh.length > 1 && (
                  <div className="flex gap-2 mt-2">
                    {tin.hinhAnh.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setAnhDangChon(i)}
                        className={
                          "h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors " +
                          (anhDangChon === i ? "border-[#1F6F5C]" : "border-transparent")
                        }
                      >
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-72 w-full rounded-2xl bg-gradient-to-br from-[#F0A93B] to-[#F3C070] flex items-center justify-center">
                <PawPrint className="h-16 w-16 text-white/80" strokeWidth={1.5} />
              </div>
            )}
          </div>

          {}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#1F6F5C] bg-[#E1F0EA] px-2.5 py-1 rounded-full">
                {tin.loaiTin === "mat" ? "Tin tìm chủ" : "Tin đăng tìm thấy"}
              </span>
              <TheTrangThai trangThai={tin.trangThai} kichThuocLon />
            </div>
            <h1 className="font-display font-bold text-2xl text-[#2B2420] leading-snug mb-3">
              {tin.tieuDe}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-[#7A6F5D]">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{tin.khuVuc}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{dinhDangNgay(tin.ngayDang)}</span>
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl border border-[#F0E4C4] p-5">
            <h2 className="font-semibold text-[#2B2420] mb-3">Mô tả chi tiết</h2>
            <p className="text-sm text-[#5B5346] leading-relaxed">{tin.moTa}</p>
          </div>

          {}
          <div className="bg-white rounded-2xl border border-[#F0E4C4] p-5">
            <h2 className="font-semibold text-[#2B2420] mb-3">Vị trí trên bản đồ</h2>

            {}
            <div className="relative h-56 rounded-xl overflow-hidden bg-[#DCEEE6] mb-3">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(#c8dfd4 1px, transparent 1px), linear-gradient(90deg, #c8dfd4 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                <span className="h-9 w-9 rounded-full bg-[#C1502E] border-2 border-white shadow-md flex items-center justify-center">
                  <PawPrint className="h-4 w-4 text-white" />
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8072] font-mono text-xs">{tin.viDo}, {tin.kinhDo}</span>
              <a
                href={linkChiDuong}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-semibold text-[#1F6F5C] hover:underline"
              >
                <Navigation className="h-4 w-4" />
                Chỉ đường trên Google Maps
              </a>
            </div>
          </div>

          {}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4" style={{ color: "#6B4C93" }} />
              <h2 className="font-semibold text-[#2B2420]">Có thể là cùng một bé?</h2>
            </div>
            <p className="text-xs text-[#8A8072] flex items-start gap-1.5 mb-3">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Hệ thống so sánh ảnh bằng kỹ thuật Perceptual Hashing để tìm các tin có ảnh trông giống ảnh bạn đang xem — chỉ mang tính gợi ý, bạn nên tự đối chiếu kỹ trước khi liên hệ.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {GOI_Y_ANH_TUONG_DONG.map((t) => (
                <Link
                  key={t.id}
                  to={`/tin/${t.id}`}
                  className="rounded-xl border border-[#F0E4C4] bg-white overflow-hidden hover:shadow-md transition-shadow block"
                >
                  <div className={"h-20 bg-gradient-to-br flex items-center justify-center relative " + t.mauNen}>
                    <PawPrint className="h-6 w-6 text-white/80" />
                    <span
                      style={{ backgroundColor: "#6B4C93", color: "#FFFFFF" }}
                      className="absolute top-1.5 right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    >
                      {t.doGiong}% giống
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-[#2B2420] leading-snug line-clamp-2 mb-2" style={{ minHeight: "2.4em" }}>
                      {t.tieuDe}
                    </p>
                    <span className="text-[11px] text-[#8A8072] flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{t.khuVuc}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-[#F0E4C4] p-5">
              <p className="text-xs font-semibold text-[#8A8072] uppercase mb-3">Người đăng tin</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-[#1F6F5C] text-white flex items-center justify-center font-semibold">
                  {tin.nguoiDang?.hoTen?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2B2420]">{tin.nguoiDang?.hoTen}</p>
                  <p className="text-xs text-[#8A8072] flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-[#1F6F5C]" /> Tài khoản đã xác thực
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {tin.nguoiDang?.soDienThoai ? (
                  <a
                    href={`tel:${tin.nguoiDang.soDienThoai.replace(/\s/g, "")}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#1F6F5C] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#195a4b] transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Gọi {tin.nguoiDang.soDienThoai}
                  </a>
                ) : (
                  <Link
                    to={linkNhanTin}
                    className="w-full flex items-center justify-center gap-2 bg-[#1F6F5C] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#195a4b] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Nhắn tin cho người đăng
                  </Link>
                )}
                <Link
                  to={linkNhanTin}
                  className="w-full flex items-center justify-center gap-2 border border-[#F0E4C4] text-[#5B5346] font-semibold text-sm py-3 rounded-xl hover:bg-[#FBF6EA] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Nhắn tin
                </Link>
              </div>
            </div>

            <button
              onClick={() => setHienModalBaoCao(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#C1502E] py-2.5"
            >
              <Flag className="h-4 w-4" />
              Báo cáo tin đăng này
            </button>
          </div>
        </div>
      </div>

      {}
      {hienModalBaoCao && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center px-5" onClick={dongModalBaoCao}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            {daGuiBaoCao ? (
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-[#E1F0EA] text-[#1F6F5C] flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="font-semibold text-[#2B2420] mb-1">Đã gửi báo cáo</p>
                <p className="text-sm text-[#7A6F5D] mb-5">
                  Cảm ơn bạn. Quản trị viên sẽ xem xét tin đăng này sớm nhất.
                </p>
                <button onClick={dongModalBaoCao} className="w-full bg-[#1F6F5C] text-white font-semibold text-sm py-2.5 rounded-xl">
                  Đóng
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#2B2420]">Báo cáo tin đăng</h3>
                  <button onClick={dongModalBaoCao}><X className="h-5 w-5 text-[#8A8072]" /></button>
                </div>
                <p className="text-xs font-semibold text-[#7A6F5D] mb-2">Chọn lý do</p>
                <div className="space-y-1.5 mb-4">
                  {LY_DO_BAO_CAO.map((ld) => (
                    <label key={ld} className="flex items-center gap-2 text-sm text-[#2B2420] cursor-pointer">
                      <input
                        type="radio"
                        name="lyDoBaoCao"
                        checked={lyDoBaoCao === ld}
                        onChange={() => setLyDoBaoCao(ld)}
                        className="accent-[#C1502E]"
                      />
                      {ld}
                    </label>
                  ))}
                </div>
                <textarea
                  value={moTaBaoCao}
                  onChange={(e) => setMoTaBaoCao(e.target.value)}
                  placeholder="Mô tả thêm (không bắt buộc)..."
                  rows={3}
                  className="w-full rounded-xl border border-[#F0E4C4] px-3 py-2 text-sm outline-none focus:border-[#1F6F5C] resize-none mb-4"
                />
                <button
                  onClick={guiBaoCao}
                  disabled={!lyDoBaoCao || dangGuiBaoCao}
                  className="w-full bg-[#C1502E] text-white font-semibold text-sm py-2.5 rounded-xl disabled:opacity-40"
                >
                  {dangGuiBaoCao ? "Đang gửi..." : "Gửi báo cáo"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
