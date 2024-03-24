"use client";
import React, { useState } from "react";
import QRCode from "qrcode.react";

function page() {
  const [text, setText] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
    setGenerated(false); // Reset generated state when text changes
  };

  const handleGenerateQR = () => {
    setGenerated(true);
  };

  return (
    <>
      <div
        className="container-fluid d-flex justify-content-center align-items-center "
        style={{ backgroundColor: "#2F3135", height: "94.5vh" }}
      >
        <div
          className="col-lg-6 col-md-6 col-sm-8  p-5 rounded "
          style={{ backgroundColor: "#0D1728", border: "1px solid white" }}
        >
          <div className="flex justify-center align-items-center flex-col">
            <h1 style={{ color: "#0B5ED7" }}>QR Code Generator</h1>
            <input
              type="text"
              value={text}
              onChange={handleChange}
              placeholder="Enter text here"
              style={{ padding: "10px", margin: "10px", fontSize: "16px" }}
            />
            <br />
            <button onClick={handleGenerateQR} className="btn btn-primary">
              Generate QR Code
            </button>
            <br />
            {generated && text && (
              <div style={{ marginTop: "20px" }}>
                <QRCode value={text} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
