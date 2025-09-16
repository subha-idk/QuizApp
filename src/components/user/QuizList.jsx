import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { getAllQuizzes } from '../../api/api';

const QuizCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  cursor: pointer;

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchWrapper = styled.div`
    position: relative;
    margin-bottom: 1.5rem;
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.grayDark};
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.grayMedium};
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
    }
`;

const LoadingSpinner = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 2rem auto;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const ErrorMessage = styled.p`
    color: ${({ theme }) => theme.colors.danger};
    text-align: center;
`;

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const { data } = await getAllQuizzes();
                setQuizzes(data);
            } catch (err) {
                setError('Failed to load quizzes. Please check if the server is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    return (
        <>
            <SearchWrapper>
                <SearchIcon />
                <SearchInput
                    type="text"
                    placeholder="Search for a quiz..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchWrapper>
            <AnimatePresence>
                {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map(quiz => (
                        <QuizCard
                            key={quiz.quizId}
                            onClick={() => navigate(`/quiz/${quiz.quizId}`)}
                            whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3>{quiz.quizTitle}</h3>
                        </QuizCard>
                    ))
                ) : (
                    <p>No quizzes found.</p>
                )}
            </AnimatePresence>
        </>
    );
};

export default QuizList;
