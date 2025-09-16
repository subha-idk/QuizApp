import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import QuestionManagement from '../components/admin/QuestionManagement';
import QuizManagement from '../components/admin/QuizManagement';
import QuizBuilder from '../components/admin/QuizBuilder'; // Import the new component
import UserProfilePage from './UserProfilePage';

const PageWrapper = styled.div`
  padding: 1rem;
  padding-top: 60px;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.black};
`;

const AnalysisPage = () => (
    <>
        <PageTitle>Analysis</PageTitle>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', textAlign: 'center' }}>
            <h2>Coming Soon</h2>
            <p>This feature is currently under development.</p>
        </div>
    </>
);

const AdminPage = () => {
    return (
        <PageWrapper>
            <Routes>
                <Route index element={<Navigate replace to="questions" />} />
                <Route path="questions" element={<QuestionManagement />} />
                <Route path="quizzes" element={<QuizManagement />} />
                {/* Add the new route for the builder */}
                <Route path="quiz-builder/:quizId" element={<QuizBuilder />} />
                <Route path="analysis" element={<AnalysisPage />} />
                <Route path="profile" element={<UserProfilePage />} />
            </Routes>
        </PageWrapper>
    );
};

export default AdminPage;
