import styled from 'styled-components';

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  max-width: 440px;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  box-sizing: border-box;
  animation: fadeIn 0.15s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const WarningIconWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #fee2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

export const ModalMessage = styled.p`
  font-size: 0.925rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;

  strong {
    color: #1e293b;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #f8fafc;
    color: #0f172a;
  }
`;

export const ConfirmButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: none;
  background-color: #dc2626;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #b91c1c;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
