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
  height: 480px;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  margin: 0;
`;

export const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const LegendBadge = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
`;

export const LegendDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background-color: ${({ $color }) => $color};
`;

export const ChartArea = styled.div`
  width: 100%;
  flex: 1;
  min-height: 280px;
  position: relative;
  margin-top: 0.75rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`;

export const TooltipBox = styled.div`
  background-color: #1e293b;
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.825rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TooltipTitle = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 2px;
  border-bottom: 1px solid #334155;
  padding-bottom: 4px;
`;

export const TooltipTotal = styled.div`
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 2px;
`;

export const TooltipRow = styled.div<{ $color: string }>`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: ${({ $color }) => $color};
  font-weight: 500;
`;

