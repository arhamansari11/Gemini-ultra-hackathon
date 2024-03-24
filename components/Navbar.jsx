"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="col-12">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a
            class="navbar-brand"
            href="#"
            style={{
              fontFamily: "Times New Roman, Times, serif",
            }}
          >
            <Link href="/" style={{ textDecoration: "none", color: "black" }}>
              Efa (EVENT FEEDBACK ANALYSIS)
            </Link>
          </a>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link aria-current="page" href="/">
                  Chat
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  href="/"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  DashBoard
                </Link>
              </li>
              <li class="nav-item">
                <Link href="/qrcode" style={{ textDecoration: "none" }}>
                  QrCode
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
