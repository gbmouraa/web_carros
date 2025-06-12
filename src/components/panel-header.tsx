import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase-connection";

export const PanelHeader = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="mb-4 flex h-10 w-full items-center gap-4 rounded-lg bg-red-500 px-4 font-medium text-white">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/new">Cadastrar carro</Link>
      <button className="ml-auto cursor-pointer" onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
};
