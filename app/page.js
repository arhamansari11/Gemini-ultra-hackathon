"use client";
//import axios from "axios"; // Import axios for making HTTP requests
import { useState } from "react";
import { IoMdAttach } from "react-icons/io";
import { ThreeDots } from "react-loader-spinner";
import Spinner from "../components/loader/spinner";
import Image from "next/image";
import AiProfile from "../Assets/images/aiLogo.png";
import userProfile from "../Assets/images/user.jpg";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [promptsArr, setPromptsArr] = useState([]);
  const [recentAnswer, setRecentAnswer] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prompt.trim() !== "") {
      console.log("prompt -> ", prompt);
      setPromptsArr([...promptsArr, prompt]);
      const postData = {
        query:
          prompt +
          "? Give me response in JSON & there should be 1 key named response",
      };
      setPrompt("");

      setLoading(true);
      // API Calling and getting response code
      try {
        // Make a POST request using axios
        const response = await axios.post(
          "https://ecofactory.onrender.com/api/eco_fac_gpt",
          postData
        );

        console.log("response.data -> ", response.data);
        setRecentAnswer(response.data.response);
        setPromptsArr((prevPromptsArr) => [
          ...prevPromptsArr,
          response?.data?.response,
        ]);
        setLoading(false);
        setError(null); // Reset error state
      } catch (error) {
        // Handle errors
        console.error("Error fetching data: ", error);
        setError(error.message); // Store error message in state
        setLoading(false);
      }
    }
  };

  return (
    <div
      id="productOptimization"
      style={{
        display: "flex",
        height: "100vh",
        minHeight: "400px",
      }}
    >
      <main
        className="main-gpt"
        style={{
          width: "100vw",
          backgroundColor: "#2f3135",
        }}
      >
        <div
          className="container-fluid d-flex justify-content-center align-items-center"
          style={{ height: "100vh", margin: "auto 0", border: "20px" }}
        >
          <div
            className="container"
            style={{
              height: "96vh",
              display: "flex",
              flexDirection: "column",
              border: "2px solid blue",
              borderRadius: "25px",
            }}
          >
            <div
              className="row"
              style={{
                backgroundColor: "#0F171F",
                height: "15%",
                borderTopLeftRadius: "25px",
                borderTopRightRadius: "25px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <div className="flex ms-5 mt-4">
                <div>
                  <h5 className="m-0 p-0 text-white">
                    Efa (Event Feedback Analysis)
                  </h5>
                  <p className=" p-0 text-white">@AJINKYA3D</p>
                </div>
              </div>
            </div>

            {promptsArr.length === 0 && (
              <div
                className="row"
                style={{ backgroundColor: "#0D1728", height: "78%" }}
              >
                <div
                  className="col d-flex flex-column gap-3 justify-content-center align-items-center"
                  style={{ margin: "0 auto", maxWidth: "800px" }}
                >
                  <h3 className="heading3">&nbsp; How can I help you today?</h3>
                  <p
                    className="main-text text-white"
                    style={{ textAlignLast: "center" }}
                  >
                    &nbsp; &nbsp;Efa (Event Feedback Analysis) aims to
                    revolutionize the way event feedback is collected and
                    analyzed. Traditional methods of gathering feedback, such as
                    filling out forms at the end of an event, can be cumbersome
                    for attendees and challenging for event organizers to manage
                    effectively at scale.
                  </p>
                </div>
              </div>
            )}

            {/* show prompts */}
            {promptsArr.length !== 0 && (
              <div
                className="prompt-scroll-box row d-flex justify-content-center"
                style={{ backgroundColor: "#0D1728", height: "78%" }}
              >
                <div className="scroll-inner">
                  <div
                    className="row prompts px-5 pt-4"
                    style={{ backgroundColor: "#0D1728", height: "70%" }}
                  >
                    <div className="container-fluid">
                      {promptsArr.map((prom, index) => (
                        <div key={index}>
                          {index % 2 === 0 ? (
                            <div
                              className="row p-0 m-0 "
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                src={userProfile}
                                className="rounded-circle mb-auto ms-auto "
                                style={profileUserStyle}
                                alt=""
                              />
                              <div className="col-9 shadow p-3 mb-5 bg-body-tertiary rounded ">
                                {prom}
                              </div>
                              <div className="col-3"></div>
                            </div>
                          ) : (
                            <div
                              className="row "
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={AiProfile}
                                className="rounded-circle mb-auto me-2"
                                style={profileStyle}
                                alt=""
                              />
                              <div className="col-9 me-auto shadow-none p-3 mb-5 bg-body-tertiary rounded">
                                {prom}
                              </div>
                              <div className="col-3"></div>
                            </div>
                          )}
                        </div>
                      ))}
                      {loading && (
                        <div
                          className="row"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={chatgptLogo}
                            className="rounded-circle mb-auto me-2"
                            style={profileStyle}
                            alt=""
                          />
                          <div
                            className="col-9 shadow-none me-auto p-3 mb-5 bg-body-tertiary rounded"
                            style={{ height: "100px" }}
                          >
                            <ThreeDots
                              visible={true}
                              height="30"
                              width="30"
                              color="black"
                              radius="9"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                              wrapperClass=""
                            />
                          </div>
                          <div className="col-3"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className="row"
              style={{
                backgroundColor: "#090F1A",
                height: "8%",
                borderBottomLeftRadius: "25px",
                borderBottomRightRadius: "25px",
              }}
            >
              <div className="input-group">
                <input
                  value={prompt}
                  style={{
                    backgroundColor: "#090F1A",
                    border: "none",
                    color: "white",
                  }}
                  onChange={(e) => setPrompt(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Type message here..."
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />

                <button
                  onClick={handleSubmit}
                  className="btn"
                  disabled={loading}
                  style={{ backgroundColor: "#0076c3", color: "white" }}
                >
                  {loading ? <Spinner /> : "Send"}
                </button>
              </div>

              {/* {error && <p className="text-danger">{error}</p>} */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const iconStyles = {
  fontSize: "2em",
  lineHeight: "1em",
  position: "absolute",
  top: "50%",
  zIndex: 3,
  transition: "transform 0.3s ease" /* Add transition for smoother animation */,
};

const textStyle = {
  fontFamily: '"Roboto", sans-serif',
  fontWeight: 700,
};

const profileStyle = {
  width: "3%",
  padding: "7px",
  backgroundColor: "rgb(0, 118, 195)",
};
const profileUserStyle = {
  width: "4.5%",
  padding: "7px",
  marginTop: "-5px",
};
const btn = {};
