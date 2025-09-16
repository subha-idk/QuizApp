import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllQuestions, addQuestion, updateQuestion, deleteQuestion } from '../../api/api';

// --- Styled Components (no changes here) ---
const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.black};
`;
const AddButton = styled(motion.button)`
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  background-color: ${({ theme }) => theme.colors.primary}; color: white;
  border: none; border-radius: 8px; padding: 0.8rem 1.5rem;
  font-size: 1rem; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; width: 100%;
`;
const QuestionItem = styled(motion.div)`
  background: white; padding: 1rem 1.5rem; border-radius: 8px;
  margin-bottom: 1rem; box-shadow: ${({ theme }) => theme.shadows.soft};
  display: flex; justify-content: space-between; align-items: center;
`;
const ActionButtons = styled.div`display: flex; gap: 1rem;`;
const IconButton = styled.button`
  background: none; border: none; cursor: pointer; font-size: 1.2rem;
  color: ${({ theme, variant }) => theme.colors[variant] || theme.colors.grayDark};
  padding: 0.5rem;
`;
const ErrorMessage = styled.p`
    color: ${({ theme }) => theme.colors.danger}; text-align: center;
    background-color: #ff3b3020; padding: 1rem; border-radius: 8px;
`;
const ModalBackdrop = styled(motion.div)`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6); display: flex;
    align-items: center; justify-content: center; z-index: 1000;
`;
const ModalContent = styled(motion.div)`
    background: white; padding: 2rem; border-radius: 12px;
    width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;
`;
const Input = styled.input`
  width: 100%; padding: 0.8rem 1rem; margin-bottom: 1rem;
  border-radius: 8px; border: 1px solid #ccc;
`;
const Select = styled.select`
  width: 100%; padding: 0.8rem 1rem; margin-bottom: 1rem;
  border-radius: 8px; border: 1px solid #ccc;
`;
const SaveButton = styled.button`
  width: 100%; padding: 1rem; background-color: ${({ theme }) => theme.colors.primary};
  color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer;
`;

const QuestionModal = ({ isOpen, onClose, onSave, question }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (question) {
            setFormData({
                questionTitle: question.questionTitle || '', option1: question.option1 || '',
                option2: question.option2 || '', option3: question.option3 || '',
                option4: question.option4 || '', correctAnswer: question.correctAnswer || '',
                category: question.category || '', difficultyLevel: question.difficultyLevel || 'Medium',
            });
        } else {
            setFormData({
                questionTitle: '', option1: '', option2: '', option3: '', option4: '',
                correctAnswer: '', category: '', difficultyLevel: 'Medium'
            });
        }
    }, [question, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
    };
    
    // UX IMPROVEMENT: Dynamically create a list of valid options for the dropdown
    const validOptions = useMemo(() => {
        return [formData.option1, formData.option2, formData.option3, formData.option4]
            .filter(opt => opt && opt.trim() !== ''); // Filter out empty options
    }, [formData.option1, formData.option2, formData.option3, formData.option4]);

    return (
        <AnimatePresence>
            {isOpen && (
                <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
                    <ModalContent onClick={(e) => e.stopPropagation()} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                        <h2>{question ? 'Edit Question' : 'Add New Question'}</h2>
                        <Input name="questionTitle" value={formData.questionTitle} onChange={handleChange} placeholder="Question Title" />
                        <Input name="option1" value={formData.option1} onChange={handleChange} placeholder="Option 1" />
                        <Input name="option2" value={formData.option2} onChange={handleChange} placeholder="Option 2" />
                        <Input name="option3" value={formData.option3} onChange={handleChange} placeholder="Option 3" />
                        <Input name="option4" value={formData.option4} onChange={handleChange} placeholder="Option 4" />
                        
                        {/* UX IMPROVEMENT: Use a dropdown for the correct answer */}
                        <label>Correct Answer</label>
                        <Select name="correctAnswer" value={formData.correctAnswer} onChange={handleChange}>
                            <option value="">Select the correct answer</option>
                            {validOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </Select>

                        <Input name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., Java)" />
                        <label>Difficulty Level</label>
                        <Select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleChange}>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </Select>
                        <SaveButton onClick={handleSave}>Save Question</SaveButton>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </AnimatePresence>
    );
};

// --- Main Component (no changes here) ---
const QuestionManagement = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getAllQuestions();
            setQuestions(data);
        } catch (err) {
            setError('Failed to fetch questions. Please ensure the backend server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleOpenModal = (question = null) => {
        setEditingQuestion(question);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
    };

    const handleSaveQuestion = async (questionData) => {
        try {
            if (editingQuestion) {
                await updateQuestion(editingQuestion.qId, questionData);
            } else {
                await addQuestion(questionData);
            }
            fetchQuestions();
            handleCloseModal();
        } catch (err) {
            console.error("Failed to save question:", err);
            alert('Could not save the question. Please check the console for errors.');
        }
    };

    const handleDelete = async (qId) => {
        if (!qId) {
            alert('Cannot delete question: Invalid ID.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this question permanently?')) {
            try {
                await deleteQuestion(qId);
                fetchQuestions();
            } catch (err) {
                console.error("Failed to delete question:", err);
                alert('Could not delete the question.');
            }
        }
    };

    return (
        <>
            <PageTitle>Question Management</PageTitle>
            <AddButton onClick={() => handleOpenModal()} whileTap={{ scale: 0.95 }}>
                <FaPlusCircle /> Add New Question
            </AddButton>
            {loading && <p>Loading questions...</p>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {!loading && !error && (
                questions.map(q => (
                    <QuestionItem key={q.qId} layout>
                        <div>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{q.questionTitle}</p>
                            <small style={{ color: '#888' }}>{q.category} - {q.difficultyLevel}</small>
                        </div>
                        <ActionButtons>
                            <IconButton variant="primary" onClick={() => handleOpenModal(q)}><FaEdit /></IconButton>
                            <IconButton variant="danger" onClick={() => handleDelete(q.qId)}><FaTrash /></IconButton>
                        </ActionButtons>
                    </QuestionItem>
                ))
            )}
            <QuestionModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveQuestion} question={editingQuestion} />
        </>
    );
};

export default QuestionManagement;
