import { useState } from "react";
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
import { supabase } from "../../utils/supabaseClient";

function Home() {
  const [userInput, setUserInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
    let original_text = "";
    if (inputType === "transcript") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given a transcript of what the doctor has said to a patient. Return only your response. Translate the following: ${transcript}`;
      original_text = transcript;
    } else if (inputType === "userInput") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given the notes the doctor has given to the patient. Return only your response. Translate the following: ${userInput}`;
      original_text = userInput;
    } else if (inputType === "file") {
      prompt = `You are helping in an application that translates medical speech to plain english. You are given the text from a file that the doctor gave to the patient. Return only your response. Translate the following: ${fileText}`;
      original_text = fileText;
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
      fileUpload(original_text, text, inputType);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = (text: string) => {
    setResultValue(1);
    setType(text);
    console.log(type);
    getResponseForGivenPrompt(text);
  };

  const handleTextChange = (_event: React.SyntheticEvent, newValue: number) =>
    setTextValue(newValue);
  const handleResultChange = (_event: React.SyntheticEvent, newValue: number) =>
    setResultValue(newValue);

  if (!browserSupportsSpeechRecognition) {
    console.log("Speech recognition not supported in this browser.");
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    setFile(file);
    extractText(file);
  };

  function extractText(file: File) {
    pdfToText(file)
      .then((text) => setFileText(text))
      .catch((error) =>
        console.error("Failed to extract text from pdf", error)
      );
  }

  const handleUserInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };
  const formatType = (type: string) => {
    switch (type) {
      case 'userInput': return 'Text input';
      case 'file': return 'Text file';
      case 'transcript': return 'Audio';
      default: return type;
    }
  };

  const fileUpload = async (original_text: string, translation: string, type: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user found');
      return;
    }
    
    const recordName = files[0]?.name || `${type}-record-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('records')
      .insert({
        user_id: user.id,
        name: recordName,
        type: formatType(type),
        content: original_text,
        translation: translation,
      });
      
    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('Record inserted successfully:', data);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-x-20 h-[75vh] mx-25 mt-10 m-10">
      {/* Add Record */}
      <div className="bg-lightgreen border-3 border-darkgreen rounded-xl flex flex-col text-xl text-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <input
          type="text"
          placeholder="Record"
          className="p-1 text-center font-bold text-4xl rounded-lg m-5"
        />
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
                <div className="border-dashed border-5 border-darkgreen p-4 text-center hover:cursor-pointer hover:bg-green-100">
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
                  <p>{file?.name}</p>
                </div>
              ) : null}
            </div>

            {/* Button pinned to bottom */}
            <button
              className="bg-darkgreen text-4xl rounded-b-lg p-2 text-white hover:cursor-pointer text-center mt-auto hover:bg-green-900"
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
              className="bg-darkgreen text-4xl rounded-b-lg p-2 text-white hover:cursor-pointer text-center hover:bg-green-900"
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
                    className="bg-red-200 p-6 rounded-full w-fit mb-5 hover:cursor-pointer hover:bg-red-600"
                  >
                    <FaStop size={100} />
                  </button>
                  <p className="text-3xl mt-3">Start Recording</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      SpeechRecognition.startListening({
                        continuous: true,
                        language: "en-US",
                      });
                      setResultValue(0);
                    }}
                    className="bg-green p-6 rounded-full w-fit mb-5 hover:cursor-pointer hover:bg-green-600"
                  >
                    <FaMicrophone size={100} />
                  </button>
                  <p className="text-3xl mt-3">Start Recording</p>
                </div>
              </div>
            )}

            {/* Push button to bottom */}
            <button
              className="bg-darkgreen text-4xl rounded-b-lg p-2 text-white hover:cursor-pointer hover:bg-green-900 text-center mt-auto"
              onClick={() => handleSubmit("transcript")}
            >
              Translate
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-gray-100 rounded-xl border-3 border-darkgreen flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
