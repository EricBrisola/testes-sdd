import { SelectWrapper, StyledSelect, Label, ErrorText } from './styles';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, error, options, ...props }: SelectProps) {
  return (
    <SelectWrapper>
      <Label>{label}</Label>
      <StyledSelect $hasError={!!error} {...props}>
        <option value="" disabled hidden>Selecione uma opção</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </StyledSelect>
      {error && <ErrorText>{error}</ErrorText>}
    </SelectWrapper>
  );
}
