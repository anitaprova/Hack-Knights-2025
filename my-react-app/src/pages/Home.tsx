import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import { FaMicrophone } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { FaStop } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import pdfToText from "react-pdftotext";
import { IoDocumentText } from "react-icons/io5";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function Home() {
  const [userInput, setUserInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileText, setFileText] = useState("");
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const [textValue, setTextValue] = useState(0);
  const [resultValue, setResultValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [promptResponses, setpromptResponses] = useState([""]);
  const [type, setType] = useState("");
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const getResponseForGivenPrompt = async (inputType: string) => {
    let prompt = "";
    if (inputType === "transcript") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given a transcript of what the doctor has said to a patient. Return only your response. Translate the following: ${transcript}`;
    } else if (inputType === "userInput") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given the notes the doctor has given to the patient. Return only your response. Translate the following: ${userInput}`;
    } else if (inputType === "file") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given the text from a file that the doctor gave to the patient. Return only your response. Translate the following: ${fileText}`;
    } else {
      console.log("No passed prompt");
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      setLoading(true);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setpromptResponses([text]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = (text: string) => {
    setType(text);
    getResponseForGivenPrompt(text);
  };

  const handleTextChange = (event, newValue) => setTextValue(newValue);
  const handleResultChange = (event, newValue) => setResultValue(newValue);

  if (!browserSupportsSpeechRecognition) {
    console.log("Speech recognition not supported in this browser.");
  }

  const handleFileChange = (event) => {
    setFiles(event.target.files[0]);
    extractText(event);
  };

  function extractText(event) {
    const file = event.target.files[0];
    pdfToText(file)
      .then((text) => setFileText(text))
      .catch((error) =>
        console.error("Failed to extract text from pdf", error)
      );
  }

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="grid grid-cols-2 gap-x-20 h-[75vh] mx-25 mt-10 m-10">
      {/* Add Record */}
      <div className="bg-lightgreen shadow-custom rounded-xl flex flex-col text-xl text-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <h1 className="text-4xl p-6 font-bold">Add Record</h1>
        <div className="flex justify-center">
          <Tabs
            value={textValue}
            onChange={handleTextChange}
            className="bg-green w-fit rounded-lg text-black"
            TabIndicatorProps={{
              style: { backgroundColor: "#5AA057" },
            }}
          >
            <Tab
              label="Upload file"
              sx={{
                "&.Mui-selected": {
                  color: "#5AA057",
                  fontWeight: "bold",
                  backgroundColor: "#ffffffff",
                  padding: "15px",
                  border: "2px solid green",
                  borderRadius: "8px 0px 0px 8px",
                },
                "&:hover": { backgroundColor: "#e0f9e2ff" },
              }}
            />
            <Tab
              label="Text Editor"
              sx={{
                "&.Mui-selected": {
                  color: "#5AA057",
                  fontWeight: "bold",
                  backgroundColor: "#ffffffff",
                  padding: "15px",
                  border: "2px solid green",
                  borderRadius: "0px 0px 0px 0px",
                },
                "&:hover": { backgroundColor: "#e0f9e2ff" },
              }}
            />
            <Tab
              label="Audio"
              sx={{
                "&.Mui-selected": {
                  color: "#5AA057",
                  fontWeight: "bold",
                  backgroundColor: "#ffffffff",
                  padding: "15px",
                  border: "2px solid green",
                  borderRadius: "0px 8px 8px 0px",
                },
                "&:hover": { backgroundColor: "#e0f9e2ff" },
              }}
            />
          </Tabs>
        </div>

        {/* Upload File Tab */}
        {textValue === 0 && (
          <div className="rounded-xl flex flex-col text-xl w-full flex-1 h-full">
            <div className="flex flex-1 flex-col items-center justify-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="fileUpload"
                hidden
              />
              <label htmlFor="fileUpload">
                <div className="border-dashed border-5 border-darkgreen p-4 text-center hover:cursor-pointer">
                  <div className="flex justify-center">
                    <FaCloudArrowUp size={100} />
                  </div>
                  <p className="text-2xl">Browse file to upload</p>
                  <p className="text-sm">Accepted file types: PDF</p>
                </div>
              </label>

              {fileText ? (
                <div className="bg-green-300/[0.35] m-5 flex gap-x-2 p-1.5 rounded-sm">
                  <IoDocumentText size={25} />
                  <p>{files?.name}</p>
                </div>
              ) : null}
            </div>

            {/* Button pinned to bottom */}
            <button
              className="bg-darkgreen text-4xl rounded-b-lg p-2 text-white hover:cursor-pointer text-center mt-auto"
              onClick={() => handleSubmit("file")}
            >
              Translate
            </button>
          </div>
        )}

        {/* Text Editor Tab */}
        {textValue === 1 && (
          <div className="flex flex-col flex-1 gap-1 h-full w-full">
            <div className="flex flex-col flex-1 m-10">
              <p className="text-left pb-2 pt-4">Write your medical notes</p>
              <textarea
                value={userInput}
                onChange={handleUserInput}
                className="w-full h-full bg-background rounded-xl border border-darkgreen text-gray-900 text-sm p-3 resize-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              />
            </div>

            <button
              className="bg-darkgreen text-4xl rounded-b-lg p-2 text-white hover:cursor-pointer text-center"
              onClick={() => handleSubmit("userInput")}
            >
              Translate
            </button>
          </div>
        )}

        {/* Audio Tab */}
        {textValue === 2 && (
          <div className="flex flex-col h-full w-full flex-1 mt-5">
            {listening ? (
              <div className="flex items-center justify-center flex-1">
                <div className="flex flex-col gap-y-5 items-center">
                  <button
                    onClick={SpeechRecognition.stopListening}
                    className="bg-red-200 p-6 rounded-full w-fit mb-5 hover:cursor-pointer"
                  >
                    <FaStop size={100} />
                  </button>
                  <p className="text-3xl mt-5">Start Recording</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1">
                <div className="flex flex-col items-center">
                  <button
                    onClick={SpeechRecognition.startListening}
                    className="bg-green p-6 rounded-full w-fit mb-5 hover:cursor-pointer"
                  >
                    <FaMicrophone size={100} />
                  </button>
                  <p className="text-3xl mt-5">Start Recording</p>
                </div>
              </div>
            )}

            {/* Push button to bottom */}
            <button
              className="bg-darkgreen text-4xl rounded-b-lg p-2 text-white hover:cursor-pointer text-center mt-auto"
              onClick={() => handleSubmit("transcript")}
            >
              Translate
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-gray-100 rounded-xl shadow-custom flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <h1 className="text-center text-4xl font-bold m-5">Results</h1>
        <div className="flex justify-center">
          <Tabs
            value={resultValue}
            onChange={handleResultChange}
            className="bg-green w-fit rounded-lg text-black"
            TabIndicatorProps={{
              style: { backgroundColor: "#5AA057" },
            }}
          >
            <Tab
              label="Transcription"
              sx={{
                "&.Mui-selected": {
                  color: "#5AA057",
                  fontWeight: "bold",
                  backgroundColor: "#ffffffff",
                  padding: "15px",
                  border: "2px solid green",
                  borderRadius: "8px 0px 0px 8px",
                },
                "&:hover": { backgroundColor: "#e0f9e2ff" },
              }}
            />
            <Tab
              label="Results"
              sx={{
                "&.Mui-selected": {
                  color: "#5AA057",
                  fontWeight: "bold",
                  backgroundColor: "#ffffffff",
                  padding: "15px",
                  border: "2px solid green",
                  borderRadius: "0px 8px 8px 0px",
                },
                "&:hover": { backgroundColor: "#e0f9e2ff" },
              }}
            />
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-scroll px-5 pb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {resultValue === 0 && (
            <div className="rounded-lg flex flex-col text-xl mt-5 w-full h-full">
              <div className="p-3 w-full mb-5">
                <p className="text-gray-900 text-sm rounded-xl p-8">
                  {transcript}
                </p>
              </div>
            </div>
          )}

          {resultValue === 1 && (
            <div className="flex flex-col h-full w-full p-5 rounded-lg mt-2.5">
              <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md p-4">
                {!loading ? (
                  <div className="flex flex-col gap-4">
                    {promptResponses?.map(
                      (promptResponse, index) =>
                        promptResponse && (
                          <div
                            key={index}
                            className="p-3 border-b border-gray-200 last:border-b-0"
                          >
                            <ReactMarkdown>{promptResponse}</ReactMarkdown>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-5 text-center h-full w-full">
                    <CircularProgress size={50} />
                    <h1 className="text-xl">Analyzing Input</h1>
                    <p className="text-sm">Generating response...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
