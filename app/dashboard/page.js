"use client";
import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUsers,
//   faMapMarkerAlt,
//   faCity,
// } from "@fortawesome/free-solid-svg-icons";

function page() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [totalCities, setTotalCities] = useState(0);

  // Simulated data fetching - replace with actual data fetching logic
  useEffect(() => {
    // Assuming fetchData() is a function that fetches data from your backend
    fetchData()
      .then((data) => {
        setTotalUsers(data.totalUsers);
        setTotalAddresses(data.totalAddresses);
        setTotalCities(data.totalCities);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Simulated data - replace with actual data fetching logic
  function fetchData() {
    return new Promise((resolve, reject) => {
      // Simulated data response
      const data = {
        totalUsers: 2500,
        totalAddresses: 3500,
        totalCities: 75,
      };
      // Simulate network delay
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  }

  return (
    <div style={{ backgroundColor: "#2F3135", height: "95vh" }}>
      <h1
        className="d-flex justify-content-center align-items-center pt-8"
        style={{ color: "#0B5ED7" }}
      >
        DashBoard
      </h1>
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="col-lg-10 col-md-12">
          <div className="dashboard row justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div
                className="total-box"
                style={{ backgroundColor: "#0D1728", color: "white" }}
              >
                <h2 style={{ display: "inline", marginRight: "10px" }}>
                  Users
                </h2>
                {/* <FontAwesomeIcon icon={faUsers} style={{ display: "inline" }} /> */}
                <p style={{ marginLeft: "10px" }}>{totalUsers}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div
                className="total-box"
                style={{ backgroundColor: "#0D1728", color: "white" }}
              >
                <h2 style={{ display: "inline", marginRight: "10px" }}>
                  Events
                </h2>
                {/* <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ display: "inline" }}
                /> */}
                <p style={{ marginLeft: "10px" }}>{totalAddresses}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div
                className="total-box"
                style={{ backgroundColor: "#0D1728", color: "white" }}
              >
                <h2 style={{ display: "inline", marginRight: "10px" }}>
                  Cities
                </h2>
                {/* <FontAwesomeIcon icon={faCity} style={{ display: "inline" }} /> */}
                <p style={{ marginLeft: "10px" }}>{totalCities}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
