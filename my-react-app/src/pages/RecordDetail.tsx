import { useState, useEffect } from "react";
import { useParams } from "react-router";
import VoiceButton from "../components/VoiceButton";
import { supabase } from "../../utils/supabaseClient";

interface Record {
  id: number;
  name: string;
  type: string;
  created_at: string;
  content: string;
  translation: string;
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
    <main className="flex flex-col my-10 px-25">
      <h1 className="text-2xl mb-3">{record.name}</h1>
      <div className="bg-lightgreen p-5 rounded-md shadow-md">
        <p><strong>Type:</strong> {record.type}</p>
        <p><strong>Content length:</strong> {record.content.length}</p>
        <p><strong>Created on:</strong> {record.created_at}</p>
        <VoiceButton text={record.translation} />
        <section className="flex gap-5">
          <section>
            <h2 className="text-xl mt-5 mb-2">Translation:</h2>
            <p className="whitespace-pre-wrap">{record.translation}</p>
          </section>
          <section>
            <h2 className="text-xl mt-5 mb-2">Content:</h2>
            <p className="whitespace-pre-wrap">{record.content}</p>
          </section>

        </section>
      </div>
    </main>
  );
}

export default RecordDetail;