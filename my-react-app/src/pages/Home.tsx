import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Home() {
  const [userInput, setUserInput] = useState("");
  const [promptResponses, setpromptResponses] = useState([""]);
  const [files, setFiles] = useState<File[]>([]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.log("No support");
  }

  const handleFileChange = (event) => {
    setFiles(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!files) {
      alert("Please select a file first!");
      return;
    }
  };

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const getResponseForGivenPrompt = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const prompt = `You are helping in an application that translates medical speech to plain english. Translate the following: ${userInput}`;
      const result = await model.generateContent(prompt);
      setUserInput("");
      const response = result.response;
      const text = response.text();
      console.log(text);
      setpromptResponses([...promptResponses, text]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-x-10 ml-25 mr-25 mb-25">
      <div className="bg-gray-200 rounded-xl flex flex-col text-xl mt-20 w-full">
        <h1 className="flex text-xl gap-x-2 mb-2 p-3">
          {" "}
          <FaMicrophone />
          Record
        </h1>

        <div className="p-3 flex-1">
          <p>Status: {listening ? "On" : "Off"}</p>
          <div className="flex flex-row gap-x-5">
            <button
              onClick={SpeechRecognition.startListening}
              className="bg-green-200 p-2 rounded-xl"
            >
              Start
            </button>
            <button
              onClick={SpeechRecognition.stopListening}
              className="bg-red-200 p-2 rounded-xl"
            >
              Stop
            </button>
            <button
              onClick={resetTranscript}
              className="bg-blue-200 p-2 rounded-xl mt-auto"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="p-3 w-full h-full">
          <p className="w-full h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm p-3">
            {transcript}
          </p>
        </div>
        <Link
          to="/Results"
          state={{ transcript }}
          className="bg-gray-500 rounded-b-lg p-2 text-white hover:cursor-pointer text-center"
        >
          Submit
        </Link>
      </div>

      <div className="bg-gray-200 rounded-xl flex flex-col text-xl mt-20 w-full text-center">
        <div className="flex flex-col gap-1 h-full w-full">
          <h1 className="text-lg p-3">Copy and Paste Your Doctor's Notes</h1>
          <div className="flex flex-col flex-1 m-5">
            <textarea
              value={userInput}
              onChange={handleUserInput}
              className="w-full h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm p-3 resize-none overflow-scroll"
            />
          </div>
        </div>

        <Link
          to="/Results"
          state={{ userInput }}
          className="bg-gray-500 rounded-b-lg p-2 text-white hover:cursor-pointer text-center"
        >
          Submit
        </Link>
      </div>

      <div className="bg-gray-200 rounded-xl flex flex-col text-xl mt-20 w-full">
        <h1 className="p-3 text-xl text-center">File Uploader</h1>

        <div className="h-full p-3">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            id="fileUpload"
            hidden
          />
          <label htmlFor="fileUpload" className="">
            <div className="border border-dashed border-3 p-3 m-10 text-center hover:cursor-pointer">
              <div className="flex justify-center">
                <FaCloudArrowUp size={50} />
              </div>
              <p>Browse file to upload</p>
            </div>
          </label>
        </div>

        <Link
          to="/Results"
          state={{ userInput }}
          className="bg-gray-500 rounded-b-lg p-2 text-white hover:cursor-pointer text-center"
        >
          Submit
        </Link>
      </div>
    </div>
  );
}

export default Home;
