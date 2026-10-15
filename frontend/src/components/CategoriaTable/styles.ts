import styled from 'styled-components';

export const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
`;

export const TableHeaderBox = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const CategoryBadge = styled.span`
  background-color: #eff6ff;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
`;

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const Thead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const Th = styled.th`
  padding: 0.85rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;

  &:last-child {
    text-align: right;
  }
`;

export const Tbody = styled.tbody`
  & tr:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export const Tr = styled.tr<{ $isEditing?: boolean }>`
  transition: background-color 0.15s ease-in-out;
  background-color: ${props => (props.$isEditing ? '#f8fafc' : 'transparent')};

  &:hover {
    background-color: ${props => (props.$isEditing ? '#f8fafc' : '#f9fafb')};
  }
`;

export const Td = styled.td`
  padding: 0.9rem 1.25rem;
  font-size: 0.925rem;
  color: #1f2937;
  vertical-align: middle;

  &:last-child {
    text-align: right;
  }
`;

export const InlineEditInput = styled.input`
  padding: 0.4rem 0.65rem;
  border-radius: 6px;
  border: 1px solid #3b82f6;
  font-size: 0.9rem;
  color: #111827;
  width: 100%;
  max-width: 250px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'save' | 'cancel' }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-in-out;
  color: ${props => {
    switch (props.$variant) {
      case 'delete':
        return '#ef4444';
      case 'save':
        return '#16a34a';
      case 'cancel':
        return '#6b7280';
      case 'edit':
      default:
        return '#3b82f6';
    }
  }};

  &:hover {
    background-color: ${props => {
      switch (props.$variant) {
        case 'delete':
          return '#fee2e2';
        case 'save':
          return '#dcfce7';
        case 'cancel':
          return '#f3f4f6';
        case 'edit':
        default:
          return '#dbeafe';
      }
    }};
  }
`;

export const EmptyStateWrapper = styled.div`
  padding: 2.5rem 1.5rem;
  text-align: center;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  p {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
  }

  span {
    font-size: 0.825rem;
    color: #9ca3af;
  }
`;

export const AlertBanner = styled.div`
  background-color: #fef2f2;
  color: #991b1b;
  border-bottom: 1px solid #fecaca;
  padding: 0.75rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CategoryNameSpan = styled.span`
  cursor: pointer;
  font-weight: 500;
  transition: color 0.15s ease-in-out;

  &:hover {
    color: #2563eb;
  }
`;

export const AlertCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #991b1b;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
