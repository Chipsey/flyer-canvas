import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/routes";

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
