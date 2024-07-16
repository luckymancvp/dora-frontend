import Router from "./route/Index";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "./layout/provider/Theme";

const App = () => {
  return (
    <ThemeProvider>
      <ToastContainer />
      <Router />
    </ThemeProvider>
  );
};
export default App;