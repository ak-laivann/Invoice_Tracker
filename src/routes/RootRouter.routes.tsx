import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages";

export const RootRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={"/home"} />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
};
