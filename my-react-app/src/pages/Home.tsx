import {
  ReactMediaRecorder,
  useReactMediaRecorder,
} from "react-media-recorder";

function Home() {
  const [openRecording, setOpenRecording] = useState(false);
  const { stopRecording } = useReactMediaRecorder({ video: true });
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;

  return (
    <div>
      <h1>Recording</h1>

      <h1>Upload Doctor Notes</h1>
    </div>
  );
}

export default Home;
