import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-500 animate-pulse">
            404
          </h1>
          <h2 className="text-2xl mt-4 font-semibold">Sayfa Bulunamadı</h2>
          <p className="text-gray-400 mt-2">
            Üzgünüm, aradığınız sayfa mevcut değil.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors duration-300"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
