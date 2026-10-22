import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { User } from '../../types/user';
import type {
  MovimentacaoComCategoria,
  FiltrosMovimentacoesDTO,
  AtualizarMovimentacaoDTO
} from '../../types/movimentacao';
import {
  listarMovimentacoes,
  atualizarMovimentacao,
  excluirMovimentacao
} from '../../services/movimentacao.service';
import Navbar from '../../components/Navbar';
import MovimentacaoList from '../../components/MovimentacaoList';
import MovimentacaoCards from '../../components/MovimentacaoCards';
import MovimentacoesFilters from '../../components/MovimentacoesFilters';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import MovimentacaoEditModal from '../../components/MovimentacaoEditModal';
import {
  PageContainer,
  PageHeader,
  TitleBox,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  ViewModeToggle,
  ToggleButton,
  ContentLayout,
  LoadingSpinner,
  EmptyStateWrapper,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  PrimaryActionBtn,
  LoadMoreContainer,
  LoadMoreButton
} from './styles';

export interface MovimentacoesPageProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function MovimentacoesPage({ user, onLogout }: MovimentacoesPageProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'cards' | 'list'>(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 768 ? 'list' : 'cards';
  });

  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoComCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosMovimentacoesDTO>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estados dos modais de Edição e Exclusão
  const [itemParaEditar, setItemParaEditar] = useState<MovimentacaoComCategoria | null>(null);
  const [itemParaExcluir, setItemParaExcluir] = useState<MovimentacaoComCategoria | null>(null);
  const [deleting, setDeleting] = useState(false);

  const carregarDados = async (novosFiltros: FiltrosMovimentacoesDTO = filtros, novaPagina = 1) => {
    try {
      if (novaPagina === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await listarMovimentacoes({
        ...novosFiltros,
        page: novaPagina,
        limit: 15
      });

      if (novaPagina === 1) {
        setMovimentacoes(res.items);
      } else {
        setMovimentacoes((prev) => [...prev, ...res.items]);
      }

      setHasMore(res.hasMore);
      setPage(novaPagina);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
      toast.error('Erro ao carregar movimentações.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    carregarDados(filtros, 1);
  }, []);

  const handleConfirmExcluir = async () => {
    if (!itemParaExcluir) return;

    try {
      setDeleting(true);
      await excluirMovimentacao(itemParaExcluir.id);
      setMovimentacoes((prev) => prev.filter((m) => m.id !== itemParaExcluir.id));
      toast.success('Movimentação excluída com sucesso!');
      setItemParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir movimentação:', error);
      toast.error('Não foi possível excluir a movimentação.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveEdicao = async (id: string, payload: AtualizarMovimentacaoDTO) => {
    const atualizada = await atualizarMovimentacao(id, payload);
    setMovimentacoes((prev) => prev.map((m) => (m.id === id ? atualizada : m)));
    toast.success('Movimentação atualizada com sucesso!');
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <PageContainer>
        <PageHeader>
          <TitleBox>
            <PageTitle>Histórico de Movimentações</PageTitle>
            <PageSubtitle>Consulte, filtre e gerencie seus lançamentos financeiros</PageSubtitle>
          </TitleBox>

          <HeaderActions>
            <ViewModeToggle>
              <ToggleButton
                $active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                title="Visualizar em formato de lista"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                Lista
              </ToggleButton>
              <ToggleButton
                $active={viewMode === 'cards'}
                onClick={() => setViewMode('cards')}
                title="Visualizar em formato de cards"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                Cards
              </ToggleButton>
            </ViewModeToggle>
          </HeaderActions>
        </PageHeader>

        <ContentLayout>
          <MovimentacoesFilters
            onAplicarFiltros={(novosFiltros) => {
              setFiltros(novosFiltros);
              carregarDados(novosFiltros, 1);
            }}
            loading={loading}
          />

          {loading ? (
            <LoadingSpinner>Carregando movimentações...</LoadingSpinner>
          ) : movimentacoes.length === 0 ? (
            <EmptyStateWrapper>
              <EmptyStateIcon>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </EmptyStateIcon>
              <EmptyStateTitle>
                {Object.keys(filtros).length > 0
                  ? 'Nenhuma movimentação encontrada para os filtros aplicados'
                  : 'Nenhuma movimentação encontrada'}
              </EmptyStateTitle>
              <EmptyStateText>
                {Object.keys(filtros).length > 0
                  ? 'Tente ajustar ou limpar os filtros para visualizar outros registros.'
                  : 'Você ainda não possui movimentações cadastradas. Cadastre sua primeira movimentação no formulário principal.'}
              </EmptyStateText>
              {Object.keys(filtros).length > 0 ? (
                <PrimaryActionBtn
                  onClick={() => {
                    setFiltros({});
                    carregarDados({}, 1);
                  }}
                >
                  Limpar Filtros e Ver Todas
                </PrimaryActionBtn>
              ) : (
                <PrimaryActionBtn onClick={() => navigate('/')}>
                  Cadastrar Nova Movimentação
                </PrimaryActionBtn>
              )}
            </EmptyStateWrapper>
          ) : (
            <>
              {viewMode === 'list' ? (
                <MovimentacaoList
                  movimentacoes={movimentacoes}
                  onEditar={(item) => setItemParaEditar(item)}
                  onExcluir={(item) => setItemParaExcluir(item)}
                />
              ) : (
                <MovimentacaoCards
                  movimentacoes={movimentacoes}
                  onEditar={(item) => setItemParaEditar(item)}
                  onExcluir={(item) => setItemParaExcluir(item)}
                />
              )}

              {hasMore && (
                <LoadMoreContainer>
                  <LoadMoreButton
                    onClick={() => carregarDados(filtros, page + 1)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Carregando mais...' : 'Carregar Mais Movimentações'}
                  </LoadMoreButton>
                </LoadMoreContainer>
              )}
            </>
          )}
        </ContentLayout>
      </PageContainer>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={Boolean(itemParaExcluir)}
        itemNome={itemParaExcluir?.nome}
        loading={deleting}
        onConfirm={handleConfirmExcluir}
        onCancel={() => setItemParaExcluir(null)}
      />

      {/* Modal de Edição de Movimentação */}
      <MovimentacaoEditModal
        isOpen={Boolean(itemParaEditar)}
        movimentacao={itemParaEditar}
        onSave={handleSaveEdicao}
        onClose={() => setItemParaEditar(null)}
      />
    </>
  );
}
