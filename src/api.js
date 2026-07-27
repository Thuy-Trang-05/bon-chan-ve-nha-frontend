/**
 * api.js — Nơi tập trung toàn bộ lệnh gọi sang Backend (FastAPI)
 * -----------------------------------------------------------------
 * Trước đây mỗi trang tự có dữ liệu mẫu viết cứng (DANH_SACH_..._MAU).
 * File này thay thế cho việc đó — mọi trang import `api` từ đây thay vì
 * tự bịa dữ liệu.
 *
 * DIA_CHI_BACKEND: địa chỉ máy chủ Backend đang chạy (uvicorn), mặc
 * định cổng 8000. Nếu sau này Backend triển khai lên 1 địa chỉ khác
 * (không còn là máy cá nhân nữa), chỉ cần đổi đúng 1 dòng này.
 */

export const DIA_CHI_BACKEND = `http://${window.location.hostname}:8000`;

const KHOA_LUU_TOKEN = "bon_chan_ve_nha_token";

export function layTokenDaLuu() {
  return localStorage.getItem(KHOA_LUU_TOKEN);
}

export function luuToken(token) {
  localStorage.setItem(KHOA_LUU_TOKEN, token);
}

export function xoaToken() {
  localStorage.removeItem(KHOA_LUU_TOKEN);
}

/**
 * Ghép đường dẫn ảnh Backend trả về (vd: "/static/uploads/abc.jpg")
 * thành URL đầy đủ để hiển thị trong thẻ <img>.
 */
export function urlAnh(duongDan) {
  if (!duongDan) return null;
  if (duongDan.startsWith("http")) return duongDan;
  return DIA_CHI_BACKEND + duongDan;
}

/**
 * Backend trả về tên trường kiểu snake_case (ho_ten, anh_dai_dien...) vì
 * đó là quy ước đặt tên cột trong models.py. Các trang .jsx viết từ
 * trước lại dùng camelCase (hoTen, anhDaiDien...). Hàm dưới đây chuyển
 * đổi 1 chiều ngay tại đây, để không phải sửa lại toàn bộ code cũ.
 */
function nguoiDungTuBackend(d) {
  if (!d) return d;
  return {
    nguoiDungId: d.nguoi_dung_id,
    hoTen: d.ho_ten,
    email: d.email,
    soDienThoai: d.so_dien_thoai,
    anhDaiDien: urlAnh(d.anh_dai_dien),
    vaiTro: d.vai_tro === "Admin" ? "admin" : "nguoi_dung",
    ngayTao: d.ngay_tao,
  };
}

const MAU_NEN_THEO_LOAI = {
  "Chó": "from-amber-200 to-amber-100",
  "Mèo": "from-sky-200 to-sky-100",
  "Khác": "from-emerald-200 to-emerald-100",
};

// Backend lưu tên đầy đủ tiếng Việt ("Chó"/"Mèo"/"Khác"), còn các trang
// .jsx viết từ trước (TimKiem, DangTin, ChiTietTinDang) dùng mã ngắn
// ("cho"/"meo"/"khac") cho bộ lọc và NHAN_LOAI — quy đổi 2 chiều ở đây.
const MA_LOAI_THEO_TEN = { "Chó": "cho", "Mèo": "meo", "Khác": "khac" };
const TEN_LOAI_THEO_MA = { cho: "Chó", meo: "Mèo", khac: "Khác" };

/**
 * Bảng 3 trạng thái của Backend (trang_thai: dang_hien_thi | da_giai_quyet
 * | da_an) không khớp tên với 2 trạng thái các trang .jsx cũ đang dùng để
 * tô màu badge (dang_tim | da_doan_tu). Hàm này quy đổi 1 chiều.
 */
function trangThaiTuBackend(trangThaiBackend) {
  if (trangThaiBackend === "da_giai_quyet") return "da_doan_tu";
  if (trangThaiBackend === "da_an") return "da_an";
  return "dang_tim"; // dang_hien_thi
}

function tinDangTuBackend(d) {
  if (!d) return d;
  const tenLoai = d.thu_cung?.loai?.ten_loai || "Khác";
  return {
    id: d.tin_dang_id,
    loaiTin: d.loai_tin,
    tieuDe: d.tieu_de,
    tenThuCung: d.thu_cung?.ten_thu_cung || null,
    loaiThuCung: MA_LOAI_THEO_TEN[tenLoai] || "khac",
    moTa: d.mo_ta,
    khuVuc: d.khu_vuc,
    trangThai: trangThaiTuBackend(d.trang_thai),
    trangThaiGoc: d.trang_thai, // giữ lại giá trị gốc để gọi capNhatTrangThaiTinDang
    ngayDang: d.ngay_dang,
    viDo: d.vi_do,
    kinhDo: d.kinh_do,
    hinhAnh: (d.hinh_anh || []).map((h) => urlAnh(h.duong_dan)),
    nguoiDang: d.nguoi_dung
      ? {
          id: d.nguoi_dung.nguoi_dung_id,
          hoTen: d.nguoi_dung.ho_ten,
          soDienThoai: d.nguoi_dung.so_dien_thoai,
        }
      : null,
    mauNen: MAU_NEN_THEO_LOAI[tenLoai] || MAU_NEN_THEO_LOAI["Khác"],
  };
}

export function thoiGianTuongDoi(ngayIso) {
  if (!ngayIso) return "";
  const giay = Math.floor((Date.now() - new Date(ngayIso).getTime()) / 1000);
  if (giay < 60) return "Vừa xong";
  if (giay < 3600) return Math.floor(giay / 60) + " phút trước";
  if (giay < 86400) return Math.floor(giay / 3600) + " giờ trước";
  return Math.floor(giay / 86400) + " ngày trước";
}

const MAU_HOI_THOAI = [
  "from-amber-200 to-amber-100",
  "from-sky-200 to-sky-100",
  "from-rose-200 to-rose-100",
  "from-emerald-200 to-emerald-100",
  "from-purple-200 to-purple-100",
];

function hoiThoaiTuBackend(d) {
  const mau = MAU_HOI_THOAI[Math.abs(d.tin_dang_id + d.nguoi_kia_id) % MAU_HOI_THOAI.length];
  return {
    id: `${d.tin_dang_id}-${d.nguoi_kia_id}`,
    tinDangId: d.tin_dang_id,
    tieuDeTin: d.tieu_de_tin,
    nguoiKiaId: d.nguoi_kia_id,
    tenNguoiKia: d.ten_nguoi_kia,
    tinNhanCuoi: d.tin_nhan_cuoi,
    cuaToi: d.cua_toi,
    thoiGian: thoiGianTuongDoi(d.gui_luc),
    soChuaDoc: d.so_chua_doc,
    mauNen: mau,
  };
}

function tinNhanTuBackend(d, toiId) {
  return {
    id: d.tin_nhan_id,
    cuaToi: d.nguoi_gui_id === toiId,
    noiDung: d.noi_dung,
    gui_luc: new Date(d.gui_luc).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    daDoc: d.da_doc,
  };
}

function thongBaoTuBackend(d) {
  return {
    id: d.thong_bao_id,
    loai: d.loai_thong_bao,
    tieuDe: d.tieu_de,
    noiDung: d.noi_dung,
    thoiGian: thoiGianTuongDoi(d.ngay_tao),
    daDoc: d.da_doc,
  };
}

function nguoiDungQuanTriTuBackend(d) {
  return {
    id: d.nguoi_dung_id,
    ten: d.ho_ten,
    email: d.email,
    ngayThamGia: new Date(d.ngay_tao).toLocaleDateString("vi-VN"),
    dangHoatDong: d.dang_hoat_dong,
  };
}

// dang_hien_thi/da_giai_quyet/da_an (Backend) <-> hien_thi/da_giai_quyet/da_an (TrangAdmin.jsx)
function tinDangQuanTriTuBackend(d) {
  return {
    id: d.tin_dang_id,
    tieuDe: d.tieu_de,
    moTa: d.mo_ta,
    nguoiDangId: d.nguoi_dung?.nguoi_dung_id,
    nguoiDang: d.nguoi_dung?.ho_ten,
    khuVuc: d.khu_vuc,
    thoiGian: thoiGianTuongDoi(d.ngay_dang),
    trangThai: d.trang_thai === "dang_hien_thi" ? "hien_thi" : d.trang_thai,
  };
}

function baoCaoQuanTriTuBackend(d) {
  return {
    id: d.bao_cao_id,
    tinDangId: d.tin_dang_id,
    tinLienQuan: d.tieu_de_tin,
    lyDo: d.ly_do,
    nguoiBaoCao: d.nguoi_bao_cao?.ho_ten,
    nguoiBiBaoCaoId: d.nguoi_bi_bao_cao?.nguoi_dung_id,
    nguoiBiBaoCao: d.nguoi_bi_bao_cao?.ho_ten,
    ngay: thoiGianTuongDoi(d.gui_luc),
    trangThai: d.trang_thai,
  };
}

class LoiApi extends Error {
  constructor(thongDiep, trangThaiHttp) {
    super(thongDiep);
    this.trangThaiHttp = trangThaiHttp;
  }
}

/**
 * goiApi: hàm dùng chung bên dưới mọi hàm api.xxx() — tự đính kèm
 * JWT (nếu có) vào header Authorization, tự parse JSON, tự ném lỗi
 * dễ hiểu (tiếng Việt) khi Backend trả về lỗi.
 */
async function goiApi(duongDan, tuyChon = {}) {
  const headers = { ...(tuyChon.headers || {}) };
  const token = layTokenDaLuu();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const laFormData = tuyChon.body instanceof FormData;
  if (tuyChon.body && !laFormData) {
    headers["Content-Type"] = "application/json";
  }

  let phanHoi;
  try {
    phanHoi = await fetch(DIA_CHI_BACKEND + duongDan, { ...tuyChon, headers });
  } catch (loiMang) {
    throw new LoiApi(
      "Không kết nối được tới máy chủ. Kiểm tra xem Backend (uvicorn) có đang chạy ở localhost:8000 không.",
      0
    );
  }

  if (!phanHoi.ok) {
    let thongDiep = `Lỗi ${phanHoi.status}`;
    try {
      const loiJson = await phanHoi.json();
      if (typeof loiJson.detail === "string") thongDiep = loiJson.detail;
      else if (Array.isArray(loiJson.detail)) {
        // Lỗi 422 do Pydantic kiểm tra dữ liệu không hợp lệ — gom lại thành 1 câu
        thongDiep = loiJson.detail.map((d) => d.msg).join("; ");
      }
    } catch {
      // Backend không trả JSON (vd: lỗi 500 thô) — giữ nguyên thongDiep mặc định
    }
    throw new LoiApi(thongDiep, phanHoi.status);
  }

  if (phanHoi.status === 204) return null;
  return phanHoi.json();
}

export const api = {
  // ---- Xác thực ----
  dangKy: (duLieu) =>
    goiApi("/api/auth/dang-ky", { method: "POST", body: JSON.stringify(duLieu) }).then((kq) => ({
      accessToken: kq.access_token,
      nguoiDung: nguoiDungTuBackend(kq.nguoi_dung),
    })),
  dangNhap: (duLieu) =>
    goiApi("/api/auth/dang-nhap", { method: "POST", body: JSON.stringify(duLieu) }).then((kq) => ({
      accessToken: kq.access_token,
      nguoiDung: nguoiDungTuBackend(kq.nguoi_dung),
    })),

  // ---- Người dùng ----
  layThongTinCuaToi: () => goiApi("/api/nguoi-dung/toi").then(nguoiDungTuBackend),
  capNhatThongTinCuaToi: (duLieu) =>
    goiApi("/api/nguoi-dung/toi", {
      method: "PUT",
      body: JSON.stringify({ ho_ten: duLieu.hoTen, so_dien_thoai: duLieu.soDienThoai }),
    }).then(nguoiDungTuBackend),
  doiAnhDaiDien: (file) => {
    const formData = new FormData();
    formData.append("anh", file);
    return goiApi("/api/nguoi-dung/toi/anh", { method: "POST", body: formData }).then(nguoiDungTuBackend);
  },

  // ---- Tin đăng ----
  danhSachTinDang: (thamSo = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(thamSo).filter(([, v]) => v !== undefined && v !== ""))
    ).toString();
    return goiApi(`/api/tin-dang${query ? "?" + query : ""}`).then((ds) => ds.map(tinDangTuBackend));
  },
  tinDangCuaToi: () => goiApi("/api/tin-dang/cua-toi").then((ds) => ds.map(tinDangTuBackend)),
  chiTietTinDang: (id) => goiApi(`/api/tin-dang/${id}`).then(tinDangTuBackend),
  dangTinMoi: (duLieu) => {
    const formData = new FormData();
    formData.append("loai_tin", duLieu.loaiTin);
    formData.append("loai_thu_cung", TEN_LOAI_THEO_MA[duLieu.loaiThuCung] || "Khác");
    if (duLieu.tenThuCung) formData.append("ten_thu_cung", duLieu.tenThuCung);
    formData.append("mo_ta", duLieu.moTa);
    formData.append("khu_vuc", duLieu.khuVuc);
    if (duLieu.viTri) {
      formData.append("vi_do", duLieu.viTri.lat);
      formData.append("kinh_do", duLieu.viTri.lng);
    }
    (duLieu.danhSachAnh || []).forEach((a) => formData.append("hinh_anh", a.file));
    return goiApi("/api/tin-dang", { method: "POST", body: formData }).then(tinDangTuBackend);
  },
  suaTinDang: (id, duLieu) =>
    goiApi(`/api/tin-dang/${id}`, {
      method: "PUT",
      body: JSON.stringify({ tieu_de: duLieu.tieuDe, mo_ta: duLieu.moTa, khu_vuc: duLieu.khuVuc }),
    }).then(tinDangTuBackend),
  xoaTinDang: (id) => goiApi(`/api/tin-dang/${id}`, { method: "DELETE" }),
  capNhatTrangThaiTinDang: (id, trangThaiGoc) =>
    goiApi(`/api/tin-dang/${id}/trang-thai`, {
      method: "PATCH",
      body: JSON.stringify({ trang_thai: trangThaiGoc }),
    }).then(tinDangTuBackend),
  baoCaoViPham: (id, lyDo) =>
    goiApi(`/api/tin-dang/${id}/bao-cao`, { method: "POST", body: JSON.stringify({ ly_do: lyDo }) }),

  // ---- Tin nhắn ----
  danhSachHoiThoaiCuaToi: () =>
    goiApi("/api/tin-nhan/hoi-thoai-cua-toi").then((ds) => ds.map(hoiThoaiTuBackend)),
  xemHoiThoai: (tinDangId, nguoiKiaId, toiId) =>
    goiApi(`/api/tin-nhan/hoi-thoai/${tinDangId}/${nguoiKiaId}`).then((ds) =>
      ds.map((d) => tinNhanTuBackend(d, toiId))
    ),
  guiTinNhan: (duLieu) =>
    goiApi("/api/tin-nhan", {
      method: "POST",
      body: JSON.stringify({
        tin_dang_id: duLieu.tinDangId,
        nguoi_nhan_id: duLieu.nguoiNhanId,
        noi_dung: duLieu.noiDung,
      }),
    }).then((d) => tinNhanTuBackend(d, d.nguoi_gui_id)),

  // ---- Thông báo ----
  danhSachThongBao: () => goiApi("/api/thong-bao").then((ds) => ds.map(thongBaoTuBackend)),
  danhDauDaDoc: (id) => goiApi(`/api/thong-bao/${id}/da-doc`, { method: "PATCH" }).then(thongBaoTuBackend),
  danhDauTatCaDaDoc: () => goiApi("/api/thong-bao/danh-dau-tat-ca-da-doc", { method: "PATCH" }),
  xoaThongBao: (id) => goiApi(`/api/thong-bao/${id}`, { method: "DELETE" }),

  // ---- Quản trị ----
  admin: {
    thongKe: () => goiApi("/api/admin/thong-ke"),
    danhSachTinDang: () => goiApi("/api/admin/tin-dang").then((ds) => ds.map(tinDangQuanTriTuBackend)),
    anTinDang: (id) => goiApi(`/api/admin/tin-dang/${id}/an`, { method: "PATCH" }).then(tinDangQuanTriTuBackend),
    hienTinDang: (id) => goiApi(`/api/admin/tin-dang/${id}/hien`, { method: "PATCH" }).then(tinDangQuanTriTuBackend),
    danhSachNguoiDung: () => goiApi("/api/admin/nguoi-dung").then((ds) => ds.map(nguoiDungQuanTriTuBackend)),
    khoaMoKhoaNguoiDung: (id) =>
      goiApi(`/api/admin/nguoi-dung/${id}/khoa`, { method: "PATCH" }).then(nguoiDungQuanTriTuBackend),
    danhSachBaoCao: () => goiApi("/api/admin/bao-cao").then((ds) => ds.map(baoCaoQuanTriTuBackend)),
    xuLyBaoCao: (id) => goiApi(`/api/admin/bao-cao/${id}/xu-ly`, { method: "PATCH" }).then(baoCaoQuanTriTuBackend),
  },
};
