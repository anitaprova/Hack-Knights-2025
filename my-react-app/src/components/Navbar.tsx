import { useNavigate } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import Logo from "../assets/logo.svg";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white/[0.6] font-sans shadow-[0px_1px_5px_0px_rgba(0,_0,_0,_0.25)] text-xl flex flex-row justify-between px-10 p-3 rounded-md mx-25 mt-5">
      <div
        className="flex items-center gap-2 group cursor-pointer"
        onClick={() => navigate(`/`)}
      >
        <img
          src={Logo}
          alt="MedSpeak Logo"
          onClick={() => navigate(`/`)}
          className="group-hover:hue-rotate-30 transition-all duration-300"
        />
        <p>
          Med
          <span className="text-[#019A6A] group-hover:text-darkblue transition-all duration-300">
            Speak
          </span>
        </p>
      </div>

      <div className="flex flex-row gap-5">
        <div
          className="flex items-center gap-2 hover:cursor-pointer hover:text-darkblue transition-all duration-300"
          onClick={() => navigate(`/Records`)}
        >
          <span>Records</span>
        </div>
        <div
          className="flex items-center gap-2 hover:cursor-pointer hover:text-darkblue transition-all duration-300"
          onClick={() => navigate(`/Dictionary`)}
        >
          <span>Dictionary</span>
        </div>
        <div
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => navigate(`/Account`)}
        >
          <MdOutlineAccountCircle
            color="#5AA057"
            size={45}
            className="hover:text-darkblue transition-all duration-300"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
