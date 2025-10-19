import { useState, useEffect } from "react";
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

function Results() {
  const [userInput, setUserInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileText, setFileText] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [textValue, setTextValue] = useState(0);
  const [resultValue, setResultValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [promptResponses, setpromptResponses] = useState([""]);
  const [type, setType] = useState("");
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const getResponseForGivenPrompt = async (inputType: string) => {
    let prompt = "";
    if (inputType == "transcript") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given a transcript of what the doctor has said to a patient. Return only your response. Translate the following: ${transcript}`;
    } else if (inputType == "userInput") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given the notes the doctor has given to the patient. Return only your response. Translate the following: ${userInput}`;
    } else if (inputType == "file") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given the text from a file that the doctor gave to the patient. Return only your response. Translate the following: ${fileText}`;
    } else {
      console.log("No passed prompt");
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      setLoading(true);
      const result = await model.generateContent(prompt);
      setLoading(false);
      const response = result.response;
      const text = response.text();
      console.log(text);
      setpromptResponses([text]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (text: string) => {
    setType(text);
    getResponseForGivenPrompt(text);
  };

  const handleTextChange = (event, newValue) => {
    setTextValue(newValue);
  };

  const handleResultChange = (event, newValue) => {
    setResultValue(newValue);
  };

  if (!browserSupportsSpeechRecognition) {
    console.log("No support");
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
    <div className="bg-gray-100 row-span-2 mt-20 rounded-xl shadow-custom">
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
              "&:hover": {
                backgroundColor: "#e0f9e2ff",
              },
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
              "&:hover": {
                backgroundColor: "#e0f9e2ff",
              },
            }}
          />
        </Tabs>
      </div>

      {resultValue === 0 && (
        <div className="rounded-lg flex flex-1 flex-col text-xl mt-5 w-full h-full">
          <div className="p-3 w-full mb-5">
            <p className="w-fulltext-gray-900 text-sm rounded-xl p-8 overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {transcript}
            </p>
          </div>
        </div>
      )}

      {resultValue === 1 && (
        <div className="flex flex-row border-3 border-gray-300 m-5 text-xl justify-around p-3 rounded-lg h-screen overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {!loading ? (
            <div>
              {promptResponses?.map(
                (promptResponse, index) =>
                  promptResponse != "" && (
                    <div key={index} className="my-4 p-3">
                      <ReactMarkdown>{promptResponse}</ReactMarkdown>
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5 text-center mt-25">
              <div className="w-full h-full">
                <CircularProgress size={75} />
              </div>
              <h1 className="text-xl">Analyzing Input</h1>
              <p className="text-sm">Generating response...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Results;
