import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";

export function RootLayout() {
  return (
    <div className="page">
      <Header />
      <Outlet />
    </div>
  );
}

export function PaperLayout() {
  return (
    <div className="page">
      <Header paper />
      <Outlet />
    </div>
  );
}
