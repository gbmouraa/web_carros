import { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";

interface PrivateProps {
  children: ReactNode;
}

export const Private = ({ children }: PrivateProps) => {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    return <></>;
  }

  if (!signed) {
    return <Navigate to="/" />;
  }

  return children;
};
