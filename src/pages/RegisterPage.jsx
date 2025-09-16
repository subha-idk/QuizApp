import React, { useState } from 'react';
import { registerUser } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

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
    flex-direction: column-reverse; /* Form on top on mobile */
  }
`;

const BrandPanel = styled.div`
  flex: 1;
  background: linear-gradient(45deg, ${({ theme }) => theme.colors.secondary}, #28a745);
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
  background-color: ${({ theme }) => theme.colors.secondary};
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

const RegisterPage = () => {
    const [userData, setUserData] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // The `userData` object sent here does not contain a role.
            // The backend will assign the default "USER" role.
            await registerUser(userData);
            navigate('/login'); // Redirect to login page on successful registration
        } catch (err) {
            setError('Registration failed. Username or email may already be taken.');
            console.error(err);
        }
    };

    return (
        <AuthPageWrapper>
            <AuthCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <FormPanel>
                    <Form onSubmit={handleSubmit}>
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Join the Challenge</h2>
                        <InputWrapper>
                            <InputIcon><FaUser /></InputIcon>
                            <Input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                        </InputWrapper>
                        <InputWrapper>
                            <InputIcon><FaEnvelope /></InputIcon>
                            <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        </InputWrapper>
                        <InputWrapper>
                            <InputIcon><FaLock /></InputIcon>
                            <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        </InputWrapper>
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        <Button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create Account</Button>
                        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                            Already have an account? <Link to="/login">Log In</Link>
                        </p>
                    </Form>
                </FormPanel>
                <BrandPanel>
                    <AppTitle>ThinkFast</AppTitle>
                    <Tagline>Where Every Second Counts!</Tagline>
                </BrandPanel>
            </AuthCard>
        </AuthPageWrapper>
    );
};

export default RegisterPage;
