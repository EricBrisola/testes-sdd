import { useState, useEffect } from 'react';
import Input from '../Input';
import Select from '../Select';
import { api } from '../../services/api';
import { listarCategorias } from '../../services/categoria.service';
import type { Categoria } from '../../types/categoria';
import {
  FormContainer,
  FormTitle,
  Button,
  SuccessMessage,
  ErrorMessage,
  Row,
  CategoryRow,
  CategoryEmptyLink
} from './styles';

interface FormData {
  nome: string;
  valor: string;
  data: string;
  tipo: string;
  metodoPagamento: string;
  categoriaId: string;
}

export default function MovimentacaoForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    tipo: 'ENTRADA',
    metodoPagamento: 'PIX',
    categoriaId: ''
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const data = await listarCategorias();
        setCategorias(data);
        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoriaId: prev.categoriaId || data[0].id
          }));
        }
      } catch {
        setError('Não foi possível carregar as categorias.');
      } finally {
        setLoadingCategorias(false);
      }
    };

    carregarCategorias();
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitAction = async () => {
    setLoading(true);
    setSuccess(false);
    setError('');

    if (!formData.nome || !formData.valor || !formData.data) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (!formData.categoriaId) {
      setError('Por favor, selecione uma categoria para a movimentação.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/movimentacoes', {
        nome: formData.nome,
        valor: Math.abs(parseFloat(formData.valor)),
        data: new Date(formData.data).toISOString(),
        tipo: formData.tipo,
        metodoPagamento: formData.metodoPagamento,
        categoriaId: formData.categoriaId
      });

      setSuccess(true);
      setFormData((prev) => ({
        ...prev,
        nome: '',
        valor: ''
      }));
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Erro ao salvar a movimentação.');
      } else {
        setError('Erro ao salvar a movimentação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer action={submitAction}>
      <FormTitle>Nova Movimentação</FormTitle>

      {success && <SuccessMessage>Movimentação salva com sucesso!</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Input
        label="Nome (ex: Salário, Padaria)"
        type="text"
        placeholder="Nome da movimentação"
        value={formData.nome}
        onChange={(e) => handleChange('nome', e.target.value)}
        required
      />

      <Row>
        <Input
          label="Valor (R$)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0,00"
          value={formData.valor}
          onChange={(e) => handleChange('valor', e.target.value)}
          required
        />
        <Input
          label="Data"
          type="date"
          value={formData.data}
          onChange={(e) => handleChange('data', e.target.value)}
          required
        />
      </Row>

      <CategoryRow>
        <Select
          label="Categoria"
          value={formData.categoriaId}
          onChange={(e) => handleChange('categoriaId', e.target.value)}
          options={
            categorias.length > 0
              ? categorias.map((cat) => ({ value: cat.id, label: cat.nome }))
              : [{ value: '', label: loadingCategorias ? 'Carregando categorias...' : 'Nenhuma categoria cadastrada' }]
          }
          disabled={loadingCategorias || categorias.length === 0}
        />
        {!loadingCategorias && categorias.length === 0 && (
          <CategoryEmptyLink to="/categorias">
            Você ainda não tem categorias. Clique aqui para cadastrar →
          </CategoryEmptyLink>
        )}
      </CategoryRow>

      <Row>
        <Select
          label="Tipo"
          value={formData.tipo}
          onChange={(e) => handleChange('tipo', e.target.value)}
          options={[
            { value: 'ENTRADA', label: 'Entrada (Receita)' },
            { value: 'SAIDA', label: 'Saída (Despesa)' }
          ]}
        />
        <Select
          label="Método de Pagamento"
          value={formData.metodoPagamento}
          onChange={(e) => handleChange('metodoPagamento', e.target.value)}
          options={[
            { value: 'PIX', label: 'Pix' },
            { value: 'DINHEIRO', label: 'Dinheiro' },
            { value: 'CARTAO', label: 'Cartão' }
          ]}
        />
      </Row>

      <Button type="submit" disabled={loading || loadingCategorias || categorias.length === 0}>
        {loading ? 'Salvando...' : 'Salvar Movimentação'}
      </Button>
    </FormContainer>
  );
}
