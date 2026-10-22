import { useState, useEffect } from 'react';
import type {
  MovimentacaoComCategoria,
  AtualizarMovimentacaoDTO,
  TipoMovimentacao,
  MetodoPagamento
} from '../../types/movimentacao';
import type { Categoria } from '../../types/categoria';
import { listarCategorias } from '../../services/categoria.service';
import {
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalForm,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormRow,
  ModalFooter,
  CancelBtn,
  SaveBtn
} from './styles';

export interface MovimentacaoEditModalProps {
  isOpen: boolean;
  movimentacao: MovimentacaoComCategoria | null;
  onSave: (id: string, payload: AtualizarMovimentacaoDTO) => Promise<void>;
  onClose: () => void;
}

export default function MovimentacaoEditModal({
  isOpen,
  movimentacao,
  onSave,
  onClose
}: MovimentacaoEditModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState<string | number>('');
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState<TipoMovimentacao>('SAIDA');
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>('PIX');
  const [categoriaId, setCategoriaId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const dataCats = await listarCategorias();
        setCategorias(dataCats);
      } catch (err) {
        console.error('Erro ao carregar categorias no modal:', err);
      }
    };
    if (isOpen) {
      carregarCategorias();
    }
  }, [isOpen]);

  useEffect(() => {
    if (movimentacao) {
      setNome(movimentacao.nome);
      setValor(movimentacao.valor);
      // Extrair formato YYYY-MM-DD
      const dataStr = typeof movimentacao.data === 'string'
        ? movimentacao.data.split('T')[0]
        : new Date(movimentacao.data).toISOString().split('T')[0];
      setData(dataStr);
      setTipo(movimentacao.tipo);
      setMetodoPagamento(movimentacao.metodoPagamento);
      setCategoriaId(movimentacao.categoriaId);
      setError('');
    }
  }, [movimentacao]);

  if (!isOpen || !movimentacao) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nomeFormatado = nome.trim();
    if (!nomeFormatado) {
      setError('O nome é obrigatório.');
      return;
    }

    const numValor = Number(valor);
    if (isNaN(numValor) || numValor <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }

    if (!data) {
      setError('A data é obrigatória.');
      return;
    }

    if (!categoriaId) {
      setError('A categoria é obrigatória.');
      return;
    }

    try {
      setSaving(true);
      await onSave(movimentacao.id, {
        nome: nomeFormatado,
        valor: numValor,
        data,
        tipo,
        metodoPagamento,
        categoriaId
      });
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Erro ao atualizar movimentação.');
      } else {
        setError('Erro ao atualizar movimentação.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Editar Movimentação</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Fechar modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <FormGroup>
            <FormLabel htmlFor="edit-nome">Nome da Movimentação</FormLabel>
            <FormInput
              id="edit-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="edit-valor">Valor (R$)</FormLabel>
              <FormInput
                id="edit-valor"
                type="number"
                step="0.01"
                min="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="edit-data">Data</FormLabel>
              <FormInput
                id="edit-data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="edit-tipo">Fluxo</FormLabel>
              <FormSelect
                id="edit-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMovimentacao)}
              >
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Despesa</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="edit-metodo">Forma de Pagamento</FormLabel>
              <FormSelect
                id="edit-metodo"
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value as MetodoPagamento)}
              >
                <option value="PIX">Pix</option>
                <option value="CARTAO">Cartão</option>
                <option value="DINHEIRO">Dinheiro</option>
              </FormSelect>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel htmlFor="edit-categoria">Categoria</FormLabel>
            <FormSelect
              id="edit-categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <ModalFooter>
            <CancelBtn type="button" onClick={onClose} disabled={saving}>
              Cancelar
            </CancelBtn>
            <SaveBtn type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </SaveBtn>
          </ModalFooter>
        </ModalForm>
      </ModalContainer>
    </ModalBackdrop>
  );
}
