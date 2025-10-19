import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { supabase } from "../../utils/supabaseClient";

interface Record {
  id: number;
  name: string;
  type: string;
  duration: string;
  content: string;
}

function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<Record | null>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        const { data, error } = await supabase
          .from('records')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error(error);
        } else if (data) {
          setRecord(data);
        }
      })();
    }
  }, [id]);

  if (!record) return <div>Loading...</div>;

  return (
    <main className="flex flex-col mt-10 px-25">
      <h1 className="text-2xl mb-3">{record.name}</h1>
      <div className="bg-lightgreen p-5 rounded-md shadow-md">
        <p><strong>Type:</strong> {record.type}</p>
        <p><strong>Duration:</strong> {record.duration}</p>
        <p><strong>Content:</strong> {record.content}</p>
      </div>
    </main>
  );
}

export default RecordDetail;