import styled from 'styled-components';

export const TimelineCard = styled.div`
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

export const TimelineHeader = styled.div`
  margin-bottom: 1rem;
`;

export const TimelineTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
`;

export const TimelineSubtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 0.5rem;
  position: relative;

  /* Estilização da barra de rolagem */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
`;

export const NodeDot = styled.div<{ $tipo: 'ENTRADA' | 'SAIDA' }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${({ $tipo }) => ($tipo === 'ENTRADA' ? '#16a34a' : '#dc2626')};
  box-shadow: 0 0 0 3px ${({ $tipo }) => ($tipo === 'ENTRADA' ? '#dcfce7' : '#fee2e2')};
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

export const ItemName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemMethodBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #475569;
  background-color: #f1f5f9;
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
`;

export const ItemValue = styled.span<{ $tipo: 'ENTRADA' | 'SAIDA' }>`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ $tipo }) => ($tipo === 'ENTRADA' ? '#16a34a' : '#dc2626')};
  white-space: nowrap;
  margin-left: 0.75rem;
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

