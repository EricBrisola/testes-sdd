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
  height: 250px;
  position: relative;
`;

export const LegendList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
  justify-content: center;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #334155;
  font-weight: 500;
`;

export const ColorDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
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
