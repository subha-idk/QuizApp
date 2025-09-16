import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const QuizWrapper = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const TimerBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.grayMedium};
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const TimerProgress = styled(motion.div)`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const QuestionTitle = styled(motion.h2)`
  font-size: 1.4rem;
  margin-bottom: 2rem;
  min-height: 100px; /* Allocate space to prevent layout shifts */
`;

const OptionButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primary : theme.colors.grayMedium};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primaryLight : theme.colors.white};
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NextButton = styled(motion.button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2rem;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const QuizTaker = ({ quizData, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit * 60);

  const handleSubmit = useCallback(
    (finalResponses) => {
      console.log("Submitting responses:", finalResponses); // Your debugger
      onSubmit(finalResponses || responses);
    },
    [onSubmit, responses]
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(responses);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit, responses]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];

    // **DEBUGGING STEP:** This will log the entire question object.
    // Check your browser's console to see all its properties and find the correct ID name.
    console.log("Current Question Object:", currentQuestion);

    // **FIX:** Safely find the question ID. Your backend might send it as 'id', 'qId', 'questionId', etc.
    const questionId =
      currentQuestion.id ||
      currentQuestion.qId ||
      currentQuestion.qid || // <-- add this line
      currentQuestion.questionId;

    const newResponse = {
      rId: questionId,
      response: selectedOption,
    };
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setSelectedOption(null);

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit(updatedResponses);
    }
  };

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Manually create an array of options from the separate properties.
  const currentOptions = [
    currentQuestion.option1,
    currentQuestion.option2,
    currentQuestion.option3,
    currentQuestion.option4,
  ].filter((option) => option != null); // Filter out any null/undefined options

  return (
    <QuizWrapper>
      <TimerBar>
        <TimerProgress
          initial={{ width: "100%" }}
          animate={{
            width: `${(timeLeft / (quizData.timeLimit * 60)) * 100}%`,
          }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </TimerBar>

      <QuestionHeader>
        <span>{`Question ${currentQuestionIndex + 1} of ${
          quizData.questions.length
        }`}</span>
        <span>{`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</span>
      </QuestionHeader>

      <AnimatePresence mode="wait">
        <QuestionTitle
          key={
            currentQuestion.id ||
            currentQuestion.qId ||
            currentQuestion.questionId
          }
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion.questionTitle}
        </QuestionTitle>
      </AnimatePresence>

      <div>
        {/* Map over the manually created options array */}
        {currentOptions.map((option, index) => (
          <OptionButton
            key={index}
            onClick={() => handleSelectOption(option)}
            isSelected={selectedOption === option}
            whileTap={{ scale: 0.97 }}
          >
            {option}
          </OptionButton>
        ))}
      </div>

      <NextButton
        onClick={handleNextQuestion}
        disabled={!selectedOption}
        whileTap={{ scale: 0.95 }}
      >
        {currentQuestionIndex < quizData.questions.length - 1
          ? "Next"
          : "Submit"}
      </NextButton>
    </QuizWrapper>
  );
};

export default QuizTaker;
