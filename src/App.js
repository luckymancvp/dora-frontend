import Router from "./route/Index";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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