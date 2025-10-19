import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Logo from "../assets/logo.svg";
import LoginImage from "../assets/confusedfrog-image.png";
import { supabase } from "../../utils/supabaseClient";
import ConfusedFrog from "../assets/confusedfrog-image.png";
import * as React from "react";

function Signup() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/");
      }
    })
  }, [navigate]);
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email && password) {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: "/Login",
        },
      })
      if (error) {
        setError(error.message);
      }
    }
  }
  return (
    <div className="flex h-screen">
      <section className="bg-green w-1/2 flex items-center p-20">
        <img src={ConfusedFrog} alt="" />
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
          <h2 className="text-l text-center mt-5 text-gray-500">Record, translate, and understand medical talk</h2>
        </section>
        <section className="flex flex-col justify-center mt-10 px-30">
          <form className="flex flex-col" onSubmit={handleSignup}>
            <label htmlFor="email">
              Email
            </label>
            <input type="email" id="email" required onChange={(e) => setEmail(e.target.value)} className="bg-green/[0.7] p-2 rounded-sm mb-5" />

            <label htmlFor="password">
              Password
            </label>
            <input type="password" id="password" required onChange={(e) => setPassword(e.target.value)} className="bg-green/[0.7] p-2 rounded-sm mb-5" />
            <button className="bg-darkgreen p-3 text-xl text-lightgreen rounded-sm mt-4 cursor-pointer hover:brightness-[0.8]">
              Sign up
            </button>
            {error && <p className="text-red-300 mt-2">{error}</p>}
          </form>
          <p className="mt-8 text-gray-500">
            After signing up, check your email to verify your account.
          </p>
        </section>
        <p className="flex justify-center gap-2 mt-30 text-gray-500">
          Already a member?
          <a href="/Login" className="text-darkgreen underline hover:text-darkblue">Login here</a>
        </p>
      </main>
    </div>
  );
}
export default Signup;