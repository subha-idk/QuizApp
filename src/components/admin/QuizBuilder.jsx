import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getAllQuestions, getQuizById, addQuestionToQuiz, removeQuestionFromQuiz } from '../../api/api';
import { FaPlus, FaTrash } from 'react-icons/fa';

const BuilderWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    height: calc(100vh - 150px);

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        height: auto;
    }
`;

const Column = styled.div`
    background: #f9f9f9;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const ColumnTitle = styled.h2`
    margin-top: 0;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
`;

const FilterWrapper = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
`;

const Input = styled.input`
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    flex-grow: 1;
`;

const Select = styled.select`
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
`;

const QuestionCard = styled(motion.div)`
    background: white;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    margin-bottom: 0.8rem;
    box-shadow: ${({ theme }) => theme.shadows.soft};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: ${({ theme, color }) => theme.colors[color] || theme.colors.primary};
`;

const QuizBuilder = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [allQuestions, setAllQuestions] = useState([]);
    const [filters, setFilters] = useState({ search: '', category: 'all', difficulty: 'all' });
    const [loading, setLoading] = useState(true);

    const fetchQuizAndQuestions = async () => {
        try {
            const [quizRes, questionsRes] = await Promise.all([
                getQuizById(quizId),
                getAllQuestions()
            ]);
            setQuiz(quizRes.data);
            setAllQuestions(questionsRes.data);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizAndQuestions();
    }, [quizId]);

    const handleAddQuestion = async (questionId) => {
        try {
            const { data: updatedQuiz } = await addQuestionToQuiz(quizId, questionId);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error("Failed to add question:", error);
            alert("Error: Could not add the question.");
        }
    };

    const handleRemoveQuestion = async (questionId) => {
        if (!questionId) {
            console.error("Attempted to remove a question with an undefined ID.");
            alert("Error: Cannot remove question due to an invalid ID.");
            return;
        }
        try {
            await removeQuestionFromQuiz(quizId, questionId);
            
            setQuiz(prevQuiz => ({
                ...prevQuiz,
                questions: prevQuiz.questions.filter(q => q.qid !== questionId)
            }));
        } catch (error) {
            console.error("Failed to remove question:", error);
            alert("Error: Could not remove the question. Please check the console.");
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const availableQuestions = useMemo(() => {
        // FIX: Create a set of IDs from the quiz questions, using the correct 'qid' property.
        const quizQuestionIds = new Set(quiz?.questions.map(q => q.qid));
        
        // Now, correctly filter the main 'allQuestions' list (which uses 'qId')
        return allQuestions
            .filter(q => !quizQuestionIds.has(q.qId))
            .filter(q => q.questionTitle.toLowerCase().includes(filters.search.toLowerCase()))
            .filter(q => filters.category === 'all' || q.category === filters.category)
            .filter(q => filters.difficulty === 'all' || q.difficultyLevel === filters.difficulty);
    }, [allQuestions, quiz, filters]);

    const categories = useMemo(() => [...new Set(allQuestions.map(q => q.category))], [allQuestions]);

    if (loading) return <p>Loading Quiz Builder...</p>;
    if (!quiz) return <p>Could not load quiz data.</p>;

    return (
        <>
            <h1>Quiz Builder: {quiz.quizTitle}</h1>
            <BuilderWrapper>
                <Column>
                    <ColumnTitle>Available Questions</ColumnTitle>
                    <FilterWrapper>
                        <Input name="search" placeholder="Search questions..." onChange={handleFilterChange} />
                        <Select name="category" onChange={handleFilterChange}>
                            <option value="all">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </Select>
                        <Select name="difficulty" onChange={handleFilterChange}>
                            <option value="all">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </Select>
                    </FilterWrapper>
                    {availableQuestions.map(q => (
                        <QuestionCard key={q.qId} layout>
                            <span>{q.questionTitle}</span>
                            <ActionButton color="secondary" onClick={() => handleAddQuestion(q.qId)}><FaPlus /></ActionButton>
                        </QuestionCard>
                    ))}
                </Column>

                <Column>
                    <ColumnTitle>Questions in this Quiz ({quiz.questions.length})</ColumnTitle>
                    {quiz.questions.map(q => (
                        <QuestionCard key={q.qid} layout>
                            <span>{q.questionTitle}</span>
                            <ActionButton color="danger" onClick={() => handleRemoveQuestion(q.qid)}><FaTrash /></ActionButton>
                        </QuestionCard>
                    ))}
                </Column>
            </BuilderWrapper>
        </>
    );
};

export default QuizBuilder;

