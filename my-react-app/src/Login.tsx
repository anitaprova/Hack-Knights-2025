import { supabase } from "../utils/supabaseClient";

function Login() {
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
  return (
    <button onClick={handleGoogleLogin}>
      <span>Sign in with Google</span>
    </button>
  );
}
export default Login;