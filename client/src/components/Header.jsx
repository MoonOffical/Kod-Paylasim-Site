import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Reactsvg from '../assets/react.svg'

function Header() {
  const [user, setUser] = useState();
  const [yetkili, setYetkili] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let ApiURL = import.meta.env.VITE_API_URL;
  useEffect(() => {
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
        return;
      });
  }, []);

  useEffect(() => {
    if (user) {
      const postladım = async () => {
        let postt = await axios.post(ApiURL + "/rolvarmi", {
          data: {
            userId: user.id,
          },
          withCredentials: true
        })
        setYetkili(postt.data.rol)
      }
      postladım()
    }
  }, [user])
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="bg-[#0b1120] text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <img src={Reactsvg} alt="CODE WORLD" />
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-purple-400 transition">
            Anasayfa
          </Link>

          <div className="relative group">
            <Link to="/codes" className="hover:text-purple-400 transition flex items-center">
              Kodlar
            </Link>
          </div>
        </nav>
        <div className="flex items-center space-x-4 relative">
          {user ? (
            <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                  alt="Discord Profile"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1c2333] text-white rounded-md shadow-lg z-50">
                  <div className="py-2">
                    <p className="px-4 py-2 text-sm">Merhaba, {user.username}!</p>
                    <hr className="border-gray-700" />
                    <Link to="/user/kodlarım" className="block px-4 py-2 text-sm hover:bg-[#2b3548] transition">Kodlarım</Link>
                    {yetkili ? (
                      <Link to="/user/kodekle" className="block px-4 py-2 text-sm hover:bg-[#2b3548] transition">Kod Ekle</Link>
                    ) : (
                      <div></div>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-[#2b3548] transition"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={ApiURL + "/auth/discord"}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
