import { useState } from 'react';

function GraphContainer({ stock }: { stock: string }) {
  const [position, setPosition] = useState<'short' | 'long'>('long');

  return (
    <div className="w-full bg-gray-700 rounded-lg p-4 space-y-4">
      
      {/* Top right Short/Long toggle */}
      <div className="flex justify-end">
        <div className="flex border border-gray-800 rounded-full overflow-hidden">
          <button
            className={`px-4 py-2 text-sm ${position === 'short' ? 'bg-gray-800' : ''}`}
            onClick={() => setPosition('short')}
          >
            Short
          </button>
          <button
            className={`px-4 py-2 text-sm ${position === 'long' ? 'bg-gray-800' : ''}`}
            onClick={() => setPosition('long')}
          >
            Long
          </button>
        </div>
      </div>

      {/* Graph Placeholder (ntr lu ganti disini thung)*/}
      <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-md">
        <p className="text-gray-300 font-semibold">
          Graph for {stock} ({position})
        </p>
      </div>

    </div>
  );
}

export default GraphContainer;
