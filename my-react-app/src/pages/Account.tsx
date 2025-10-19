import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabaseClient";

function Account() {
  const navigate = useNavigate();
  
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/Login");
  };

  const deleteRecords = async () => {
    let userID = "";
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session) {
      userID = session?.user.id;
    } else {
      console.error("No active session:", error);
    }
    
    await supabase.from("records").delete().eq("user_id", userID);
  };

  return (
    <div className="flex flex-col gap-y-10 bg-lightgreen border border-darkgreen p-9 rounded-lg mx-75 mb-25 mt-15 border-3 border-darkgreen">
      <h1 className="text-4xl font-bold text-center">Account</h1>
      <div className="flex items-center justify-center">
        <img
          src="../src/assets/logout-image.png"
          alt="frog waving bye"
          width={300}
        />
      </div>

      <div className="flex flex-col gap-y-5">
        <button className="bg-green p-3 rounded-lg text-xl hover:cursor-pointer">
          Select Voice
        </button>
        <button
          onClick={signOut}
          className="bg-green p-3 rounded-lg text-xl hover:cursor-pointer"
        >
          Logout
        </button>
        <button className="bg-red-300 p-3 rounded-lg text-xl hover:cursor-pointer" onClick={deleteRecords}>
          Delete All Records
        </button>
      </div>
    </div>
  );
}

export default Account;
