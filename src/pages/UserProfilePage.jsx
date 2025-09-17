import React from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

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

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Username = styled.h2`
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    text-transform: capitalize;
`;

const RoleBadge = styled.span`
    background-color: ${({ theme, role }) => (role === 'admin' ? theme.colors.primary : theme.colors.secondary)};
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
`;

const UserProfilePage = () => {
    // Get the current user from the AuthContext
    const { user } = useAuth();

    // Render nothing if the user data is not yet available
    if (!user) {
        return null;
    }

    return (
        <PageWrapper>
            <PageTitle>Profile</PageTitle>
            <ProfileCard>
                <FaUserCircle size={80} style={{ color: '#ccc', marginBottom: '1rem' }} />
                <Username>{user.username}</Username>
                <RoleBadge role={user.role}>{user.role}</RoleBadge>
                <p style={{ marginTop: '1.5rem', color: '#888' }}>
                    Profile editing features will be available in a future version.
                </p>
            </ProfileCard>
        </PageWrapper>
    );
};

export default UserProfilePage;
