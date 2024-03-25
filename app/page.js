"use client";
import { useState, useEffect, useMemo } from "react";
import Button from 'react-bootstrap/Button';
import { ThreeDots } from "react-loader-spinner";
import Spinner from "../components/loader/spinner";
import Image from "next/image";
import AiProfile from "../public/aiLogo.png";
import userProfile from "../public/user.jpg";

//! Blue print for api
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;


const promptsArray = [
  "Enter Your Name",
  "Enter your event name",
  "Enter your event description",
  "Enter Your event goal",
];

async function postData(url, options) {
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return result;
  } catch (error) {
    return error;
  }
}

const getUserID = async (username) => {
  try {
    let res = await postData(
      `${serverURL}users/`,
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          username: username,
        }),
        redirect: "follow",
      }
    );
    let id = JSON.parse(res);
    return id;
  } catch (err) {
    throw err;
  }
}

//! To get Event id
const getEventID = async (newEventDetail) => {
  try {
    let res = await postData(
      `${serverURL}organizers/events/new`,
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(newEventDetail),
        redirect: "follow",
      }
    );

    let id = JSON.parse(res);
    return id;
  } catch (error) {
    throw error;
  }
};


export default function Home() {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventsPrompt, setEventsPrompt] = useState(promptsArray.map(item => ({
    question: item,
    answer: ''
  })));
  const [prompt, setPrompt] = useState("");
  const [promptsArr, setPromptsArr] = useState([]);
  const [error, setError] = useState("");

  const lastPrompt = useMemo(() => promptsArr[promptsArr.length - 1], [promptsArr]);
  // Check to ensure that all details need for the event has been filled
  const eventDetailsComplete = useMemo(() => !eventsPrompt.find(item => !item.answer.length), [eventsPrompt]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleUpdateEventDetails = () => {
    console.log({ lastPrompt })
    const foundEventPromptIdx = eventsPrompt.findIndex(item => item.question === lastPrompt.text);
    console.log(foundEventPromptIdx)
    if (foundEventPromptIdx === -1) return
    const newEventPrompt = [...eventsPrompt];
    newEventPrompt.splice(foundEventPromptIdx, 1, {
      question: eventsPrompt[foundEventPromptIdx].question,
      answer: prompt
    })
    const newPromptArr = [...promptsArr, { text: prompt, role: "user" }]
    setEventsPrompt(newEventPrompt);
    setPromptsArr(newPromptArr);
    setPrompt("")
    console.log('this is the new Event', newEventPrompt, promptsArr);
  }
  //! Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventDetailsComplete) {
      handleUpdateEventDetails()
    } else {
      mainPrompt();
    }
  };

  console.log('this is the serverURL', serverURL);

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

    try {
      setLoading(true);
      let res = await postData(
        `${serverURL}organizers/${id1}/events/${id2}/conversate`,
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

  const handleSetPrompt = (newPromptArr = promptsArr, newEventPrompt = eventsPrompt) => {
    // If a userID exist, but event details is not complete, ask the user to fill the detail
    if (!eventDetailsComplete) {
      const foundLatestEventPrompt = newEventPrompt.find(item => !item.answer.length);
      setTimeout(() => {
        setPromptsArr([
          ...newPromptArr,
          {
            text: foundLatestEventPrompt.question, role: "ai"
          }
        ]);
      }, 1500);
      // If the userID exist and the event detail is complete, but there is no event ID yet, GET ONE
    }
  }

  const handleGetIDFromStorage = () => {
    let id1 = localStorage.getItem("id1");
    let id2 = localStorage.getItem("id2");
    if (id1?.length) {
      setId1(id1);
    }
    if (id2?.length) {
      setId2(id2)
    }
  }


  // 1.
  useEffect(() => {
    // You need to get the ID from the localstorage first.
    handleGetIDFromStorage()
  }, []);

  // 2.
  useEffect(() => {
    // Set you PROMPT based on ID value
    // If the last response was from AI, wait
    if (lastPrompt?.role == "ai") return;
    handleSetPrompt()
  }, [id1, id2, lastPrompt])

  useEffect(() => {
    if (eventDetailsComplete && !id1?.length) {
      setLoading(true);
      setPromptsArr(prevSt => [...prevSt, {
        text: "Creating a new user for event", role: "ai"
      }]);
      getUserID(eventsPrompt.find(item => item.question === "Enter Your Name").answer)
        .then(id => {
          setId1(id.id)
        }).catch(err => {
          setError(err)
        }).finally(() => {
          setLoading(false)
        })
    }
  }, [eventDetailsComplete, eventsPrompt, id1?.length])

  useEffect(() => {
    if (eventDetailsComplete && !id2.length) {
      setLoading(true);
      setPromptsArr(prevSt => [...prevSt, {
        text: "Creating events with given details", role: "ai"
      }]);
      getEventID({
        eventName: eventsPrompt.find(item => item.question === "Enter your event name").answer,
        eventDescription: eventsPrompt.find(item => item.question === "Enter your event description").answer,
        formGoal: eventsPrompt.find(item => item.question === "Enter Your event goal").answer,
      }).then(id => {
        setId2(id.eventId)
      }).catch(err => {
        setError(err)
      }).finally(() => {
        setLoading(false)
      })
    }
  }, [eventDetailsComplete, eventsPrompt, id2])

  useEffect(() => {
    if (id1?.length) {
      localStorage.setItem("id1", id1);
    }
    if (id2?.length) {
      localStorage.setItem("id2", id2);
    }
  }, [id1, id2]);

  console.log('this is the error', error)

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
              // overflow: 'hidden'
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

            {promptsArr.length === 0 ? (
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
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    {
                      promptsArray.map((item, idx) =>
                        <Button variant="outline-info" key={idx}
                          style={{
                            marginRight: "4px",
                            padding: "8px"
                          }}
                        >
                          {item}
                        </Button>)
                    }
                  </div>
                </div>
              </div>
            )
              // show prompts
              : (
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
                                <div className="col-9 me-auto shadow-none p-3 mb-5 bg-body-tertiary rounded">
                                  {prom.text}
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
                  onKeyDown={handleKeyPress}
                />

                <Button
                  variant="primary"
                  onClick={id1?.length && id2?.length ? mainPrompt : handleSubmit}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Send"}
                </Button>
              </div>

              {error && <p className="text-danger">{error.message}</p>}
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
