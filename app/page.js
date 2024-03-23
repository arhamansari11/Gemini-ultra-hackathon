"use client";
import { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import Spinner from "../components/loader/spinner";
import Image from "next/image";
import AiProfile from "../Assets/images/aiLogo.png";
import userProfile from "../Assets/images/user.jpg";

const promptsArray = [
  "Enter your event name",
  "Enter your event description",
  "Enter Your event goal",
];

const eventsDetail = {
  eventName: "",
  eventDescription: "",
  formGoal: "",
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [promptsArr, setPromptsArr] = useState([]);
  const [reRender, setRerender] = useState(false);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw;
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  async function postData(url, options) {
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      return result;
    } catch (error) {
      return error;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let id1 = localStorage.getItem("id1");
    let id2 = localStorage.getItem("id2");

    if (id1 === null) {
      setPromptsArr([...promptsArr, prompt]);
      setPrompt("");
      raw = JSON.stringify({
        userName: prompt,
      });

      let res = await postData(
        "https://gemini-ai-hackathon-efa-backend.onrender.com/users/",
        requestOptions
      );

      let id = JSON.parse(res);
      localStorage.setItem("id1", id.id);
      setRerender((prevState) => !prevState);
    } else if (id1 !== null && id2 === null) {
      setPromptsArr([...promptsArr, prompt]);

      if (eventsDetail.eventName === "") {
        eventsDetail.eventName = prompt;
      } else if (
        eventsDetail.eventName !== "" &&
        eventsDetail.eventDescription === "" &&
        eventsDetail.formGoal === ""
      ) {
        eventsDetail.eventDescription = prompt;
      } else {
        eventsDetail.formGoal = prompt;
      }

      setRerender((prevState) => !prevState);
      setPrompt("");
    } else {
      setPromptsArr([...promptsArr, prompt]);
      mainPrompt();
      setPrompt("");
    }
  };

  const mainPrompt = async () => {
    raw = JSON.stringify({ prompt: prompt });
    let id1 = localStorage.getItem("id1");
    let id2 = localStorage.getItem("id2");

    try {
      let res = await postData(
        `https://gemini-ai-hackathon-efa-backend.onrender.com/organizers/${id1}/events/:${id2}/conversate`,
        requestOptions
      );

      console.log(res);
    } catch (error) {}
  };
  const getId2 = async () => {
    raw = JSON.stringify(eventsDetail);

    let res = await postData(
      "https://gemini-ai-hackathon-efa-backend.onrender.com/users/",
      requestOptions
    );
    let id = JSON.parse(res);
    localStorage.setItem("id2", id.id);
    mainPrompt();
  };

  useEffect(() => {
    let id1 = localStorage.getItem("id1");
    let id2 = localStorage.getItem("id2");

    if (id1 === null) {
      setPromptsArr([...promptsArr, "Enter Your Name"]);
    } else if (id1 != null && id2 === null) {
      if (
        eventsDetail.eventName !== "" &&
        eventsDetail.eventDescription !== "" &&
        eventsDetail.formGoal !== ""
      ) {
        getId2();
        return;
      }

      let particularPrompt =
        eventsDetail.eventName == ""
          ? 0
          : eventsDetail.eventDescription == ""
          ? 1
          : 2;

      setPromptsArr([...promptsArr, promptsArray[particularPrompt]]);
    }
  }, [reRender]);

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
              border: "1px solid white",
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
                          {index % 2 != 0 ? (
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
