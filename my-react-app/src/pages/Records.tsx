import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowRight } from "react-icons/fa6";
import pdfToText from "react-pdftotext";
import type { ChangeEvent } from "react";
import { supabase } from "../../utils/supabaseClient";

interface Record {
  id: number;
  name: string;
  type: string;
  duration: string;
  created_at: string;
  content: string;
}

function Records() {
  const [records, setRecords] = useState<Record[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('records').select('*');
      if (error) {
        console.error(error);
      }
      else if (data) {
        setRecords(data);
      }
    })();
  }, []);
  useEffect(() => {
    if (!fileText || !file) return;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('records')
          .insert({
            user_id: user.id,
            name: file.name,
            file_path: `user-uploads/${file.name}`,
            type: 'text',
            duration: '00:10:00',
            content: fileText,
            translation: fileText,
          });
        if (error) {
          console.error('Insert error:', error);
        } else {
          // Refresh records list
          const { data } = await supabase.from('records').select('*');
          if (data) setRecords(data);
        }
      }
    })()
  }, [fileText, file]);

  const fileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    setFile(file);
    pdfToText(file)
      .then((text) => setFileText(text))
      .catch((error) =>
        console.error("Failed to extract text from pdf", error)
      );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('audio_files')
      .upload(`${user.id}/${fileName}`, file);
    if (error) {
      console.error('Storage upload error:', error);
    } else {
      console.log('Uploaded successfully:', data);
    }
  }

  const truncateString = (str: string) => {
    const snippet = str.slice(0, 50);
    return snippet + (str.length > 50 ? "..." : "");
  }

  return (
    <main className="flex flex-col mt-10 px-25">
      <h1 className="text-2xl mb-3">Records</h1>
      {records.length !== 0 ?
        <table className="p-3 bg-lightgreen text-left shadow-md rounded-md">
          <thead className="border-b-2 border-solid border-b-blue text-sm uppercase bg-green text-gray-700">
            <tr>
              <th className="p-2 rounded-tl-md">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Date</th>
              <th className="p-2">Duration</th>
              <th className="p-2 rounded-tr-md">Content</th>
            </tr>
          </thead>
          <tbody>
            {records.reverse().map((record, index) => (
              <tr key={index} className="hover:bg-blue/[0.3] cursor-pointer" onClick={() => navigate(`/Records/${record.id}`)}>
                <td className="p-3">{truncateString(record.name)}</td>
                <td className="p-3">{record.type}</td>
                <td className="p-3">{new Date(record.created_at).toLocaleDateString()}</td>
                <td className="p-3">{record.duration}</td>
                <td className="p-3">{truncateString(record.content)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        :
        <section className="">
          <p>No records found.</p>
          <button onClick={() => navigate("/")}
            className="flex p-3 bg-green rounded-md mt-4 cursor-pointer hover:bg-darkgreen hover:text-lightgreen gap-2 items-center transition-all duration-300"
          >
            Add records
            <FaArrowRight size={20} className="hover:text-lightgreen" />
          </button>
        </section>}
      <input
        type="file"
        accept=".pdf"
        onChange={fileUpload}
        id="fileUpload"
        hidden
      />
      <label htmlFor="fileUpload">
        <div className="border-dashed border-5 border-darkgreen p-3 m-10 text-center hover:cursor-pointer">
          <p className="text-[24px]">Browse file to upload</p>
          <p className="text-[15px]">Accepted file types: PDF</p>
        </div>
      </label>
    </main>
  );
}

export default Records;
