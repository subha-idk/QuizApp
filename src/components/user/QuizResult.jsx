import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PageWrapper = styled(motion.div)`
  padding: 1rem;
  width: 100%;
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ResultCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  width: 100%;
`;

const Score = styled.p`
  font-size: 3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin: 1rem 0;
`;

const ResultItem = styled(motion.div)`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 5px solid ${({ theme, isCorrect }) => (isCorrect ? theme.colors.secondary : theme.colors.danger)};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  width: 100%;

  p {
      margin: 0.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
`;

const HomeButton = styled(motion.button)`
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
`;

const QuizResult = ({ result }) => {
    const navigate = useNavigate();
    const { score, questionResults } = result;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <PageWrapper
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <ResultCard variants={itemVariants}>
                <h2>Quiz Complete!</h2>
                <p>Your Score</p>
                <Score>{score}</Score>
                <p>You answered {score} out of {questionResults.length} questions correctly.</p>
            </ResultCard>

            <motion.h3 style={{ marginTop: '2rem' }} variants={itemVariants}>
                Detailed Results
            </motion.h3>

            {questionResults.map(res => (
                <ResultItem
                    key={res.questionId}
                    isCorrect={res.isCorrect}
                    variants={itemVariants}
                >
                    <p>
                        <span><strong>Your Answer:</strong> {res.userAnswer || "Not answered"}</span>
                        {res.isCorrect ? <FaCheck style={{ color: 'green' }} /> : <FaTimes style={{ color: 'red' }} />}
                    </p>
                    {!res.isCorrect && (
                        <p>
                            <span><strong>Correct Answer:</strong> {res.correctAnswer}</span>
                        </p>
                    )}
                </ResultItem>
            ))}

            <HomeButton
                onClick={() => navigate('/user')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
            >
                Back to Home
            </HomeButton>
        </PageWrapper>
    );
};

export default QuizResult;
