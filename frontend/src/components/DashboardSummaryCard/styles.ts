import styled from 'styled-components';

export const SummaryCardContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 1.25rem;
  }
`;

export const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const SummaryLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SummaryValue = styled.span<{ $variant?: 'entrada' | 'saida' | 'saldoPositivo' | 'saldoNegativo' }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ $variant }) => {
    switch ($variant) {
      case 'entrada':
        return '#16a34a';
      case 'saida':
        return '#dc2626';
      case 'saldoPositivo':
        return '#2563eb';
      case 'saldoNegativo':
        return '#dc2626';
      default:
        return '#0f172a';
    }
  }};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const StatusPill = styled.span<{ $isPositive: boolean }>`
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  background-color: ${({ $isPositive }) => ($isPositive ? '#dcfce7' : '#fee2e2')};
  color: ${({ $isPositive }) => ($isPositive ? '#15803d' : '#b91c1c')};
  margin-left: 0.5rem;
`;

