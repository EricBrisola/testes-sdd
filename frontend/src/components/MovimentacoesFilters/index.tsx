import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { Categoria } from '../../types/categoria';
import type {
  FiltrosMovimentacoesDTO,
  TipoMovimentacao,
  MetodoPagamento
} from '../../types/movimentacao';
import { listarCategorias } from '../../services/categoria.service';
import {
  FilterCard,
  FilterHeader,
  FilterTitle,
  ClearFilterButton,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  Select,
  DateInputsRow,
  DateInputWrapper,
  DateSubLabel,
  InputDate,
  CheckboxGroupWrapper,
  CheckboxList,
  CheckboxItem,
  FilterActions,
  ApplyButton
} from './styles';

export interface MovimentacoesFiltersProps {
  onAplicarFiltros: (filtros: FiltrosMovimentacoesDTO) => void;
  loading?: boolean;
}

export default function MovimentacoesFilters({
  onAplicarFiltros,
  loading = false
}: MovimentacoesFiltersProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [tipo, setTipo] = useState<TipoMovimentacao | ''>('');
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento | ''>('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await listarCategorias();
        setCategorias(data);
      } catch {
        // Silencioso ou tratado
      }
    };
    carregar();
  }, []);

  const obterDataHojeIso = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const handleCheckboxToggle = (catId: string) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleAplicar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let finalDataInicio = dataInicial.trim();
    let finalDataFim = dataFinal.trim();
    const hoje = obterDataHojeIso();

    // Regras de validação e fallback de datas
    if (finalDataInicio && !finalDataFim) {
      // Se apenas inicial informada, a final vira a data atual
      finalDataFim = hoje;
      if (finalDataInicio > finalDataFim) {
        toast.error('A data inicial não pode ser posterior à data de hoje.');
        return;
      }
    } else if (!finalDataInicio && finalDataFim) {
      // Se apenas final informada
      if (finalDataFim < hoje) {
        toast.error('A data final não pode ser anterior à data de hoje quando a data inicial não for informada.');
        return;
      }
      finalDataInicio = hoje;
    } else if (finalDataInicio && finalDataFim) {
      // Ambas informadas
      if (finalDataInicio > finalDataFim) {
        toast.error('A data inicial não pode ser posterior à data final.');
        return;
      }
    }

    const payload: FiltrosMovimentacoesDTO = {
      categorias: categoriasSelecionadas.length > 0 ? categoriasSelecionadas : undefined,
      tipo: tipo || undefined,
      metodoPagamento: metodoPagamento || undefined,
      dataInicial: finalDataInicio || undefined,
      dataFinal: finalDataFim || undefined
    };

    onAplicarFiltros(payload);
  };

  const handleLimpar = () => {
    setCategoriasSelecionadas([]);
    setTipo('');
    setMetodoPagamento('');
    setDataInicial('');
    setDataFinal('');
    onAplicarFiltros({});
  };

  return (
    <FilterCard as="form" onSubmit={handleAplicar}>
      <FilterHeader>
        <FilterTitle>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtros de Pesquisa
        </FilterTitle>

        <ClearFilterButton type="button" onClick={handleLimpar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Limpar Filtros
        </ClearFilterButton>
      </FilterHeader>

      <FilterGrid>
        {/* Filtro por Natureza (Entrada / Despesa) */}
        <FilterGroup>
          <FilterLabel htmlFor="filtro-natureza">Fluxo (Entrada ou Despesa)</FilterLabel>
          <Select
            id="filtro-natureza"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoMovimentacao | '')}
          >
            <option value="">Todas as Naturezas</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Despesa</option>
          </Select>
        </FilterGroup>

        {/* Filtro por Tipo de Movimentação (Método de Pagamento) */}
        <FilterGroup>
          <FilterLabel htmlFor="filtro-tipo">Tipo de Pagamento</FilterLabel>
          <Select
            id="filtro-tipo"
            value={metodoPagamento}
            onChange={(e) => setMetodoPagamento(e.target.value as MetodoPagamento | '')}
          >
            <option value="">Todos os Tipos</option>
            <option value="PIX">Pix</option>
            <option value="CARTAO">Cartão</option>
            <option value="DINHEIRO">Dinheiro</option>
          </Select>
        </FilterGroup>

        {/* Filtro por Período de Datas */}
        <FilterGroup>
          <FilterLabel>Período de Ocorrência</FilterLabel>
          <DateInputsRow>
            <DateInputWrapper>
              <DateSubLabel>Data Inicial</DateSubLabel>
              <InputDate
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </DateInputWrapper>
            <DateInputWrapper>
              <DateSubLabel>Data Final</DateSubLabel>
              <InputDate
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </DateInputWrapper>
          </DateInputsRow>
        </FilterGroup>

        {/* Filtro por Categorias (Checkboxes Múltiplos) */}
        {categorias.length > 0 && (
          <CheckboxGroupWrapper>
            <FilterLabel>Categorias (seleção única ou múltipla)</FilterLabel>
            <CheckboxList>
              {categorias.map((cat) => {
                const checked = categoriasSelecionadas.includes(cat.id);
                return (
                  <CheckboxItem key={cat.id} className={checked ? 'checked' : ''}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle(cat.id)}
                    />
                    {cat.nome}
                  </CheckboxItem>
                );
              })}
            </CheckboxList>
          </CheckboxGroupWrapper>
        )}
      </FilterGrid>

      <FilterActions>
        <ApplyButton type="submit" disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {loading ? 'Filtrando...' : 'Aplicar Filtros'}
        </ApplyButton>
      </FilterActions>
    </FilterCard>
  );
}
