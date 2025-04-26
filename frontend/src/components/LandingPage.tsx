export default function LandingPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black text-white p-8 space-y-12">
        
        {/* Logo Section */}
        <div className="flex items-center mb-6">
          {/* You can replace this with an image if you have a logo */}
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
  
      </div>
    );
  }
  