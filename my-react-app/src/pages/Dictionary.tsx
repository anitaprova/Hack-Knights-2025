import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { GiSpeaker } from "react-icons/gi";
import ConfusedFrog from "../assets/confusedfrog-image.png";

interface DictionaryResult {
  meta?: { id?: string };
  fl?: string;
  hwi?: {
    hw?: string;
    prs?: {
      mw?: string;
      sound?: { audio?: string };
    }[];
  };
  shortdef?: string[];
}

function Dictionary() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<DictionaryResult[]>([]);
  const api_key = import.meta.env.VITE_MERRIAM_API_KEY;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    fetch(
      `https://www.dictionaryapi.com/api/v3/references/medical/json/${search}?key=${api_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setResults([]);
          return;
        }

        if (typeof data[0] === "string") {
          setResults([]);
        } else {
          setResults(data);
        }
      })
      .catch((err) => console.error(err.message));
  };

  const getAudio = (basefilename: string) => {
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
    <div className="flex flex-col gap-y-20 ml-50 mr-50 mb-25 mt-15">
      <div className="flex text-md">
        <input
          type="text"
          onChange={handleInput}
          onKeyDown={handleKeyPress}
          placeholder="Search a medical term here..."
          className="bg-white w-full rounded-l-lg p-2 border border-darkgreen"
        />
        <div className="bg-darkgreen rounded-r-lg border p-2 border-darkgreen">
          <FaSearch
            size={35}
            color="white"
            className="hover:cursor-pointer"
            onClick={handleSubmit}
          />
        </div>
      </div>

      {results.length > 0 ? (
        results.map(
          (result) =>
            result != null && (
              <div className="bg-lightblue border-blue p-5 rounded-lg border-3">
                <p className="text-4xl font-bold">
                  {result?.meta?.id}{" "}
                  <span className="text-lg">{result?.fl}</span>
                </p>

                <div className="flex flex-row gap-x-5 mt-5">
                  <p className="mt-5 text-lg flex">{result?.hwi?.hw}</p>
                  {result?.hwi?.prs?.[0]?.mw && (
                    <p
                      className="flex gap-x-2 bg-blue text-white text-lg rounded-lg w-fit p-2 hover:cursor-pointer"
                      onClick={() =>
                        getAudio(result?.hwi?.prs?.[0]?.sound?.audio ?? "")
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
        )
      ) : (
        <div className="flex flex-col gap-y-5 justify-center items-center">
          <img src={ConfusedFrog} alt="confused frog" width={450} />
        </div>
      )}
    </div>
  );
}

export default Dictionary;
