import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { criarCategoria } from '../../services/categoria.service';
import type { Categoria } from '../../types/categoria';
import {
  FormContainer,
  FormTitle,
  InputGroup,
  Label,
  StyledInput,
  ErrorText,
  Button,
  SuccessMessage,
  GeneralErrorMessage
} from './styles';

export interface CategoriaFormProps {
  onCategoriaCriada?: (categoria: Categoria) => void;
}

export default function CategoriaForm({ onCategoriaCriada }: CategoriaFormProps) {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setValidationError('');

    const nomeFormatado = nome.trim();

    if (!nomeFormatado) {
      setValidationError('O nome da categoria é obrigatório e não pode ser vazio');
      return;
    }

    setLoading(true);

    try {
      const novaCategoria = await criarCategoria({ nome: nomeFormatado });
      setSuccessMessage('Categoria criada com sucesso!');
      setNome('');
      if (onCategoriaCriada) {
        onCategoriaCriada(novaCategoria);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setErrorMessage(axiosError.response?.data?.message || 'Erro ao criar categoria.');
      } else {
        setErrorMessage('Falha ao comunicar com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Nova Categoria</FormTitle>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <GeneralErrorMessage>{errorMessage}</GeneralErrorMessage>}

      <InputGroup>
        <Label htmlFor="nome-categoria">Nome da Categoria</Label>
        <StyledInput
          id="nome-categoria"
          type="text"
          placeholder="Ex: Alimentação, Transporte, Lazer"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            if (validationError) setValidationError('');
          }}
          $hasError={Boolean(validationError)}
        />
        {validationError && <ErrorText>{validationError}</ErrorText>}
      </InputGroup>

      <Button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Categoria'}
      </Button>
    </FormContainer>
  );
}
