import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-emerald-100 flex flex-row font-sans text-xl justify-around p-3 rounded-full mx-75 mt-5">
      <div
        className="flex items-center gap-2 hover:cursor-pointer"
        onClick={() => navigate(`/`)}
      >
        {/* add icons */}
        <span>Home</span>
      </div>
      <div
        className="flex items-center gap-2 hover:cursor-pointer"
        onClick={() => navigate(`/Records`)}
      >
        <span>Records</span>
      </div>
      <div
        className="flex items-center gap-2 hover:cursor-pointer"
        onClick={() => navigate(`/Dictionary`)}
      >
        <span>Dictionary</span>
      </div>
      <div
        className="flex items-center gap-2 hover:cursor-pointer"
        onClick={() => navigate(`/Account`)}
      >
        <span>Account</span>
      </div>
    </nav>
  );
}

export default Navbar;
