import React from 'react'
import { Link } from 'react-router-dom'

function Card({avatar,author,title,desc,category,id}) {
const links = `/codes/${id}`

  return (
    <div className="max-w-sm bg-gray-800 rounded-lg shadow-lg text-white p-6">
      <div className="flex items-center mb-4">
        <img
          src={avatar}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <span className="ml-3 text-sm text-gray-400">{author}</span>
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-400 mb-4">
        {desc}
      </p>
      <hr className="border-gray-600 mb-4" />
      <div className="flex justify-between text-sm">
        <div>
          <span className="block text-gray-400">Kategori</span>
          <span className="text-blue-400">{category}</span>
        </div>
      </div>
      <Link
        to={links}
        className="mt-4 block py-2 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Görüntüle
      </Link>
    </div>
  )
}

export default Card
