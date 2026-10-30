import styled from 'styled-components';

export const ChartCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  padding: 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 380px;
`;

export const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
`;

export const ChartSubtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 1rem 0;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 140px;
  margin: auto 0;
`;

export const MethodsDetailList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const MethodDetailItem = styled.div<{ $color: string }>`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const MethodName = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
`;

export const MethodValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`;

export const MethodPercent = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
`;

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`;

export const TooltipBox = styled.div`
  background-color: #1e293b;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.825rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const TooltipTitle = styled.div`
  font-weight: 600;
  margin-bottom: 2px;
`;

export const TooltipValue = styled.div`
  color: #cbd5e1;
`;

export const TooltipItemWrapper = styled.div<{ $hasMarginBottom: boolean }>`
  margin-bottom: ${({ $hasMarginBottom }) => ($hasMarginBottom ? '4px' : '0')};
`;
