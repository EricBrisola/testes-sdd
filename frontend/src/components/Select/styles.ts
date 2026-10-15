import styled from 'styled-components';

export const SelectWrapper = styled.div`
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

export const StyledSelect = styled.select<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => (props.$hasError ? '#ef4444' : '#d1d5db')};
  background-color: #fff;
  font-size: 1rem;
  color: #1f2937;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: ${props => (props.$hasError ? '#ef4444' : '#3b82f6')};
    box-shadow: 0 0 0 3px ${props => (props.$hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)')};
  }
`;

export const ErrorText = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
`;
