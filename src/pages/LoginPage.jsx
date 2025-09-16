import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';

const AuthPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const AuthCard = styled(motion.div)`
  display: flex;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 900px;
  min-height: 550px;
  overflow: hidden;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BrandPanel = styled.div`
  flex: 1;
  background: linear-gradient(45deg, ${({ theme }) => theme.colors.primary}, #0056b3);
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const FormPanel = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AppTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const Form = styled.form`
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
`;

const Divider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    color: #aaa;
    margin: 1.5rem 0;
    &::before, &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #ddd;
    }
    &:not(:empty)::before {
        margin-right: .25em;
    }
    &:not(:empty)::after {
        margin-left: .25em;
    }
`;

const OAuthButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.8rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    cursor: pointer;
    text-decoration: none;
    color: #333;
    font-weight: 500;
    margin-bottom: 0.75rem;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f5f5f5;
    }
`;


const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const loggedInUser = await login(credentials);
            if (loggedInUser.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (err) {
            setError('Invalid username or password.');
            console.error(err);
        }
    };

    return (
        <AuthPageWrapper>
            <AuthCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <BrandPanel>
                    <AppTitle>ThinkFast</AppTitle>
                    <Tagline>Where Every Second Counts!</Tagline>
                </BrandPanel>
                <FormPanel>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back!</h2>
                    <OAuthButton href="http://localhost:8080/oauth2/authorization/google">
                        <FaGoogle /> Sign in with Google
                    </OAuthButton>
                    <OAuthButton href="http://localhost:8080/oauth2/authorization/github">
                        <FaGithub /> Sign in with GitHub
                    </OAuthButton>
                    <Divider>OR</Divider>
                    <Form onSubmit={handleSubmit}>
                        <InputWrapper>
                            <InputIcon><FaUser /></InputIcon>
                            <Input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                        </InputWrapper>
                        <InputWrapper>
                            <InputIcon><FaLock /></InputIcon>
                            <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        </InputWrapper>
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        <Button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Log In</Button>
                        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                            Don't have an account? <Link to="/register">Sign Up</Link>
                        </p>
                    </Form>
                </FormPanel>
            </AuthCard>
        </AuthPageWrapper>
    );
};

export default LoginPage;
