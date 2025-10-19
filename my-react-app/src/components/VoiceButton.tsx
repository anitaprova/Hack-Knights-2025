import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { supabase } from "../../utils/supabaseClient";

export function VoiceButton({ text }: { text: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceId, setVoiceId] = useState("EXAVITQu4vr4xnSDxMaL");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchVoiceId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('account_settings')
        .select('voice')
        .eq('user_id', user.id)
        .single();

      if (data?.voice) {
        setVoiceId(data.voice);
      } else {
        // Create default voice setting if none exists
        await supabase
          .from('account_settings')
          .upsert({
            user_id: user.id,
            voice: 'EXAVITQu4vr4xnSDxMaL'
          });
      }
    };

    fetchVoiceId();
  }, []);
  const speak = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Stop any previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.7,
              style: 0.8,
              use_speaker_boost: true
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch TTS audio");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the audio in the browser
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();

      audio.onended = () => setIsGenerating(false);
      audio.onerror = () => setIsGenerating(false);
    }
    catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  }
  // Stop audio when navigating away
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [location]);

  // Also stop on window unload
  useEffect(() => {
    const handleUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
    <button 
    onClick={speak} 
    disabled={isGenerating}
    className="py-1 px-2 bg-blue/[0.5] mb-1 rounded-md flex gap-2 items-center hover:cursor-pointer hover:bg-blue hover:text-white"
    >
      <HiMiniSpeakerWave size={20} />
      {isGenerating ? "Generating..." : "Read aloud"}
    </button>
  );
}
export default VoiceButton;
