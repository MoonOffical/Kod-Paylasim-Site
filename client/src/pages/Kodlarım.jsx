import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Card from "../components/Card"

function Kodlarım() {
  const [user, setUser] = useState();
  const [codes, setCodes] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  let ApiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) {
      fetch(ApiURL + "/dashboard", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (data?.user) {
            const asıldata = {
              id: data.user.id,
              avatar: data.user.avatar,
              username: data.user.username,
              accessToken: data.user.accessToken,
            };
            setUser(asıldata);
            localStorage.setItem("user", JSON.stringify(asıldata));
          } else {
            navigate("/");
          }
        })
        .catch(() => navigate("/"));
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      const useridd = Number(user.id)
      axios.post(ApiURL + "/kodlarim", {
        data: { userId: useridd },
        withCredentials: true
      })
        .then((res) => {
          setCodes(res.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Kodları çekerken hata oluştu:", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-white-900 to-black overflow-hidden text-white">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-black-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-grey-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div>
        <Header />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center py-10">
        <h1 className="mt-20 text-4xl md:text-6xl font-bold text-white">
          Hoşgeldin, {user?.username}
        </h1>
        <div className="text-lg md:text-xl text-gray-300 mt-4">
          {codes.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-2xl mb-4 text-center">Kodlarınız</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {codes.map((code) => (
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
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="mt-20">Henüz bir kod paylaşmamışsın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Kodlarım;
