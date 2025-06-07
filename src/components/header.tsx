import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { FiUser, FiLogIn } from "react-icons/fi";

export const Header = () => {
  const signed = false;
  const loadingAuth = false;

  return (
    <div className="mb-4 flex h-16 w-full items-center justify-center bg-white drop-shadow-2xl">
      <header className="mx-auto flex w-full max-w-7xl justify-between px-4">
        <Link to="/">
          <img src={logo} alt="Logo do site" />
        </Link>
        {!loadingAuth && signed && (
          <Link to="/dashboard">
            <div className="rounded-full border border-gray-900 p-1">
              <FiUser size={24} color="#000" />
            </div>
          </Link>
        )}
        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className="rounded-full border border-gray-900 p-1">
              <FiLogIn size={24} color="#000" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
};
