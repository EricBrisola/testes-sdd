import styled from 'styled-components';

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const Card = styled.div`
  background-color: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const CardNome = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  word-break: break-word;
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
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  background-color: ${(props) => (props.$tipo === 'ENTRADA' ? '#dcfce7' : '#fee2e2')};
  color: ${(props) => (props.$tipo === 'ENTRADA' ? '#15803d' : '#b91c1c')};
  flex-shrink: 0;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export interface ValorProps {
  $tipo: 'ENTRADA' | 'SAIDA';
}

export const CardValor = styled.span<ValorProps>`
  font-size: 1.45rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: ${(props) => (props.$tipo === 'ENTRADA' ? '#16a34a' : '#dc2626')};
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
`;

export const CardActionButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.45rem;
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
