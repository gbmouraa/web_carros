import { Routes, Route, Outlet } from "react-router-dom";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { Register } from "../pages/register";
import { CarDetail } from "../pages/car";
import { Dashboard } from "../pages/dashboard/dashboard";
import { New } from "../pages/dashboard/new";
import { Header } from "../components/header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const SimpleLayout = () => {
  return <Outlet />;
};

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/car-detail/:id" element={<CarDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/new" element={<New />} />
        </Route>
        <Route element={<SimpleLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </>
  );
};
