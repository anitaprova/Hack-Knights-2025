import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../utils/supabaseClient";

function Account() {
  const navigate = useNavigate();
  const [selectedVoice, setSelectedVoice] = useState("EXAVITQu4vr4xnSDxMaL");

  useEffect(() => {
    const fetchVoiceSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('account_settings')
        .select('voice')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching voice settings:', error);
        return;
      }

      if (data?.voice) {
        setSelectedVoice(data.voice);
      } else {
        // Create default voice setting if none exists
        const { error: upsertError } = await supabase
          .from('account_settings')
          .upsert({
            user_id: user.id,
            voice: 'EXAVITQu4vr4xnSDxMaL'
          });
        
        if (upsertError) {
          console.error('Error creating voice settings:', upsertError);
        }
      }
    };

    fetchVoiceSettings();
  }, []);
  
  const voices = [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", description: "Young, soft female voice" },
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", description: "Deep, authoritative male voice" },
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", description: "Calm, professional female voice" },
    { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", description: "Confident, strong female voice" },
    { id: "ErXwobaYiN019PkySvjV", name: "Antoni", description: "Well-rounded, versatile male voice" },
    { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", description: "Emotional, expressive female voice" },
    { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", description: "Deep, mature male voice" },
    { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", description: "Crisp, clear male voice" },
    { id: "pqHfZKP75CvOlQylNhV4", name: "Bill", description: "Strong, confident male voice" },
    { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam", description: "Raspy, casual male voice" }
  ];
  
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/Login");
  };

  const saveVoiceSettings = async (voiceId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('account_settings')
      .upsert({
        user_id: user.id,
        voice: voiceId
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving voice:', error);
    }
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
    <div className="flex flex-col gap-y-10 bg-lightgreen border-darkgreen p-9 rounded-lg mx-75 mb-10 mt-10 border-3">
      <h1 className="text-4xl font-bold text-center">Account</h1>
      
      <div className="flex flex-col">
        <select 
          value={selectedVoice} 
          onChange={(e) => {
            setSelectedVoice(e.target.value);
            saveVoiceSettings(e.target.value);
          }}
          className="bg-lightgreen p-3 rounded-lg text-xl border-2 border-darkgreen/[0.6] hover:cursor-pointer"
        >
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id} className="bg-green">
              {voice.name} - {voice.description}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center">
        <img
          src="../src/assets/logout-image.png"
          alt="frog waving bye"
          width={300}
        />
      </div>

      <div className="flex flex-col gap-y-5">
        <button
          onClick={signOut}
          className="bg-green p-3 rounded-lg text-xl hover:cursor-pointer hover:bg-darkgreen transition-all duration-300 hover:text-white"
        >
          Logout
        </button>
        <button className="bg-red-300 p-3 rounded-lg text-xl hover:cursor-pointer hover:bg-red-400 transition-all duration-300 hover:text-white" onClick={deleteRecords}>
          Delete All Records
        </button>
      </div>
    </div>
  );
}

export default Account;
