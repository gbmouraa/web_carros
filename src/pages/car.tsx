import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase-connection";
import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps {
  id: string;
  name: string;
  model: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  city: string;
  whatsapp: string;
  images: ImageCarProps[];
}

interface ImageCarProps {
  name: string;
  uid: string;
  url: string;
}

export const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState<CarProps>();
  const [sliderPreview, setSliderPreview] = useState<number>(2);

  useEffect(() => {
    const loadCar = async () => {
      if (!id) return;

      const docRef = doc(db, "cars", id);
      await getDoc(docRef).then((snapshot) => {
        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          year: snapshot.data()?.year,
          km: snapshot.data()?.km,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          price: snapshot.data()?.price,
          owner: snapshot.data()?.owner,
          uid: snapshot.data()?.uid,
          city: snapshot.data()?.city,
          whatsapp: snapshot.data()?.whatsapp,
          images: snapshot.data()?.images,
        });
      });
    };

    loadCar();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setSliderPreview(1);
      } else {
        setSliderPreview(2);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      <Swiper
        slidesPerView={sliderPreview}
        pagination={{ clickable: true }}
        navigation
      >
        {car?.images.map((item) => (
          <SwiperSlide key={item.name}>
            <img src={item.url} className="h-96 w-full" alt="Foto do carro" />
          </SwiperSlide>
        ))}
      </Swiper>
      {car && (
        <main className="my-4 w-full rounded-lg bg-white p-6">
          <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
            <h1 className="text-3xl font-bold text-black">{car.name}</h1>
            <h1 className="text-3xl font-bold text-black">R$ {car.price}</h1>
          </div>
          <p>{car.model}</p>
          <div className="my-4 flex w-full gap-6">
            <div className="flex flex-col gap-3">
              <div>
                <p>Cidade:</p>
                <strong>{car.city}</strong>
              </div>
              <div>
                <p>Ano:</p>
                <strong>{car.year}</strong>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p>Km:</p>
                <strong>{car.km}</strong>
              </div>
            </div>
          </div>
          <strong>Descrição:</strong>
          <p className="mb-4">{car.description}</p>
          <strong>Telefone / Whatsapp:</strong>
          <p className="mb-4">{car.whatsapp}</p>
          <a
            href=""
            className="my-6 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-500 text-xl font-medium text-white"
          >
            Conversar com vendedor
            <FaWhatsapp size={26} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  );
};
