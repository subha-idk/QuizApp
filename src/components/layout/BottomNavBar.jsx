import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaClipboardList, FaPlusCircle, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../common/ConfirmationModal'; // Import the new modal

const NavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.grayMedium};
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
`;

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 12px;
  padding: 5px;
  transition: color 0.3s ease, transform 0.2s ease;

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }

  svg {
    font-size: 22px;
    margin-bottom: 4px;
  }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 12px;
    font-family: inherit;

    svg {
        font-size: 22px;
        margin-bottom: 4px;
    }
`;

const BottomNavBar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleConfirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
        navigate('/login');
    };

    if (location.pathname.startsWith('/quiz/')) {
        return null;
    }

    return (
        <>
            <NavWrapper>
                {user?.role === 'admin' ? (
                    <>
                        <NavItem to="/admin/questions"><FaClipboardList /> Questions</NavItem>
                        <NavItem to="/admin/quizzes"><FaPlusCircle /> Quizzes</NavItem>
                        <NavItem to="/admin/analysis"><FaChartBar /> Analysis</NavItem>
                        <NavItem to="/admin/profile"><FaUser /> Profile</NavItem>
                    </>
                ) : (
                    <>
                        <NavItem to="/user" end><FaHome /> Home</NavItem>
                        <NavItem to="/user/profile"><FaUser /> Profile</NavItem>
                    </>
                )}
                {/* This button now opens the modal instead of logging out directly */}
                <LogoutButton onClick={() => setIsLogoutModalOpen(true)}>
                    <FaSignOutAlt /> Logout
                </LogoutButton>
            </NavWrapper>

            {/* The confirmation modal component */}
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
            />
        </>
    );
};

export default BottomNavBar;
