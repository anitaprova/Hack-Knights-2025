import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabaseClient";

function Account() {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/Login");
  };
  return (
    <div className="flex flex-col gap-y-10 bg-lightgreen border border-darkgreen p-9 rounded-lg mx-75 mb-25 mt-15 shadow-custom">
      <h1 className="text-4xl font-bold text-center">Account</h1>
      <div className="flex items-center justify-center">
        <img
          src="../src/assets/logout-image.png"
          alt="frog waving bye"
          width={300}
        />
      </div>

      <div className="flex flex-col gap-y-5">
        <button className="bg-blue p-3 rounded-lg text-xl hover:cursor-pointer">
          Select Voice
        </button>
        <button
          onClick={signOut}
          className="bg-green p-3 rounded-lg text-xl hover:cursor-pointer"
        >
          Logout
        </button>
        <button className="bg-red-300 p-3 rounded-lg text-xl hover:cursor-pointer">
          Delete All Records
        </button>
      </div>
    </div>
  );
}

export default Account;
