export default function QuizCard({ quiz, onStart }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">{quiz.quizTitle}</h2>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => onStart(quiz.quizId)}
      >
        Start Quiz
      </button>
    </div>
  );
}
