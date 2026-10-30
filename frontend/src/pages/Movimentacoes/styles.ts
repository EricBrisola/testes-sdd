import styled from 'styled-components';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PageContainer = styled.main`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 1.25rem 1rem 3rem;
  }
`;

export const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
`;

export const ViewModeToggle = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.25rem;
  gap: 0.25rem;
`;

export interface ToggleButtonProps {
  $active: boolean;
}

export const ToggleButton = styled.button<ToggleButtonProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  background-color: ${(props) => (props.$active ? '#ffffff' : 'transparent')};
  color: ${(props) => (props.$active ? '#2563eb' : '#64748b')};
  box-shadow: ${(props) => (props.$active ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none')};

  &:hover {
    color: ${(props) => (props.$active ? '#2563eb' : '#0f172a')};
  }

  svg {
    stroke-width: 2.2;
  }
`;

export const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3.5rem 1.5rem;
  background-color: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  gap: 1rem;
`;

export const EmptyStateIcon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const EmptyStateText = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  max-width: 420px;
  margin: 0;
`;

export const PrimaryActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  margin-top: 0.5rem;

  &:hover {
    background-color: #1d4ed8;
  }
`;

export const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

export const LoadMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-size: 0.925rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover:not(:disabled) {
    background-color: #eff6ff;
    border-color: #93c5fd;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
`;
