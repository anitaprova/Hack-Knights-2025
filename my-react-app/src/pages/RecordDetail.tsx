import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { BsFillTrashFill } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
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
  const [tab, setTab] = useState("translation");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

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

  const deleteRecord = async () => {
    if (!id) return;

    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
    } else {
      navigate('/Records');
    }
  };

  const editName = () => {
    setNewName(record?.name || "Untitled");
    setIsEditing(true);
  };

  const saveName = async () => {
    if (!id || !newName.trim()) return;

    const { error } = await supabase
      .from('records')
      .update({ name: newName })
      .eq('id', id);

    if (error) {
      console.error('Update error:', error);
    } else {
      setRecord(prev => prev ? { ...prev, name: newName } : null);
      setIsEditing(false);
    }
  };

  if (!record) return <div>Loading...</div>;

  return (
    <main className="flex flex-row my-10 px-25 gap-10">
      <section className="w-2/5">
        <div className="bg-lightgreen p-5 rounded-md border-1 border-darkgreen border-solid">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-2xl font-bold bg-white border border-darkgreen rounded px-2 py-1 flex-1"
              />
              <button onClick={saveName} className="bg-darkgreen text-white px-3 py-2 rounded hover:cursor-pointer hover:brightness-[0.8] transition-all duration-300">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-3 py-2 rounded hover:cursor-pointer hover:brightness-[0.8] transition-all duration-300">Cancel</button>
            </div>
          ) : (
            <h1 className="text-2xl mb-3 font-bold">{record.name}</h1>
          )}
          <p><strong>Type:</strong> {record.type}</p>
          <p><strong>Content length:</strong> {record.content.length}</p>
          <p><strong>Created on:</strong> {new Date(record.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="flex gap-3">
            <button onClick={editName} className="flex items-center bg-green border-1 border-solid border-darkgreen py-2 px-3 gap-3 text-l mt-3 hover:cursor-pointer hover:bg-darkgreen hover:text-white transition-all duration-300">
              <MdOutlineEdit size={23} />
              Edit record name
            </button>
            <button onClick={deleteRecord} className="flex items-center bg-red-200 border-1 border-solid border-red-400 py-2 px-3 gap-3 text-l mt-3 hover:cursor-pointer hover:bg-red-400 hover:text-white transition-all duration-300">
              <BsFillTrashFill size={23} />
              Delete record
            </button>
          </div>
        </div>
      </section>
      <section className="w-3/5">
        <div>
          <button
            onClick={() => setTab("translation")}
            className={`${tab === "translation" ? "bg-lightblue border-darkblue border-1 border-b-2 border-b-blue" : "bg-blue/[0.8]  border-b-2 border-blue/[0.8] hover:cursor-pointer hover:bg-blue/[0.3] transition-all duration-300"} border-solid px-3 py-2 rounded-t-md`}
          >
            Translation
          </button>
          <button
            onClick={() => setTab("original_content")}
            className={`${tab === "original_content" ? "bg-lightblue border-darkblue border-1 border-b-2 border-b-blue" : "bg-blue/[0.8] border-b-2 border-blue/[0.8] hover:cursor-pointer hover:bg-blue/[0.3] transition-all duration-300"} border-solid px-3 py-2 rounded-t-md`}
          >
            Original Content
          </button>
        </div>
        <section className="border-1 border-blue border-solid rounded-b-md p-5 bg-lightblue">
          {tab === "translation" ?
            <section>
              <section className="flex gap-3 items-center">
                <h2 className="text-xl">Translation</h2>
                <VoiceButton text={record.translation} />
              </section>
              <hr className="mb-2" />
              <p className="whitespace-pre-wrap">{record.translation}</p>
            </section>
            :
            <section>
              <section className="flex gap-3 items-center">
                <h2 className="text-xl">Original Content</h2>
                <VoiceButton text={record.content} />
              </section>
              <hr className="mb-2" />
              <p className="whitespace-pre-wrap">{record.content}</p>
            </section>
          }
        </section>
      </section>

    </main>
  );
}

export default RecordDetail;