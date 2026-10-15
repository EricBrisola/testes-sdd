import styled from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
`;

export const StyledInput = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => (props.$hasError ? '#ef4444' : '#d1d5db')};
  background-color: #fff;
  font-size: 1rem;
  color: #1f2937;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${props => (props.$hasError ? '#ef4444' : '#3b82f6')};
    box-shadow: 0 0 0 3px ${props => (props.$hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)')};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const ErrorText = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
`;
