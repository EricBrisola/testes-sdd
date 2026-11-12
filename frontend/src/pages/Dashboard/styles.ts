import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
`;

export const DashboardContent = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.25rem;
  }
`;

export const SectionHeader = styled.section`
  width: 100%;
`;

export const MiddleSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FilterBarWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

export const MiddleChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

export const BottomChartsRow = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

export const ErrorCard = styled.div`
  background-color: #fee2e2;
  border: 1px solid #f87171;
  color: #b91c1c;
  padding: 1.25rem;
  border-radius: 12px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 2rem auto;
  max-width: 600px;
`;
