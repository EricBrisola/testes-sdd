import styled from 'styled-components';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 1.25rem 0.75rem;
    gap: 1.5rem;
  }
`;

export const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.85rem;
  font-weight: 800;
  color: #111827;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
`;
