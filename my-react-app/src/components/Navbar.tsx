import { useNavigate } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import ReactLogo from "../assets/logo.svg";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white-60 font-sans shadow-[0px_1px_5px_0px_rgba(0,_0,_0,_0.25)] text-[36px] justify-between flex flex-row gap-x-10 font-sans text-xl justify-around p-3 rounded-md mx-25 mt-10">
      <div>
        <div
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => navigate(`/`)}
        >
          <img src={ReactLogo} alt="React Logo" onClick={() => navigate(`/`)}/>
          <p>
            Med<span className="text-darkgreen">Speak</span>
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-5">
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
          <MdOutlineAccountCircle size={45} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
