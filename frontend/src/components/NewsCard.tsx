interface NewsCardProps {
  headline: string;
  summary: string;
  url: string;
}

const NewsCard = ({ headline, summary, url }: NewsCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition duration-200">
      <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">{headline}</h3>
      {summary && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">{summary}</p>
      )}
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-400 text-sm hover:underline inline-flex items-center"
      >
        Read more
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
};

export default NewsCard; 