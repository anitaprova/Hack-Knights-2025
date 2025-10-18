import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import type { Session } from '@supabase/supabase-js';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    })
    // Update session on any authentication event
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
    listener.subscription.unsubscribe();
  }, []);

  if (!loading && !session) {
    return <Navigate to="/Login" replace />
  }
  return children;
}
export default ProtectedRoute;