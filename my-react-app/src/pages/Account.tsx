import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabaseClient";

function Account() {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/Login");
  }
  return (
    <div>
      <h1>Account</h1>
      <button onClick={signOut}>
        Logout
      </button>
    </div>
  );
}

export default Account;
