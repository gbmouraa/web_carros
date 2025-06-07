import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  error?: string;
  register: UseFormRegister<any>;
  rules?: RegisterOptions;
}

export const Input = ({
  type,
  placeholder,
  name,
  error,
  register,
  rules,
}: InputProps) => {
  return (
    <div>
      <input
        className="none h-11 w-full rounded-md border-2 px-2 outline-none"
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="my-y text-xs text-red-500">{error}</p>}
    </div>
  );
};
