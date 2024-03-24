"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <header className="container-fluid d-flex flex-column flex-md-row justify-content-md-around py-3">
      <div id="logo" className="text-center">
        <p className="my-auto">EFA(Events Feedback Analysis)</p>
      </div>
      <ul className=" d-flex my-auto mx-auto">
        <li className={`my-auto link `}>
          <Link className={`${pathname === "/" ? "active" : ""}`} href="/">
            Chat
          </Link>
        </li>
        <li
          className={`my-auto mx-4 mx-sm-4 mx-md-4 px-md-4 mx-lg-5 px-lg-5 link `}
        >
          <Link
            className={`${pathname === "/qrcode" ? "active" : ""}`}
            href="qrcode"
          >
            QrCode
          </Link>
        </li>
        <li className={`my-auto link`}>
          <Link
            className={`${pathname === "/dashboard" ? "active" : ""}`}
            href="/dashboard"
          >
            Dashboard
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
