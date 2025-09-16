import React from 'react';
import styled from 'styled-components';
import QuizList from '../components/user/QuizList';

const PageWrapper = styled.div`
  padding: 1rem;
  padding-top: 60px; /* Space for the role toggle button */
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.black};
`;

const UserPage = () => {
    return (
        <PageWrapper>
            <PageTitle>Available Quizzes</PageTitle>
            <QuizList />
        </PageWrapper>
    );
};

export default UserPage;
