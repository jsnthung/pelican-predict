interface TechnicalAnalysisViewProps {
  recommendation: string;
  confidenceLevel: number;
  reasoning: string;
}

const TechnicalAnalysisView = ({ 
  recommendation, 
  confidenceLevel, 
  reasoning 
}: TechnicalAnalysisViewProps) => {
  // Get appropriate color based on recommendation
  const getRecommendationColor = (rec: string) => {
    const lowerRec = rec.toLowerCase();
    if (lowerRec.includes('buy') || lowerRec.includes('strong')) return 'text-green-400';
    if (lowerRec.includes('sell')) return 'text-red-400';
    return 'text-yellow-400'; // for hold or neutral
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-lg text-gray-300 mr-3">Recommendation:</span>
          <span className={`text-lg font-bold uppercase ${getRecommendationColor(recommendation)}`}>
            {recommendation}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-300 mr-3">Confidence:</span>
          <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${confidenceLevel >= 70 ? 'bg-green-500' : confidenceLevel >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${confidenceLevel}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm">{confidenceLevel}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-300 mb-2">Analysis Reasoning:</h3>
        <p className="text-gray-300 leading-relaxed">{reasoning}</p>
      </div>
    </div>
  );
};

export default TechnicalAnalysisView; 