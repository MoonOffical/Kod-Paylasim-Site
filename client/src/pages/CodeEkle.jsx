import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function CodeEkle() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState()
  const [yetkili, setYetkili] = useState(false)
  const [avatar, setAvatar] = useState('')

  let ApiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(ApiURL + "/dashboard", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Hatalı fetch");

        const data = await res.json();

        const userData = {
          id: data.user.id,
          avatar: data.user.avatar,
          username: data.user.username,
          accessToken: data.user.accessToken,
        };

        setAvatar(`https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Error fetching user data:", err);
        navigate("/");
      }
    };

    const checkAuthorization = async () => {
      if (user) {
        try {
          const postt = await axios.post(ApiURL + "/rolvarmi", {
            data: { userId: user.id },
            withCredentials: true,
          });
          setYetkili(postt.data.rol);

          if (!postt.data.rol) navigate("/");
        } catch (err) {
          console.error("Error checking authorization:", err);
          navigate("/");
        }
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      checkAuthorization();
    }
  }, [user, yetkili]);


  const handleClick = () => {
    const useridd = Number(user.id);
    let data = {
      title: title,
      desc: desc,
      content: content,
      category: category,
      authorname: user.username,
      authorid: useridd,
      avatar: avatar
    };
    if (title && desc && content && category && user && avatar !== undefined || "") {
      axios.post(ApiURL + "/codeekle", {
        data: data,
        withCredentials: true,
      })
        .then(async (response) => {
          if (response.status === 200) {
            toast.success("Başarılı bir şekilde kod eklendi!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
            return navigate("/")
          } else {
            throw new Error(`Hata: ${response.status}`);
          }

        })
        .catch((error) => {
          console.error("Bir hata oluştu:", error);
          return toast.error("Bir hata oluştu!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        });
    } else {
      return toast.error("Lütfen herşeyi doldur.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-white-900 to-black overflow-hidden text-white flex items-center justify-center">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-black-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-grey-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Kod Ekle</h1>

        <div className="mt-4">
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Kod Başlığı
          </label>
          <input
            type="text"
            id="title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kodun İsmini Gir"
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="desc" className="block mb-2 text-sm font-medium">
            Kod Açıklaması
          </label>
          <input
            type="text"
            id="desc"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={(e) => setDesc(e.target.value)}
            placeholder="V14 Sayaç komutu vb..."
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="content" className="block mb-2 text-sm font-medium">
            Kod
          </label>
          <textarea
            id="content"
            rows="4"
            className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-black"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Kodu Buraya Gir."
          ></textarea>
        </div>
        <div className="mt-4">
          <label htmlFor="category" className="block mb-2 text-sm font-medium">
            Kod Kategorisi
          </label>
          <select
            defaultValue="select"
            id="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option defaultValue="" selected>
              Bir Kategori Seç
            </option>
            <option value="DiscordJS">Discord JS</option>
            <option value="BDFD">BDFD</option>
            <option value="AoiJS">Aoi JS</option>
          </select>
        </div>
        <button
          onClick={handleClick}
          className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          Kodu Ekle
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CodeEkle;
