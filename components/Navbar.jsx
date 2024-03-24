"use client";
import React from "react";
import Link from "next/link";
const Navbar = () => {
  return (
    <header className="container-fluid d-flex flex-column flex-md-row justify-content-md-around py-2">
      <div id="logo" className="text-center">
        <p className=" my-auto">Hello</p>
      </div>
      <ul className=" d-flex my-auto mx-auto">
        <li className=" my-auto">
          <Link href="/">Chat</Link>
        </li>
        <li className="my-auto mx-4 mx-sm-4 mx-md-4 px-md-4 mx-lg-5 px-lg-5">
          <Link href="dashboard">Dashboard</Link>
        </li>
        <li className="my-auto">
          <Link href="/qrcode">QrCode</Link>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
