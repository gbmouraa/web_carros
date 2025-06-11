import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase-connection";

interface AuthProviderProps {
  children: ReactNode;
}

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email,
        });
        setLLoadingAuth(false);
      } else {
        setUser(null);
        setLLoadingAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ signed: !!user, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
