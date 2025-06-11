import { Container } from "../components/container";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../services/firebase-connection";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().nonempty("Insira seu nome"),
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z
    .string()
    .nonempty("Insira sua senha")
    .min(6, "Insira uma senha com pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut(auth);
    };

    handleLogout();
  }, []);

  const onSubmit = async (data: FormData) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Não foi possível realizar seu cadastro:", error);
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
              type="text"
              placeholder="Digite seu nome..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>
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
            Cadastrar
          </button>
        </form>
        <Link to="/login">Já possui uma conta? Faça login</Link>
      </div>
    </Container>
  );
};
