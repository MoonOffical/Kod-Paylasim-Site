import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const Code = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  let ApiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          ApiURL + `/kodbilgi`,
          {
            data: { id: id },
            withCredentials: true,
          }
        );
        setCode(res.data[0]);
      } catch (error) {
        console.error("Kod bilgileri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    hljs.highlightAll();
  }, [code]);

  const kopyala = () => {
    if (code.content) {
      navigator.clipboard.writeText(code.content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!code) {
    return navigate('*')
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-white-900 to-black overflow-hidden text-white">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-black-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-grey-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div>
        <Header />
      </div>
      <div className="min-h-screentext-white flex justify-center items-center py-10">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <img
              src={code.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-3 text-sm text-gray-400">{code.author}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{code.title}</h1>
          <p className="text-gray-400">{code.desc}</p>
          <div className="relative">
            <button
              onClick={kopyala}
              className="absolute top-2 right-2 bg-gray-800 shadow-lg text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition"
            >
              {copied ? "Kopyalandı!" : "Kopyala"}
            </button>
            <pre
              className={`language-javascript bg-gray-700 text-gray-300 p-4 rounded-lg overflow-x-auto`}
            >
              <code>{code.content}</code>
            </pre>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Code;
