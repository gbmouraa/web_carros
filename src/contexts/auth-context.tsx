import { createContext } from "react";
import { UserProps } from "./auth-provider";

type AuthContextData = {
  user: UserProps | null;
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ uid, name, email }: UserProps) => void;
};

export const AuthContext = createContext({} as AuthContextData);
