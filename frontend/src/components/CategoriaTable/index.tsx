import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Categoria } from '../../types/categoria';
import {
  TableContainer,
  TableHeaderBox,
  TableTitle,
  CategoryBadge,
  TableScroll,
  StyledTable,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  InlineEditInput,
  ActionsContainer,
  ActionButton,
  EmptyStateWrapper,
  AlertBanner,
  CategoryNameSpan,
  AlertCloseButton
} from './styles';

export interface CategoriaTableProps {
  categorias: Categoria[];
  loading?: boolean;
  onEditar?: (id: string, novoNome: string) => Promise<void>;
  onExcluir?: (id: string) => Promise<void>;
  errorMessage?: string;
  onClearError?: () => void;
}

export default function CategoriaTable({
  categorias,
  loading = false,
  onEditar,
  onExcluir,
  errorMessage,
  onClearError
}: CategoriaTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const startEdit = (cat: Categoria) => {
    setEditingId(cat.id);
    setEditingName(cat.nome);
    if (onClearError) onClearError();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async (id: string) => {
    if (!onEditar) return;
    const trimmed = editingName.trim();
    if (!trimmed) return;

    setActionLoadingId(id);
    try {
      await onEditar(id, trimmed);
      setEditingId(null);
      setEditingName('');
    } catch {
      // O erro é tratado na página/service
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit(id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const handleDelete = async (id: string) => {
    if (!onExcluir) return;
    if (onClearError) onClearError();

    setActionLoadingId(id);
    try {
      await onExcluir(id);
    } catch {
      // O erro de conflito ou exclusão é tratado na página/service
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <TableContainer>
      <TableHeaderBox>
        <TableTitle>Categorias Cadastradas</TableTitle>
        <CategoryBadge>{categorias.length} {categorias.length === 1 ? 'categoria' : 'categorias'}</CategoryBadge>
      </TableHeaderBox>

      {errorMessage && (
        <AlertBanner>
          <span>{errorMessage}</span>
          {onClearError && (
            <AlertCloseButton onClick={onClearError} aria-label="Fechar aviso">
              ✕
            </AlertCloseButton>
          )}
        </AlertBanner>
      )}

      {loading ? (
        <EmptyStateWrapper>
          <p>Carregando categorias...</p>
        </EmptyStateWrapper>
      ) : categorias.length === 0 ? (
        <EmptyStateWrapper>
          <p>Nenhuma categoria cadastrada ainda</p>
          <span>Cadastre sua primeira categoria usando o formulário acima.</span>
        </EmptyStateWrapper>
      ) : (
        <TableScroll>
          <StyledTable>
            <Thead>
              <tr>
                <Th>Nome</Th>
                <Th>Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {categorias.map((categoria) => {
                const isEditing = editingId === categoria.id;
                const isBusy = actionLoadingId === categoria.id;

                return (
                  <Tr key={categoria.id} $isEditing={isEditing}>
                    <Td>
                      {isEditing ? (
                        <InlineEditInput
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, categoria.id)}
                          autoFocus
                          disabled={isBusy}
                          aria-label={`Editar nome da categoria ${categoria.nome}`}
                        />
                      ) : (
                        <CategoryNameSpan onClick={() => startEdit(categoria)}>
                          {categoria.nome}
                        </CategoryNameSpan>
                      )}
                    </Td>
                    <Td>
                      <ActionsContainer>
                        {isEditing ? (
                          <>
                            <ActionButton
                              $variant="save"
                              onClick={() => saveEdit(categoria.id)}
                              disabled={isBusy || !editingName.trim()}
                              title="Salvar alteração (Enter)"
                              aria-label="Salvar alteração"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </ActionButton>
                            <ActionButton
                              $variant="cancel"
                              onClick={cancelEdit}
                              disabled={isBusy}
                              title="Cancelar edição (Esc)"
                              aria-label="Cancelar edição"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </ActionButton>
                          </>
                        ) : (
                          <>
                            <ActionButton
                              $variant="edit"
                              onClick={() => startEdit(categoria)}
                              disabled={isBusy}
                              title="Editar categoria"
                              aria-label={`Editar categoria ${categoria.nome}`}
                            >
                              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </ActionButton>
                            <ActionButton
                              $variant="delete"
                              onClick={() => handleDelete(categoria.id)}
                              disabled={isBusy}
                              title="Excluir categoria"
                              aria-label={`Excluir categoria ${categoria.nome}`}
                            >
                              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </ActionButton>
                          </>
                        )}
                      </ActionsContainer>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </StyledTable>
        </TableScroll>
      )}
    </TableContainer>
  );
}
