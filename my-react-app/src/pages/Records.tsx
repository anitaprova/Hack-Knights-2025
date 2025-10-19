import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabaseClient";

interface Record {
  id: number;
  name: string;
  type: string;
  duration: string;
  content: string;
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
  
  return (
    <main className="flex flex-col mt-10 px-25">
      <h1 className="text-2xl mb-3">Records</h1>
      <table className="p-3 bg-lightgreen text-left shadow-md rounded-md">
        <thead className="border-b-2 border-solid border-b-blue text-sm uppercase bg-green text-gray-700">
          <tr>
            <th className="p-2 rounded-tl-md">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Duration</th>
            <th className="p-2 rounded-tr-md">Content</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className="hover:bg-blue/[0.3] cursor-pointer" onClick={() => navigate(`/Records/${record.id}`)}>
              <td className="p-3">{record.name}</td>
              <td className="p-3">{record.type}</td>
              <td className="p-3">{record.duration}</td>
              <td className="p-3">{record.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Records;
