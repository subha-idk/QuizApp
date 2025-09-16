import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createEmptyQuiz, getAllQuizzes } from '../../api/api';
import { FaWrench } from 'react-icons/fa';

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.black};
`;

const FormWrapper = styled(motion.form)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const Message = styled(motion.p)`
    text-align: center;
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
    color: white;
    background-color: ${({ theme, type }) => (type === 'success' ? theme.colors.secondary : theme.colors.danger)};
`;

const QuizListWrapper = styled.div`
    margin-top: 2rem;
`;

const QuizListItem = styled(motion.div)`
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: ${({ theme }) => theme.shadows.soft};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ManageButton = styled(motion.button)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
`;

const QuizManagement = () => {
    const [quizData, setQuizData] = useState({ title: '', timeLimit: 30 });
    const [existingQuizzes, setExistingQuizzes] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const { data } = await getAllQuizzes();
                setExistingQuizzes(data);
            } catch (error) {
                console.error("Failed to fetch existing quizzes", error);
            }
        };
        fetchQuizzes();
    }, []);

    const handleChange = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const { data: newQuiz } = await createEmptyQuiz(quizData);
            setMessage(`Quiz "${newQuiz.quizTitle}" created! Redirecting...`);
            setMessageType('success');
            setTimeout(() => {
                navigate(`/admin/quiz-builder/${newQuiz.quizId}`);
            }, 1500);
        } catch (error) {
            console.error("Failed to create quiz:", error);
            setMessage('Error: Could not create the quiz.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle>Quiz Management</PageTitle>
            <FormWrapper onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3>Create New Quiz</h3>
                <Label htmlFor="title">Quiz Title</Label>
                <Input id="title" name="title" value={quizData.title} onChange={handleChange} placeholder="e.g., Advanced Java Concepts" required />
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input id="timeLimit" name="timeLimit" type="number" value={quizData.timeLimit} onChange={handleChange} required min="1" />
                <SubmitButton type="submit" disabled={loading} whileTap={{ scale: 0.95 }}>
                    {loading ? 'Creating...' : 'Create & Build Quiz'}
                </SubmitButton>
            </FormWrapper>
            
            <AnimatePresence>
                {message && <Message type={messageType}>{message}</Message>}
            </AnimatePresence>

            <QuizListWrapper>
                <h3>Manage Existing Quizzes</h3>
                {existingQuizzes.length > 0 ? (
                    existingQuizzes.map(quiz => (
                        <QuizListItem key={quiz.quizId} layout>
                            <span>{quiz.quizTitle}</span>
                            <ManageButton 
                                onClick={() => navigate(`/admin/quiz-builder/${quiz.quizId}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaWrench /> Manage
                            </ManageButton>
                        </QuizListItem>
                    ))
                ) : (
                    <p>No existing quizzes found.</p>
                )}
            </QuizListWrapper>
        </>
    );
};

export default QuizManagement;
