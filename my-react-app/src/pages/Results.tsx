import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Results() {
	const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [promptResponses, setpromptResponses] = useState([""]);
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const location = useLocation();

  console.log(location.state);

  useEffect(() => {
    // getResponseForGivenPrompt();
  }, []);

  const getResponseForGivenPrompt = async () => {
    let prompt = "";
    if (location.state.transcript) {
      setInput(location.state.transcript);
      prompt = `You are helping in an application that translates medical speech to plain english. You are given a transcript of what the doctor has said to a patient. Return only your response. Translate the following: ${location.state.transcript}`;
    } else if (location.state.userInput) {
      setInput(location.state.userInput);
      prompt = `You are helping in an application that translates medical speech to plain english. You are given the notes the doctor has given to the patient. Return only your response. Translate the following: ${location.state.userInput}`;
    } else if (location.state.fileText) {
      setInput(location.state.fileText);
      prompt = `You are helping in an application that translates medical speech to plain english. You are given the text from a file that the doctor gave to the patient. Return only your response. Translate the following: ${location.state.fileText}`;
    } else {
      console.log("No passed prompt");
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const result = await model.generateContent(prompt);
      setInput("");
      const response = result.response;
      const text = response.text();
      console.log(text);
      setpromptResponses([...promptResponses, text]);
			setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

	console.log(promptResponses);

  return (
    <div className="flex flex-row font-sans text-xl justify-around p-3 rounded-lg mx-75 mt-5">
      {!loading ? (
        <div className="w-full bg-gray-200 flex flex-col gap-y-3 p-3 rounded-md">
          <h1 className="text-center text-xl">Model Output</h1>
          <div>
            {promptResponses?.map((promptResponse, index) => (
              promptResponse != "" && (
									<div key={index} className="my-4 p-3 bg-white rounded-lg shadow">
										<ReactMarkdown>{promptResponse}</ReactMarkdown>
									</div>
							)
            ))}
          </div>
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
  );
}

export default Results;
