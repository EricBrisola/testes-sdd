import styled from 'styled-components';

export const ListContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const TableHead = styled.thead`
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease-in-out;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 0.95rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  white-space: nowrap;
`;

export const TableCell = styled.td`
  padding: 1rem 1.25rem;
  font-size: 0.925rem;
  color: #1e293b;
  vertical-align: middle;
  white-space: nowrap;
`;

export const ItemName = styled.span`
  font-weight: 600;
  color: #0f172a;
`;

export interface ValorProps {
  $tipo: 'ENTRADA' | 'SAIDA';
}

export const ItemValor = styled.span<ValorProps>`
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${(props) => (props.$tipo === 'ENTRADA' ? '#16a34a' : '#dc2626')};
`;

export interface NaturezaBadgeProps {
  $tipo: 'ENTRADA' | 'SAIDA';
}

export const NaturezaBadge = styled.span<NaturezaBadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.775rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  background-color: ${(props) => (props.$tipo === 'ENTRADA' ? '#dcfce7' : '#fee2e2')};
  color: ${(props) => (props.$tipo === 'ENTRADA' ? '#15803d' : '#b91c1c')};
`;

export const MetodoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  background-color: #f1f5f9;
  color: #475569;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const CategoriaTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  background-color: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  font-size: 0.825rem;
  font-weight: 600;
`;

export const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.4rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  &.edit:hover {
    color: #2563eb;
    background-color: #eff6ff;
  }

  &.delete:hover {
    color: #dc2626;
    background-color: #fee2e2;
  }
`;
