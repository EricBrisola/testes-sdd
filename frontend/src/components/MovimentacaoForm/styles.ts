import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
`;

export const FormTitle = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 0.5rem;
`;

export const Row = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const CategoryRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`;

export const CategoryEmptyLink = styled(Link)`
  font-size: 0.8rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.div`
  background-color: #dcfce7;
  color: #166534;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
`;
