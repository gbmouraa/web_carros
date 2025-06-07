import { Container } from "../components/container";

export const Home = () => {
  return (
    <Container>
      <section className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-lg bg-white p-4">
        <input
          className="h-9 w-full rounded-lg border-2 px-3 outline-none"
          type="text"
          placeholder="Digite o nome do carro..."
        />
        <button className="h-9 rounded-lg bg-red-500 px-8 font-medium text-white">
          Buscar
        </button>
      </section>
      <h1 className="mt-6 mb-4 text-center text-2xl font-bold">
        Carros novos e usados em todo o Brasil
      </h1>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <section className="w-full rounded-lg bg-white">
          <img
            className="mb-2 max-h-72 w-full rounded-lg transition-transform hover:scale-105"
            src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202505/20250516/toyota-hilux-sw4-2.8-d4d-turbo-diesel-srx-4x4-automatico-wmimagem00545091325.jpg?s=fill&w=552&h=414&q=60"
            alt="Carro"
          />
          <p className="mt-1 mb-2 px-2 font-bold">SW4</p>
          <div className="flex flex-col px-2">
            <span className="mb-6 text-zinc-700">
              Ano: 2022/20222 | 2.000 km
            </span>
            <strong className="text-xl font-medium text-black">
              Preço: R$300.000,00
            </strong>
          </div>
          <div className="my-2 h-px w-full bg-slate-200" />
          <div className="px-2 pb-2">
            <span className="text-zinc-700">Campo Grande - MS</span>
          </div>
        </section>
      </main>
    </Container>
  );
};
