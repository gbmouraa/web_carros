import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../services/firebase-connection";
import { Container } from "../components/container";
import { Link } from "react-router-dom";

interface CarProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export const Home = () => {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = () => {
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));

    getDocs(queryRef).then((snapshot) => {
      const carList = [] as CarProps[];

      snapshot.forEach((doc) => {
        carList.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          km: doc.data().km,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
          uid: doc.data().uid,
        });
      });

      setCars(carList);
    });
  };

  const handleLoadImage = (id: string) => {
    setLoadImages((prev) => [...prev, id]);
  };

  const handleSearchCar = async () => {
    if (input.trim() === "") {
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff"),
    );

    const querySnapshot = await getDocs(q);

    const carList = [] as CarProps[];

    querySnapshot.forEach((doc) => {
      carList.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid,
      });
    });

    setCars(carList);
  };

  return (
    <Container>
      <section className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-lg bg-white p-4">
        <input
          className="h-9 w-full rounded-lg border-2 px-3 outline-none"
          type="text"
          placeholder="Digite o nome do carro..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="h-9 rounded-lg bg-red-500 px-8 font-medium text-white"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>
      <h1 className="mt-6 mb-4 text-center text-2xl font-bold">
        Carros novos e usados em todo o Brasil
      </h1>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} to={`/car-detail/${car.id}`}>
            <section className="w-full rounded-lg bg-white">
              <div
                className="h-72 w-full rounded-lg bg-slate-200"
                style={{
                  display: loadImages.includes(car.id) ? "none" : "block",
                }}
              ></div>
              <img
                className="mb-2 max-h-72 w-full rounded-lg transition-transform hover:scale-105"
                src={car.images[0].url}
                alt="Carro"
                onLoad={() => handleLoadImage(car.id)}
                style={{
                  display: loadImages.includes(car.id) ? "block" : "none",
                }}
              />
              <p className="mt-1 mb-2 px-2 font-bold">{car.name}</p>
              <div className="flex flex-col px-2">
                <span className="mb-6 text-zinc-700">
                  Ano: {car.year} | {car.km} km
                </span>
                <strong className="text-xl font-medium text-black">
                  Preço: R$ {car.price}
                </strong>
              </div>
              <div className="my-2 h-px w-full bg-slate-200" />
              <div className="px-2 pb-2">
                <span className="text-zinc-700">{car.city}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
};
