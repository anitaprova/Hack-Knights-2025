import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { FaStop } from "react-icons/fa";
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
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  console.log(listening);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-x-20 ml-50 mr-50 mb-25 font-sans">
      <div className="bg-lightblue rounded-xl flex flex-col text-xl mt-20 w-full shadow-custom">
        <h1 className="flex text-xl gap-x-2 mb-2 p-8 justify-center">
          <p className="text-center text-[36px] font-bold">Audio Recording</p>
        </h1>

        <div className="p-3 flex-1">
          {/* <p>Status: {listening ? "On" : "Off"}</p> */}
          {listening ? (
            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-y-5 items-center">
                <button
                  onClick={SpeechRecognition.startListening}
                  className="bg-red-200 p-6 rounded-full w-fit"
                >
                  <FaStop size={100} />
                </button>
                <p className="text-[24px]">Click to stop recording</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-y-5 items-center">
                <button
                  onClick={SpeechRecognition.startListening}
                  className="bg-blue p-6 rounded-full w-fit"
                >
                  <FaMicrophone size={100} />
                </button>

                <p className="text-[24px]">Click to start recording</p>
              </div>
            </div>
          )}

          {/* <button
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
            </button> */}
        </div>

        <div className="p-3 w-full h-full">
          <p className="w-full h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm p-3 overflow-scroll">
            {transcript}
          </p>
        </div>
        <Link
          to="/Results"
          state={{ transcript }}
          className="bg-darkblue text-[36px] rounded-b-lg p-2 text-white hover:cursor-pointer text-center"
        >
          Translate
        </Link>
      </div>

      <div className="bg-lightgreen shadow-custom rounded-xl flex flex-col text-xl mt-20 w-full text-center">
        <h1 className="text-[36px] p-5 font-bold">Text Document</h1>
        <div className="flex justify-center">
          <Tabs
            value={value}
            onChange={handleChange}
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
                },
                "&:hover": {
                  backgroundColor: "#e0f9e2ff",
                },
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
                },
                "&:hover": {
                  backgroundColor: "#e0f9e2ff",
                },
              }}
            />
          </Tabs>
        </div>

        {value === 0 && (
          <div className="rounded-xl flex flex-1 flex-col text-xl mt-5 w-full">
            <div className="h-full">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="fileUpload"
                hidden
              />
              <label htmlFor="fileUpload">
                <div className="border border-dashed border-5 border-darkgreen p-3 m-10 text-center hover:cursor-pointer">
                  <div className="flex justify-center">
                    <FaCloudArrowUp size={100} />
                  </div>
                  <p className="text-[24px]">Browse file to upload</p>
                  <p className="text-[15px]">Accepted file types: PDF</p>
                </div>
              </label>

              {fileText ? (
                <div className="bg-gray-50 flex gap-x-2 p-1.5 rounded-sm">
                  <IoDocumentText size={25} />
                  <p>{files?.name}</p>
                </div>
              ) : (
                <p></p>
              )}
            </div>

            <Link
              to="/Results"
              state={{ fileText }}
              className="bg-darkgreen text-[36px] rounded-b-lg p-2 text-white hover:cursor-pointer text-center"
            >
              Translate
            </Link>
          </div>
        )}

        {value === 1 && (
          <div className="flex flex-col flex-1 gap-1 h-full w-full">
            <div className="flex flex-col flex-1 m-5">
              <p className="text-left pb-2 pt-4">
                Write your doctors medical notes
              </p>
              <textarea
                value={userInput}
                onChange={handleUserInput}
                className="w-full h-full border border-darkgreen text-gray-900 text-sm rounded-sm p-3 resize-none overflow-scroll"
              />
            </div>
            <Link
              to="/Results"
              state={{ userInput }}
              className="bg-darkgreen text-[36px] rounded-b-lg p-2 text-white hover:cursor-pointer text-center"
            >
              Translate
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
