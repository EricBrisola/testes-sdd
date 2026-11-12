import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

export const SkeletonWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  box-sizing: border-box;
`;

export const SkeletonHeader = styled.div`
  width: 100%;
  height: 140px;
  background-color: #e5e7eb;
  border-radius: 12px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SkeletonBox = styled.div`
  width: 100%;
  height: 340px;
  background-color: #e5e7eb;
  border-radius: 12px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

