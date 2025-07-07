import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { Container } from "../../components/container";
import { PanelHeader } from "../../components/panel-header";
import { FiUpload, FiTrash } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Input } from "../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidV4 } from "uuid";
import { db, storage } from "../../services/firebase-connection";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O modelo do carro é obrigatório"),
  year: z.string().nonempty("O ano do carro é obrigatório"),
  km: z.string().nonempty("O Km do carro é obrigatório"),
  price: z.string().nonempty("O preço do carro é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatória"),
  whatsapp: z
    .string()
    .min(1, "O telefone é obrigátorio")
    .refine((value) => /^\d{11}$/.test(value), {
      message: "Número de telefone inválido.",
    }),
  description: z.string().nonempty("A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string;
  name: string;
  previewURL: string;
  url: string;
}

export const New = () => {
  const { user } = useContext(AuthContext);

  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    if (carImages.length === 0) {
      toast.error("Envie alguma imagem do carro.");
      return;
    }

    const carListImages = carImages.map((car) => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });

    addDoc(collection(db, "cars"), {
      name: data.name.toUpperCase(),
      model: data.model,
      whatsapp: data.whatsapp,
      city: data.city,
      year: data.year,
      km: data.km,
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImages,
    })
      .then(() => {
        console.log("Cadastrado com sucesso");
        toast.success("Carro cadastrado com sucesso");
        reset();
        setCarImages([]);
      })
      .catch((error) => {
        console.error("Não foi posível cadastrar o carro:", error);
      });
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await uploadFile(image);
      } else {
        alert("Insira uma imagem do tipo jpeg ou png");
      }
    }
  };

  const uploadFile = async (img: File) => {
    if (!user?.uid) return;

    const currentUid = user.uid;
    // gera um id unico aleatório
    const imgUid = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${imgUid}`);

    await uploadBytes(uploadRef, img).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        const imageItem = {
          name: imgUid,
          uid: currentUid,
          previewURL: URL.createObjectURL(img),
          url: downloadURL,
        };

        setCarImages((prev) => [...prev, imageItem]);
      });
    });
  };

  const handleDeleteImage = async (img: ImageItemProps) => {
    const imagePath = `images/${img.uid}/${img.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImages((prev) => prev.filter((item) => item.url !== img.url));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <Container>
      <PanelHeader />
      <div className="flex w-full flex-col items-center gap-2 rounded-lg bg-white p-3 sm:flex-row">
        <button className="relative flex min-h-32 min-w-48 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-600">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              className="absolute top-0 left-0 z-10 block h-32 w-48 cursor-pointer opacity-0"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>
        </button>
        {carImages.map((item) => (
          <div
            key={item.name}
            className="relative flex h-32 w-full items-center justify-center"
          >
            <button
              className="absolute cursor-pointer"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              className="h-32 w-full rounded-lg object-cover"
              src={item.url}
              alt="Foto do carro"
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 rounded-lg bg-white p-3 sm:flex-row">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              name="name"
              register={register}
              error={errors.name?.message}
              placeholder="Ex: Onix 2016"
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type="text"
              name="model"
              register={register}
              error={errors.model?.message}
              placeholder="Ex: 1.4 LTZ Aut"
            />
          </div>
          <div className="mb-3 flex w-full items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                name="year"
                register={register}
                error={errors.year?.message}
                placeholder="Ex: 2016/2017"
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Km rodados</p>
              <Input
                type="text"
                name="km"
                register={register}
                error={errors.km?.message}
                placeholder="Ex: 60.000"
              />
            </div>
          </div>
          <div className="mb-3 flex w-full flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone para contato</p>
              <Input
                type="text"
                name="whatsapp"
                register={register}
                error={errors.whatsapp?.message}
                placeholder="Ex: 11 9 92440246"
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                name="city"
                register={register}
                error={errors.city?.message}
                placeholder="Ex: Belo Horizonte - MG"
              />
            </div>
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              name="price"
              register={register}
              error={errors.price?.message}
              placeholder="60.000,00"
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="h-24 w-full rounded-md border-2 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro..."
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="h-10 w-full cursor-pointer rounded-md bg-zinc-900 font-medium text-white"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
};
