import { BrowserRouter } from "react-router-dom";
import "../src/assets/styles/style.css";
import "../src/assets/styles/stylesheet.css";
import { ToastContainer, toast } from "react-toastify";

import AllRoutes from "./Routes/allRoutes";
import { AuthContextProvider } from "./Context/authContext";

function App() {
  return (
    <AuthContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <AllRoutes />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
