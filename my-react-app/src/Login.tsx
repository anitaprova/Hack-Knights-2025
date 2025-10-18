import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface Record {
  name: string;
  type: string;
  duration: string;
  content: string;
}

function Login() {
  const [records, setRecords] = useState<Record[]>([]);
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }
  const fetchRecords = async () => {
    const { data, error } = await supabase.from('records').select('*');
    if (error) { console.error(error) }
    else if (data) { setRecords(data) }
  }
  const testSupabase = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('records')
        .insert(
          { name: 'some record!', user_id: user.id, type: "audio", duration: "00:42:31", content: "some transcript" }
        );
        fetchRecords();
    }
  }
  return (
    <div>
      <h1>Login page</h1>
      <button onClick={handleGoogleLogin}>
        <span>Sign in with Google</span>
      </button>
      <button onClick={testSupabase}>
        Insert into supabase
      </button>
      <div>
        <h2>Records:</h2>
        <ul>
          {records.map((record, index) => (
            <li key={index}>
              {record.name} - {record.type} - {record.duration} - {record.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default Login;