import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Anasayfa() {
  const [user, setUser] = useState();

  let ApiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) {
      fetch(ApiURL + "/dashboard", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) return
          return res.json();
        })
        .then((data) => {
          let asıldata = {
            id: data.user.id,
            avatar: data.user.avatar,
            username: data.user.username,
            accessToken: data.user.accessToken,
          };

          setUser(asıldata);
          localStorage.setItem("user", JSON.stringify(asıldata));
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, [user]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-white-900 to-black overflow-hidden text-white">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-black-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-grey-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div>
        <Header />
      </div>
      <div className="relative z-10 flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Hoşgeldin,{user?.username}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mt-4">
            Sitemizde discord botları için yapılmış kodlar mevcuttur.
          </p>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default Anasayfa
