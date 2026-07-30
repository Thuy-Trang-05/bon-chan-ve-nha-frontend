
import React from "react";

export default function AvatarNguoiDung({ nguoiDung, kichThuoc = "h-9 w-9", coChu = "text-sm" }) {
  const ten = nguoiDung?.hoTen?.trim();
  const chuDauTien = ten ? ten.charAt(0).toUpperCase() : "?";

  if (nguoiDung?.anhDaiDien) {
    return (
      <img
        src={nguoiDung.anhDaiDien}
        alt={ten || "Ảnh đại diện"}
        className={kichThuoc + " rounded-full object-cover shrink-0 border border-[#E9E2D3]"}
      />
    );
  }

  return (
    <div
      style={{ backgroundColor: "#1F6F5C", color: "#FFFFFF" }}
      className={kichThuoc + " " + coChu + " rounded-full flex items-center justify-center font-semibold shrink-0"}
    >
      {chuDauTien}
    </div>
  );
}
