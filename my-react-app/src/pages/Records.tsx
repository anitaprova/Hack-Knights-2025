import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowRight } from "react-icons/fa6";
import { supabase } from "../../utils/supabaseClient";

interface Record {
  id: number;
  name: string;
  type: string;
  created_at: string;
  content: string;
  translation: string;
}

function Records() {
  const [records, setRecords] = useState<Record[]>([]);
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
              <th className="p-2">Content Length</th>
              <th className="p-2 rounded-tr-md">Translation</th>
            </tr>
          </thead>
          <tbody>
            {records.reverse().map((record, index) => (
              <tr key={index} className="hover:bg-blue/[0.3] cursor-pointer" onClick={() => navigate(`/Records/${record.id}`)}>
                <td className="p-3">{truncateString(record.name)}</td>
                <td className="p-3">{record.type}</td>
                <td className="p-3">{new Date(record.created_at).toLocaleDateString()}</td>
                <td className="p-3">{record.content.length}</td>
                <td className="p-3">{truncateString(record.translation)}</td>
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
    </main>
  );
}

export default Records;
