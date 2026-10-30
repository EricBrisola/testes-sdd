import styled from 'styled-components';

export const ToggleContainer = styled.div`
  display: inline-flex;
  background-color: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  border: 1px solid #e2e8f0;
  gap: 4px;
`;

export const ToggleButton = styled.button<{ $active: boolean; $natureza: 'SAIDA' | 'ENTRADA' }>`
  border: none;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 6px;

  background-color: ${({ $active, $natureza }) => {
    if (!$active) return 'transparent';
    return $natureza === 'SAIDA' ? '#fee2e2' : '#dcfce7';
  }};

  color: ${({ $active, $natureza }) => {
    if (!$active) return '#64748b';
    return $natureza === 'SAIDA' ? '#b91c1c' : '#15803d';
  }};

  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none')};

  &:hover {
    color: ${({ $active, $natureza }) => {
      if ($active) return $natureza === 'SAIDA' ? '#b91c1c' : '#15803d';
      return '#0f172a';
    }};
  }
`;

