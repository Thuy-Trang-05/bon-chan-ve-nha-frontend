
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, layTokenDaLuu, luuToken, xoaToken } from "./api";

const NguoiDungContext = createContext(null);

export function NguoiDungProvider({ children }) {
  const [nguoiDung, setNguoiDung] = useState(null);
  const [dangTaiPhienDangNhap, setDangTaiPhienDangNhap] = useState(true);

  useEffect(() => {
    const token = layTokenDaLuu();
    if (!token) {
      setDangTaiPhienDangNhap(false);
      return;
    }
    api
      .layThongTinCuaToi()
      .then((duLieu) => setNguoiDung(duLieu))
      .catch(() => {

        xoaToken();
        setNguoiDung(null);
      })
      .finally(() => setDangTaiPhienDangNhap(false));
  }, []);

  function dangNhap(token, thongTinNguoiDung) {
    luuToken(token);
    setNguoiDung(thongTinNguoiDung);
  }

  function dangXuat() {
    xoaToken();
    setNguoiDung(null);
  }

  function capNhatHoSo(thongTinMoi) {
    setNguoiDung((truoc) => (truoc ? { ...truoc, ...thongTinMoi } : truoc));
  }

  const gia_tri = {
    nguoiDung,
    daDangNhap: nguoiDung !== null,
    laAdmin: nguoiDung?.vaiTro === "admin",
    dangTaiPhienDangNhap,
    dangNhap,
    dangXuat,
    capNhatHoSo,
  };

  return (
    <NguoiDungContext.Provider value={gia_tri}>
      {children}
    </NguoiDungContext.Provider>
  );
}

export function useNguoiDung() {
  const ctx = useContext(NguoiDungContext);
  if (!ctx) {
    throw new Error("useNguoiDung() phải được gọi bên trong <NguoiDungProvider>.");
  }
  return ctx;
}
