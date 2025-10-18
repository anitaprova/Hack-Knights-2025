import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import Logo from "../assets/logo.svg";
import LoginImage from "../assets/login-image.png";
import { supabase } from "../../utils/supabaseClient";

interface Record {
  name: string;
  type: string;
  duration: string;
  content: string;
}

function Login() {
  const [records, setRecords] = useState<Record[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/");
      }
    })
  }, [navigate]);
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
    <div className="flex h-screen">
      <section className="bg-green w-1/2 flex items-center p-20">
        <img src={LoginImage} alt="" />
      </section>
      <main className="bg-lightgreen w-1/2 p-20">
        <section>
          <div className="flex items-center justify-center gap-2">
            <img src={Logo} alt="MedSpeak logo" />
            <h1 className="text-4xl">
              Med
              <span className="text-darkgreen">Speak</span>
            </h1>
          </div>
          <h2 className="text-l text-center mt-5 text-darkgreen">Record, translate, and understand medical talk</h2>
        </section>
        <section className="flex justify-center mt-10">
          <button
            onClick={handleGoogleLogin}
            className="bg-white flex text-xl justify-around items-center gap-7 py-3 px-5 border-darkgreen border-1 border-solid rounded-sm hover:cursor-pointer hover:bg-green"
          >
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>
        </section>
        {/* <button onClick={testSupabase}>
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
        </div> */}
      </main>
    </div>
  );
}
export default Login;