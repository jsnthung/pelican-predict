import { useNavigate } from "react-router-dom";
import LoadingScene from "./Loading";
import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";

export default function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  if (!loaded) {
    return <LoadingScene onComplete={() => setLoaded(true)} />;
  }

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
          <Typewriter
            words={['Get Rich', 'Retire Early', 'Become a Sugar Daddy']}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </h1>
        <p className="text-gray-400 text-lg max-w-4xl mx-auto">
          Meet the all-in-one web tool for quickly getting best Stocks recommendation! — no money/brain required!
        </p>
      </div>

      {/* Navigation Button */}
      <button
        onClick={() => navigate("/stock-overview")}
        className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
      >
        View Stocks
      </button>
    </div>
  );
}