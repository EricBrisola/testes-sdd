import { useState } from 'react';
import Input from '../Input';
import Select from '../Select';
import { FormContainer, FormTitle, Button, SuccessMessage, ErrorMessage, Row } from './styles';
import axios from 'axios';

// As Categorias deveriam vir do backend, porém para o MVP podemos usar um mockup ou criar uma hardcoded
const MOCK_CATEGORIA_ID = 'mock-categoria-123'; // Ideal seria fazer GET /api/categorias

interface FormData {
  nome: string;
  valor: string;
  data: string;
  tipo: string;
  metodoPagamento: string;
}

export default function MovimentacaoForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    tipo: 'ENTRADA',
    metodoPagamento: 'PIX'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    try {
      await axios.post('http://localhost:3000/api/movimentacoes', {
        nome: formData.nome,
        valor: Math.abs(parseFloat(formData.valor)), // Valor absoluto garantido
        data: new Date(formData.data).toISOString(),
        tipo: formData.tipo,
        metodoPagamento: formData.metodoPagamento,
        categoriaId: MOCK_CATEGORIA_ID
      }, {
        withCredentials: true // Importante para enviar o HttpOnly Cookie JWT
      });

      setSuccess(true);
      setFormData({
        ...formData,
        nome: '',
        valor: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar a movimentação.');
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

      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Movimentação'}
      </Button>
    </FormContainer>
  );
}
