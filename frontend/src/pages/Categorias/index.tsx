import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarCategorias, atualizarCategoria, excluirCategoria } from '../../services/categoria.service';
import type { Categoria } from '../../types/categoria';
import type { User } from '../../types/user';
import Navbar from '../../components/Navbar';
import CategoriaForm from '../../components/CategoriaForm';
import CategoriaTable from '../../components/CategoriaTable';
import {
  PageWrapper,
  PageContainer,
  PageHeader,
  TitleBox,
  PageTitle,
  PageSubtitle,
  BackButton
} from './styles';

export interface CategoriasPageProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function CategoriasPage({ user, onLogout }: CategoriasPageProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState('');
  const navigate = useNavigate();

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const data = await listarCategorias();
      setCategorias(data);
    } catch {
      setTableError('Não foi possível carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleCategoriaCriada = (novaCategoria: Categoria) => {
    setCategorias((prev) => {
      const updated = [...prev, novaCategoria];
      return updated.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
    });
  };

  const handleEditar = async (id: string, novoNome: string) => {
    setTableError('');
    try {
      const atualizada = await atualizarCategoria(id, { nome: novoNome });
      setCategorias((prev) => {
        const updated = prev.map((cat) => (cat.id === id ? atualizada : cat));
        return updated.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
      });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setTableError(axiosError.response?.data?.message || 'Erro ao atualizar categoria.');
      } else {
        setTableError('Erro ao atualizar categoria.');
      }
      throw err;
    }
  };

  const handleExcluir = async (id: string) => {
    setTableError('');
    try {
      await excluirCategoria(id);
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 409) {
          setTableError(axiosError.response.data?.message || 'Não é possível excluir esta categoria pois ela possui movimentações vinculadas.');
        } else {
          setTableError(axiosError.response?.data?.message || 'Erro ao excluir categoria.');
        }
      } else {
        setTableError('Erro ao excluir categoria.');
      }
      throw err;
    }
  };

  return (
    <PageWrapper>
      <Navbar user={user} onLogout={onLogout} />
      <PageContainer>
        <PageHeader>
          <TitleBox>
            <PageTitle>Gerenciar Categorias</PageTitle>
            <PageSubtitle>Cadastre e organize as categorias de suas movimentações</PageSubtitle>
          </TitleBox>
          <BackButton onClick={() => navigate('/')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Voltar às Movimentações
          </BackButton>
        </PageHeader>

        <CategoriaForm onCategoriaCriada={handleCategoriaCriada} />

        <CategoriaTable
          categorias={categorias}
          loading={loading}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          errorMessage={tableError}
          onClearError={() => setTableError('')}
        />
      </PageContainer>
    </PageWrapper>
  );
}
