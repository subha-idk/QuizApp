import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function QuizPlayer() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0); // minutes
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newSessionId = uuidv4();

    fetch(
      `http://localhost:8080/api/quiz/start/${quizId}?sessionId=${newSessionId}`,
      {
        method: "POST",
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to start quiz session");
        }
        return res.json();
      })
      .then((data) => {
        // --- Debugging Line 1: Check the raw API data ---
        console.log("Raw API data:", data);

        const initialQuestions = (data.questions || []).map((q) => ({
          // Use 'id' for consistency in the frontend
          id: q.qid, // <-- Map the backend's qid to the frontend's id
          questionTitle: q.questionTitle,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          status: "not_answered",
          userAnswer: "",
        }));

         // --- Debugging Line 2: Check the mapped state ---
        console.log("Mapped questions state:", initialQuestions);
        
        setQuestions(initialQuestions);
        setTimeLimit(data.timeLimit || 0);
        setTimeLeft((data.timeLimit || 0));
        localStorage.setItem("quizSessionId", newSessionId);
      })
      .catch((error) => {
        console.error("Error starting quiz session:", error);
        navigate("/");
      });
  }, [quizId, navigate]);



  useEffect(() => {
    if (timeLeft <= 0 && questions.length > 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, questions]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleOptionSelect = (option) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[current];
    currentQuestion.userAnswer = option;
    if (currentQuestion.status !== "marked_for_review") {
      currentQuestion.status = "answered";
    }
    setQuestions(updatedQuestions);
  };

  const handleMarkForReview = () => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[current];
    currentQuestion.status =
      currentQuestion.status === "marked_for_review"
        ? currentQuestion.userAnswer
          ? "answered"
          : "not_answered"
        : "marked_for_review";
    setQuestions(updatedQuestions);
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      handleSubmit();
    }
  };

  const jumpToQuestion = (index) => {
    setCurrent(index);
  };

  const handleSubmit = () => {
    const markedQuestions = questions
      .filter((q) => q.status === "marked_for_review")
      .map((q, index) => index + 1);

    if (markedQuestions.length > 0) {
      const confirmation = window.confirm(
        `You have ${
          markedQuestions.length
        } questions marked for review (Ques: ${markedQuestions.join(
          ", "
        )}). Do you want to submit anyway?`
      );
      if (!confirmation) {
        return;
      }
    }

    setIsLoading(true);

    const responseList = questions.map((q) => ({
      rId: q.id, 
      response: q.userAnswer || "",
    }));

    // --- Debugging Line 3: Check the final payload before sending ---
    console.log("Final payload for submission:", responseList);

    const sessionId = localStorage.getItem("quizSessionId");
    if (sessionId) {
      console.log("Final :", responseList);
      fetch(`http://localhost:8080/api/quiz/submit/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseList),
      })
        .then((res) => {
          if (!res.ok) {
            // If the response status is not 200, throw an error
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((result) => {
          localStorage.removeItem("quizSessionId");
          if (result && result.questionResults) {
            navigate("/result", { state: { result, questions } });
          } else {
            // Handle cases where the backend response is unexpected
            throw new Error("Unexpected response from server.");
          }
        })
        .catch((error) => {
          console.error("Submission failed:", error);
          setIsLoading(false);
          alert("Quiz submission failed. Please try again.");
          // Consider navigating back to the dashboard on submission failure
          navigate("/");
        });
    }
  };

  if (!questions.length || isLoading)
    return <div className="p-4 text-center text-xl font-bold">Loading...</div>;

  const q = questions[current];
  const options = [q.option1, q.option2, q.option3, q.option4];

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-screen bg-gray-100 gap-6 animate-fade-in">
      {/* Left: Main Quiz */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Question {current + 1} of {questions.length}
          </h2>
          <div className="text-xl font-mono text-red-600 font-bold">
            ⏳ {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          <p className="font-semibold text-lg text-gray-700 mb-4">
            {q.questionTitle}
          </p>
          {options.map((opt) => (
            <div
              key={opt}
              className={`mb-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                q.userAnswer === opt
                  ? "bg-blue-100 ring-2 ring-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => handleOptionSelect(opt)}
            >
              <label className="flex items-center space-x-2 w-full cursor-pointer">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={opt}
                  checked={q.userAnswer === opt}
                  onChange={() => {}}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-200 ${
                    q.userAnswer === opt
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white"
                  }`}
                >
                  {q.userAnswer === opt && (
                    <span className="w-2 h-2 bg-white rounded-full block"></span>
                  )}
                </span>
                <span className="text-gray-800">{opt}</span>
              </label>
            </div>
          ))}

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleMarkForReview}
              className={`px-6 py-2 rounded-lg font-semibold text-white shadow transition-all duration-300 ${
                q.status === "marked_for_review"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {q.status === "marked_for_review" ? "Unmark" : "Mark for Review"}
            </button>
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-all duration-300"
            >
              {current + 1 === questions.length ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* Right: Navigation Panel */}
      <div className="w-full md:w-72 bg-white p-6 rounded-lg shadow-xl">
        <h3 className="font-bold text-xl mb-4 text-gray-800">
          Question Navigator
        </h3>
        <div className="grid grid-cols-5 md:grid-cols-4 gap-3">
          {questions.map((question, index) => {
            let buttonClass;
            switch (question.status) {
              case "marked_for_review":
                buttonClass = "bg-red-500";
                break;
              case "answered":
                buttonClass = "bg-green-500";
                break;
              default:
                buttonClass = "bg-blue-500";
                break;
            }

            return (
              <button
                key={question.id}
                onClick={() => jumpToQuestion(index)}
                className={`
                  w-10 h-10 m-0.5 rounded-full font-semibold text-white flex items-center justify-center
                  transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${buttonClass}
                  ${
                    index === current
                      ? "ring-4 ring-offset-2 ring-purple-500 animate-pulse"
                      : ""
                  }
                `}
                title={`Status: ${
                  question.status
                    ? question.status.replace("_", " ")
                    : "Not Answered"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
