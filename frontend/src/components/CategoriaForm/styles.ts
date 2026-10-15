import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: #ffffff;
  padding: 1.75rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 1.25rem;
    gap: 1rem;
  }
`;

export const FormTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  text-align: left;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

export const StyledInput = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => (props.$hasError ? '#ef4444' : '#d1d5db')};
  background-color: #f9fafb;
  font-size: 1rem;
  color: #111827;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  width: 100%;

  &:focus {
    outline: none;
    background-color: #ffffff;
    border-color: ${props => (props.$hasError ? '#ef4444' : '#2563eb')};
    box-shadow: 0 0 0 3px ${props => (props.$hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)')};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const ErrorText = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
  font-weight: 500;
`;

export const Button = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background-color: #1d4ed8;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const SuccessMessage = styled.div`
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const GeneralErrorMessage = styled.div`
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
`;
