import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/quiz/all")
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  const handleStart = (quizId) => {
    if (window.confirm("Are you sure you want to start the quiz?")) {
      navigate(`/quiz/${quizId}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.quizId} quiz={quiz} onStart={handleStart} />
        ))}
      </div>
    </div>
  );
}