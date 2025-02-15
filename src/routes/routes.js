import { Routes, Route } from "react-router-dom";
import FlyerDesign from "../pages/flyer-design-page/flyer-design-page";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FlyerDesign />} />
    </Routes>
  );
};

export default AppRoutes;
