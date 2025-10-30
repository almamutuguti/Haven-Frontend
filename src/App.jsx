import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to HAVEN
          </h1>
          <p className="text-xl text-gray-600">
            React + Vite + Tailwind CSS
          </p>
        </header>

        {/* Logo Section */}
        <div className="flex justify-center space-x-8 mb-12">
          <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
          <img src={reactLogo} className="h-16 w-16" alt="React logo" />
        </div>

        {/* Counter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Interactive Counter</h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button 
              onClick={() => setCount(count - 1)}
              className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full font-bold text-lg transition-colors"
            >
              -
            </button>
            <span className="text-3xl font-bold min-w-20">{count}</span>
            <button 
              onClick={() => setCount(count + 1)}
              className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full font-bold text-lg transition-colors"
            >
              +
            </button>
          </div>
          <button 
            onClick={() => setCount(0)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reset Counter
          </button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-2xl mb-3"></div>
            <h3 className="text-lg font-semibold mb-2">Fast</h3>
            <p className="text-gray-600">Lightning fast development with Vite</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-2xl mb-3"></div>
            <h3 className="text-lg font-semibold mb-2">Modern</h3>
            <p className="text-gray-600">Beautiful UI with Tailwind CSS</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-2xl mb-3"></div>
            <h3 className="text-lg font-semibold mb-2">Powerful</h3>
            <p className="text-gray-600">Built with React for scalability</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-gray-500">
          <p>Built with using modern web technologies</p>
        </footer>
      </div>
    </div>
  )
}

export default App