import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { GiSpeaker } from "react-icons/gi";

function Dictionary() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([""]);
  const api_key = import.meta.env.VITE_MERRIAM_API_KEY;

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyPress = (e) =>{
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  const handleSubmit = () => {
    fetch(
      `https://www.dictionaryapi.com/api/v3/references/medical/json/${search}?key=${api_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const getAudio = (basefilename) => {
    if (!basefilename) return;

    let subdirectory = "";
    if (basefilename.startsWith("bix")) {
      subdirectory = "bix";
    } else if (basefilename.startsWith("gg")) {
      subdirectory = "gg";
    } else if (/^[0-9_]/.test(basefilename)) {
      subdirectory = "number";
    } else {
      subdirectory = basefilename[0];
    }

    const audioUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${basefilename}.mp3`;
    console.log(audioUrl);

    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.error("Playback failed:", err));
  };

  console.log(results);

  return (
    <div className="flex flex-col gap-y-20 ml-50 mr-50 mb-25 mt-25 font-sans">
      <div className="flex">
        <input
          type="text"
          onChange={handleInput}
          onKeyDown={handleKeyPress}
          placeholder="Search a medical term here..."
          className="bg-white w-full text-xl rounded-l-lg p-5 border border border-darkgreen"
        />
        <div className="bg-darkgreen rounded-r-lg border border p-5 border-darkgreen">
          <FaSearch
            size={40}
            color="white"
            className="hover:cursor-pointer"
            onClick={handleSubmit}
          />
        </div>
      </div>

      {results &&
        results.map(
          (result) =>
            result != "" && (
              <div className="bg-lightblue border border-blue border-3 p-5 rounded-lg shadow-[0px_4px_15.8px_-1px_rgba(9,_40,_22,_0.25)]">
                <p className="text-[36px] font-bold">
                  {result?.meta?.id}{" "}
                  <span className="text-lg">{result?.fl}</span>
                </p>

                <div className="flex flex-row gap-x-5 mt-5">
                  <p className="mt-5 text-lg flex">{result?.hwi?.hw}</p>
                  {result?.hwi?.prs?.[0]?.mw && (
                    <p
                      className="flex gap-x-2 bg-blue text-white text-lg rounded-lg w-fit p-2 hover:cursor-pointer"
                      onClick={() =>
                        getAudio(result?.hwi?.prs?.[0]?.sound?.audio)
                      }
                    >
                      <GiSpeaker size={30} />
                      {result?.hwi?.prs?.[0]?.mw}
                    </p>
                  )}
                </div>

                <p className="mt-5 text-lg">{result?.shortdef}</p>
              </div>
            )
        )}
    </div>
  );
}

export default Dictionary;
