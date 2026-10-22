import styled from 'styled-components';

export const FilterCard = styled.div`
  background-color: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 1.25rem 1rem;
    gap: 1rem;
  }
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.85rem;
`;

export const FilterTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;

  svg {
    color: #2563eb;
  }
`;

export const ClearFilterButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: #ef4444;
    background-color: #fee2e2;
  }
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  align-items: flex-start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FilterLabel = styled.label`
  font-size: 0.825rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #475569;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  color: #1e293b;
  font-size: 0.9rem;
  font-weight: 500;
  outline: none;
  transition: all 0.15s ease-in-out;
  cursor: pointer;

  &:focus {
    border-color: #2563eb;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

export const DateInputsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DateSubLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
`;

export const InputDate = styled.input`
  width: 100%;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  color: #1e293b;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.15s ease-in-out;
  box-sizing: border-box;

  &:focus {
    border-color: #2563eb;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

export const CheckboxGroupWrapper = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 1rem;
`;

export const CheckboxList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

export const CheckboxItem = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease-in-out;

  &:hover {
    border-color: #94a3b8;
    background-color: #f8fafc;
  }

  input[type='checkbox'] {
    cursor: pointer;
    width: 16px;
    height: 16px;
    accent-color: #2563eb;
  }

  &.checked {
    border-color: #93c5fd;
    background-color: #eff6ff;
    color: #1e40af;
    font-weight: 600;
  }
`;

export const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ApplyButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: #1d4ed8;
  }
`;
