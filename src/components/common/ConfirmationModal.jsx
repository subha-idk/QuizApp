import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalBackdrop = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled(motion.div)`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    text-align: center;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
`;

const Button = styled.button`
    flex: 1;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    background-color: ${({ theme, primary }) => (primary ? theme.colors.primary : theme.colors.grayMedium)};
    color: ${({ theme, primary }) => (primary ? 'white' : theme.colors.text)};
`;

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <ModalBackdrop
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <ModalContent
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3>{title}</h3>
                        <p>{message}</p>
                        <ButtonWrapper>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button primary onClick={onConfirm}>Confirm</Button>
                        </ButtonWrapper>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
