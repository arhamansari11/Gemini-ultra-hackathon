"use client";
import { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import Spinner from "../components/loader/spinner";
import Image from "next/image";
import AiProfile from "@/Assets/aiLogo.png";
import userProfile from "@/Assets/user.jpg";

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
  const [error, setError] = useState("");
  //! Blue print for api
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  async function postData(url, options) {
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      return result;
    } catch (error) {
      return error;
    }
  }

  //! Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    let id1 = localStorage.getItem("id1");
    let id2 = localStorage.getItem("id2");

    if (id1 === null) {
      setPromptsArr([...promptsArr, { text: prompt, role: "user" }]);
      setPrompt("");

      try {
        setLoading(true);
        const raw = JSON.stringify({
          username: prompt,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        let res = await postData(
          "https://gemini-ai-hackathon-efa-backend.onrender.com/users/",
          requestOptions
        );
        let id = JSON.parse(res);
        localStorage.setItem("id1", id.id);
        setRerender((prevState) => !prevState);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    } else if (id1 !== null && id2 === null) {
      setPromptsArr([...promptsArr, { text: prompt, role: "user" }]);

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
      mainPrompt();
    }
  };

  //!For prompting
  const mainPrompt = async () => {
    const userPrompt = { text: prompt, role: "user" };

    // Add user's prompt to the state
    setPromptsArr((prevState) => {
      return [...prevState, userPrompt];
    });

    // Clear the prompt input
    setPrompt("");

    const raw = JSON.stringify({ prompt: prompt });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let id1 = localStorage.getItem("id1");
    let id2 = localStorage.getItem("id2");

    try {
      setLoading(true);
      let res = await postData(
        `https://gemini-ai-hackathon-efa-backend.onrender.com/organizers/${id1}/events/${id2}/conversate`,
        requestOptions
      );

      let promptResponse = JSON.parse(res);
      console.log(promptResponse);
      setPromptsArr((prevState) => {
        return [...prevState, { text: promptResponse.response, role: "ai" }];
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  //! To get Event id
  const getId2 = async () => {
    const raw = JSON.stringify(eventsDetail);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    let res = await postData(
      "https://gemini-ai-hackathon-efa-backend.onrender.com/organizers/events/new",
      requestOptions
    );

    let id = JSON.parse(res);
    localStorage.setItem("id2", id.eventId);
    mainPrompt();
  };

  //! Rerender the page
  useEffect(() => {
    let id1 = localStorage.getItem("id1");
    let id2 = localStorage.getItem("id2");

    if (id1 === null) {
      setPromptsArr([...promptsArr, { text: "Enter Your Name", role: "ai" }]);
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

      setTimeout(() => {
        setPromptsArr([
          ...promptsArr,
          { text: promptsArray[particularPrompt], role: "ai" },
        ]);
      }, 1000);
    }
  }, [reRender]);

  console.log(promptsArr);
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
                  <h3
                    style={{ fontFamily: "var(--font-poppins)" }}
                    className="heading3"
                  >
                    &nbsp; How can I help you today?
                  </h3>
                  <p
                    className="main-text text-white"
                    style={{
                      textAlignLast: "center",
                      fontFamily: "var(--font-poppins)",
                    }}
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
                    className="row prompts px-sm-5 pt-4"
                    style={{ backgroundColor: "#0D1728", height: "70%" }}
                  >
                    <div className="container-fluid">
                      {promptsArr.map((prom, index) => (
                        <div key={index}>
                          {prom.role == "user" ? (
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
                                {prom.text}
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
                              <Image
                                src={AiProfile}
                                className="rounded-circle mb-auto me-2"
                                style={profileUserStyle}
                                alt=""
                              />
                              <div
                                className="col-9 me-auto shadow-none p-3 mb-5 bg-body-tertiary rounded"
                                dangerouslySetInnerHTML={{
                                  __html: prom.text.replace(/\n/g, "<br>"),
                                }}
                              ></div>
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
                          <Image
                            src={AiProfile}
                            className="rounded-circle mb-auto me-2"
                            style={profileUserStyle}
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
                          <div className="col-sm-3"></div>
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

const profileUserStyle = {
  width: "60px",
  padding: "7px",
  marginTop: "-5px",
};
