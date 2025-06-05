import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import pelicanRun from "../assets/pelican-run.json";
import moneyFly from "../assets/money-fly.json";
import moneyRain from "../assets/money-rain.json";

export default function LoadingScene({ onComplete }: { onComplete: () => void }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showRain, setShowRain] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowRain(true);
          setTimeout(onComplete, 5500); // Wait for rain
          return 100;
        }
        return prev + 1;
      });
    }, 40); // ~4 seconds

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Orbit Container */}
      <div
        style={{
          width: 1000,
          height: 1000,
          position: "relative",
        }}
      >
        {/* Spinner Group */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            animation: "spin 3s linear infinite",
          }}
        >
          {/* Pelican */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Lottie animationData={pelicanRun} loop style={{ width: 240 }} />
          </div>

          {/* Money */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%) rotate(180deg)",
            }}
          >
            <Lottie animationData={moneyFly} loop style={{ width: 150 }} />
          </div>
        </div>

        {/* Centered Loading Bar */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "240px",
            height: "14px",
            backgroundColor: "#374151", // Tailwind bg-gray-700
            borderRadius: "999px",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${loadingProgress}%`,
              backgroundColor: "#34d399", // Tailwind bg-green-400
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Money Rain */}
      {showRain && (
        <div
          className="absolute inset-0 pointer-events-none z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        >
          <Lottie 
          animationData={moneyRain}
          autoplay={true}
          loop={false} />
        </div>
      )}

      {/* CSS Keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}