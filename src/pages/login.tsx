import { Container } from "../components/container";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Container>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <Link to="/" className="mb-6 w-full max-w-sm">
          <img className="w-full" src={logo} alt="Logo do site" />
        </Link>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="msx-w-xl w-full rounded-lg bg-white"
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
          <button>Acessar</button>
        </form>
      </div>
    </Container>
  );
};
