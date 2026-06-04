import "./App.css";
import SwapForm from "./SwapForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="flex flex-col gap-5 w-full h-screen justify-center items-center">
      <h1
        style={{ fontFamily: '"Inter", sans-serif' }}
        className="text-4xl font-extrabold tracking-tight text-white/95 drop-shadow-[0_2px_10px_rgba(99,102,241,0.35)]"
      >
        Swap Form
      </h1>
      <SwapForm />
      <ToastContainer position="top-right" theme="dark" autoClose={4000} newestOnTop pauseOnHover />
    </div>
  );
}

export default App;
