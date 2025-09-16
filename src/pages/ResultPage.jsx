import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the result and questions from the state
  const { result, questions } = location.state || {};

  // If no result is found, redirect to the dashboard
  if (!result || !questions) {
    navigate('/', { replace: true });
    return null;
  }

  const questionMap = new Map(questions.map(q => [q.id, q]));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Quiz Results</h1>
      <div className="flex justify-center mb-8">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-700">Your Score:</h2>
          <p className="text-5xl font-extrabold text-green-600 mt-2">{result.score}/{result.questionResults.length}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Detailed Breakdown</h2>
        {result.questionResults.map((questionResult, index) => {
          const questionDetails = questionMap.get(questionResult.questionId);
          
          const isCorrect = questionResult.isCorrect;
          const cardClass = isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300';
          const titleClass = isCorrect ? 'text-green-700' : 'text-red-700';

          return (
            <div key={questionResult.questionId} className={`p-5 mb-4 border-2 rounded-lg shadow-sm transition-all duration-300 ${cardClass}`}>
              <h3 className={`font-bold text-xl mb-2 ${titleClass}`}>
                Question {index + 1}: {questionDetails?.questionTitle}
              </h3>
              <p className="mb-1 text-gray-800">
                <span className="font-semibold">Your Answer:</span> 
                <span className={`ml-2 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {questionResult.userAnswer || "Not Answered"}
                </span>
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Correct Answer:</span>
                <span className="ml-2 font-medium text-green-600">
                  {questionResult.correctAnswer}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}