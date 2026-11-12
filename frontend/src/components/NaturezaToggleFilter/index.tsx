import { ToggleContainer, ToggleButton } from './styles';

export interface NaturezaToggleFilterProps {
  natureza: 'SAIDA' | 'ENTRADA';
  onChange: (novaNatureza: 'SAIDA' | 'ENTRADA') => void;
}

export default function NaturezaToggleFilter({
  natureza,
  onChange
}: NaturezaToggleFilterProps) {
  return (
    <ToggleContainer data-testid="natureza-toggle-filter">
      <ToggleButton
        type="button"
        $active={natureza === 'SAIDA'}
        $natureza="SAIDA"
        onClick={() => onChange('SAIDA')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
        Despesas
      </ToggleButton>

      <ToggleButton
        type="button"
        $active={natureza === 'ENTRADA'}
        $natureza="ENTRADA"
        onClick={() => onChange('ENTRADA')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
        Receitas
      </ToggleButton>
    </ToggleContainer>
  );
}

