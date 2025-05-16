import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black text-white p-8 space-y-12">
      {/* Logo Section */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-white rounded-full mr-3" />
        <h1 className="text-2xl font-semibold">Pelican Predict</h1>
      </div>

      {/* Headline Section */}
      <div className="text-center">
        <h1 className="text-7xl font-bold leading-tight mb-6">
          Shortcut for <br /> Becoming a Sugar Daddy
        </h1>
        <p className="text-gray-400 text-lg max-w-4xl mx-auto">
          Meet the all-in-one web tool for quickly getting best Stocks recommendation! — no money/brain required
        </p>
      </div>

      {/* Navigation Button */}
      <button
        onClick={() => navigate("/stocks")}
        className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
      >
        View Stocks
      </button>
    </div>
  );
}