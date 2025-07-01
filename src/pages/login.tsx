import { useEffect, useContext } from "react";
import { AuthContext } from "../contexts/auth-context";
import { Container } from "../components/container";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../services/firebase-connection";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("Insira sua senha"),
});

type FormData = z.infer<typeof schema>;

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { handleInfoUser } = useContext(AuthContext);

  // usuário é deslogado (caso esteja) toda vez que acessar a página de login
  useEffect(() => {
    const handleLogout = async () => {
      await signOut(auth);
    };

    handleLogout();
  }, []);

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        handleInfoUser({
          uid: user.user.uid,
          email: user.user.email,
          name: user.user.displayName,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Erro ao fazer login:", error);
      });
  };

  return (
    <Container>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <Link to="/" className="mb-6 w-full max-w-sm">
          <img className="w-full" src={logo} alt="Logo do site" />
        </Link>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="msx-w-xl w-full rounded-lg bg-white p-4"
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
          <button
            className="h-10 w-full cursor-pointer rounded-md bg-zinc-900 font-medium text-white"
            type="submit"
          >
            Acessar
          </button>
        </form>
        <Link to="/register">Ainda não possui uma conta? Cadastre-se</Link>
      </div>
    </Container>
  );
};
