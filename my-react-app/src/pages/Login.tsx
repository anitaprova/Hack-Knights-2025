import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import Logo from "../assets/logo.svg";
import LoginImage from "../assets/login-image.png";
import { supabase } from "../../utils/supabaseClient";

function Login() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log(email, password);
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        navigate("/");
      }
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

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
          <h2 className="text-l text-center mt-5 text-gray-500">
            Record, translate, and understand medical talk
          </h2>
        </section>
        <section className="flex flex-col justify-center mt-10 px-30">
          <form className="flex flex-col" onSubmit={handleEmailLogin}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="bg-green/[0.7] p-2 rounded-sm mb-5"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="bg-green/[0.7] p-2 rounded-sm mb-5"
            />
            <button className="bg-darkgreen p-3 text-xl text-lightgreen rounded-sm mt-4 cursor-pointer hover:brightness-[0.8]">
              Login
            </button>
            {error && <p className="text-red-300 mt-2">{error}</p>}
          </form>
          <div className="relative flex items-center justify-center w-full my-10">
            <hr className="w-full h-px bg-gray-400 border-0" />
            <span className="absolute px-3 font-medium text-gray-400 bg-lightgreen">
              or
            </span>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="bg-white flex text-xl justify-center items-center gap-5 py-3 px-5 border-darkgreen border-1 border-solid rounded-sm hover:cursor-pointer hover:bg-green"
          >
            <FcGoogle />
            <span>Login with Google</span>
          </button>
        </section>
        <p className="flex justify-center gap-2 mt-30 text-gray-500">
          Not a member?
          <a
            href="/Signup"
            className="text-darkgreen underline hover:text-darkblue"
          >
            Sign up here
          </a>
        </p>
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
