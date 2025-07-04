import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { PanelHeader } from "../../components/panel-header";
import { Container } from "../../components/container";
import { FiTrash2 } from "react-icons/fi";
import { db, storage } from "../../services/firebase-connection";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

interface CarProps {
  id: string;
  uid: string;
  name: string;
  year: string;
  price: string | number;
  city: string;
  km: string;
  images: ImageCarProps[];
}

interface ImageCarProps {
  name: string;
  uid: string;
  url: string;
}

export const Dashboard = () => {
  const [cars, setCars] = useState<CarProps[]>([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadCars = () => {
      if (!user?.uid) {
        return;
      }

      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user.uid));

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
    loadCars();
  }, [user]);

  const handleDeleteCar = async (car: CarProps) => {
    const docRef = doc(db, "cars", car.id);
    await deleteDoc(docRef);

    car.images.map(async (img) => {
      const imagePath = `images/${car.uid}/${img.name}`;
      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Erro ao deletar imagens:", error);
      }
    });

    setCars(cars.filter((item) => item.id !== car.id));
  };

  return (
    <Container>
      <PanelHeader />
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section key={car.id} className="relative w-full rounded-lg bg-white">
            <button
              onClick={() => handleDeleteCar(car)}
              className="absolute top-2 right-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white"
            >
              <FiTrash2 size={22} color="#000" />
            </button>
            <img
              className="mb-2 max-h-70 w-full rounded-lg"
              src={car.images[0].url}
              alt="Foto do carro"
            />
            <p className="mt-1 mb-2 px-1 font-bold">{car.name}</p>
            <div className="flex flex-col px-2">
              <span>
                Ano {car.year} | {car.km} km
              </span>
              <strong className="mt-4 font-bold text-black">
                R$ {car.price}
              </strong>
            </div>
            <div className="my-2 h-px w-full bg-slate-200"></div>
            <div className="px-2 pb-2">
              <span className="text-black">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
};
