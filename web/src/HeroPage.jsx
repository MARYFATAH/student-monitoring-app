import { Link } from "react-router-dom";

export function HeroPage() {
  return (
    <div className="h-screen bg-gradient-to-r from-blue-500 to-indigo-600  flex flex-col justify-center items-center text-white p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Welcome to the Student Monitoring Web
      </h1>
      <p className="text-lg md:text-xl mb-4">
        Here we can help you to smooth the education process!
      </p>
      <p className="text-lg md:text-xl mb-8">
        Here you can find information about our heroes.
      </p>
      <Link
        to="/login"
        className="bg-white text-blue-600 hover:bg-gray-200 font-bold py-2 px-6 rounded-lg transition-colors duration-300"
      >
        Let's Start
      </Link>
    </div>
  );
}
