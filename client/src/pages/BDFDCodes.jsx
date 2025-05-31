import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { useNavigate } from 'react-router-dom'
import Header from "../components/Header";
import Footer from "../components/Footer";

const BDFDCodes = () => {
  const navigate = useNavigate();

  const [codes, setCodes] = useState([]);
  const [search, setSearch] = useState("");
  const [sayfa, setSayfa] = useState(1);
  const [sbsayı, setSbsayı] = useState(9);

  let ApiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const datass = async () => {
      try {
        const res = await fetch(ApiURL + "/bdfdcodes");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCodes(data);
        } else {
          console.error("Beklenmedik veri formatı:", data);
          setCodes([]);
        }
      } catch (error) {
        console.error("Kodları çekme hatası:", error);
        setCodes([]);
      }
    };


    datass();
  }, []);

  const codefiltrele = Array.isArray(codes)
    ? codes.filter((code) =>
      code.title.toLowerCase().includes(search.toLowerCase())
    )
    : [];


  const ikinci = sayfa * sbsayı;
  const birinci = ikinci - sbsayı;
  const filtrelenmiskod = codefiltrele.slice(birinci, ikinci);

  const totalPages = Math.ceil(codefiltrele.length / sbsayı);

  const kategorigit = (e) => {
    let seçim = e.target.value;
    if (seçim === "DJS") {
      navigate("/djscodes")
    } else if (seçim === "BDFD") {
      navigate("/bdfdcodes")
    } else if (seçim === "AOIJS") {
      navigate("/aoicodes")
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-white-900 to-black overflow-hidden text-white">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-black-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-grey-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="mb-5">
        <Header />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">BDFD Kodları</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">

            <form className="max-w-sm">
              <select
                id="countries"
                onChange={kategorigit}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="" selected>
                  Kategori
                </option>
                <option value="DJS">Discord JS</option>
                <option value="BDFD">BDFD</option>
                <option value="AOIJS">Aoi JS</option>
              </select>
            </form>

            <input
              type="text"
              placeholder="Kod Ara..."
              className="p-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtrelenmiskod.length > 0 ? (
            filtrelenmiskod.map((code) => (
              <div key={code.id}>
                <Card
                  avatar={code.avatar}
                  author={code.author}
                  title={code.title}
                  desc={code.desc}
                  id={code.id}
                  category={code.category}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-white-400 col-span-3">
              <h1 className="mt-32 mb-20 text-7xl font-sans font-bold">Bu kategoride kod bulunamadı.</h1>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 left-0 w-full py-4">
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setSayfa(number)}
                  className={`px-4 py-2 rounded-lg ${sayfa === number
                    ? "bg-gray-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-white-500"
                    }`}
                >
                  {number}
                </button>
              )
            )}
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default BDFDCodes;
