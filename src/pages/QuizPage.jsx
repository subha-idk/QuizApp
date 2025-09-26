import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { startQuiz, submitQuiz } from '../api/api';

import QuizTaker from '../components/user/QuizTaker';
import QuizResult from '../components/user/QuizResult';
import { motion } from 'framer-motion';

const PageWrapper = styled.div`
  padding: 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const StartCard = styled(motion.div)`
    background: white;
    padding: 2rem 3rem;
    border-radius: 12px;
    box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Button = styled(motion.button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 600;
  cursor: pointer;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const ErrorMessage = styled.p`
    color: ${({ theme }) => theme.colors.danger};
    background-color: #ff3b3020;
    padding: 1rem;
    border-radius: 8px;
`;


const QuizPage = () => {
    const { quizId } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState('ready'); // 'ready', 'loading', 'started', 'finished', 'error'
    const [errorMessage, setErrorMessage] = useState('Something went wrong. Please try again later.');

    const handleStartQuiz = async () => {
        setStatus('loading');
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        try {
            console.log("Starting quiz with ID:", quizId, "and session ID:", newSessionId);

            const { data } = await startQuiz(quizId, newSessionId);
            console.log("Quiz data received:", data);
            // **FIX:** Check if the received data is valid and has questions before starting.
            if (data && data.questions && data.questions.length > 0) {
                setQuizData(data);
                setStatus('started');
            } else {
                // If no questions are found, set an error state.
                console.error("Failed to start quiz: No questions found or invalid data received.", data);
                setErrorMessage('Could not start the quiz. No questions were found for this category.');
                setStatus('error');
            }
        } catch (error) {
            console.error("Failed to start quiz:", error);
            setErrorMessage('An error occurred while fetching the quiz data.');
            setStatus('error');
        }
    };

    const handleSubmitQuiz = async (responses) => {
        setStatus('loading');
        try {
            const { data } = await submitQuiz(sessionId, responses);
            setResult(data);
            setStatus('finished');
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            setErrorMessage('An error occurred while submitting your quiz.');
            setStatus('error');
        }
    };

    // Render different UIs based on the current status
    switch (status) {
        case 'loading':
            return <PageWrapper><LoadingSpinner /></PageWrapper>;

        case 'error':
            return <PageWrapper><ErrorMessage>{errorMessage}</ErrorMessage></PageWrapper>;

        case 'finished':
            return <QuizResult result={result} quizId={quizId} />;

        case 'started':
            // return <QuizTaker quizData={quizData} onSubmit={handleSubmitQuiz} />;
            return <QuizTaker quizData={quizData} onSubmit={handleSubmitQuiz} sessionId={sessionId} />;

        case 'ready':
        default:
            return (
                <PageWrapper>
                    <StartCard initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <h2>Ready to start the quiz?</h2>
                        <p>Once you begin, the timer will start.</p>
                        <Button onClick={handleStartQuiz} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Start Quiz
                        </Button>
                    </StartCard>
                </PageWrapper>
            );
    }
};

export default QuizPage;
