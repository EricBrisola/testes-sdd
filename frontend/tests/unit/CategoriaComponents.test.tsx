import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoriaForm from '../../src/components/CategoriaForm';
import CategoriaTable from '../../src/components/CategoriaTable';
import * as categoriaService from '../../src/services/categoria.service';

jest.mock('../../src/services/categoria.service');

describe('CategoriaForm Component', () => {
  it('renderiza o formulário de categoria corretamente', () => {
    render(<CategoriaForm />);
    expect(screen.getByText('Nova Categoria')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: Alimentação, Transporte, Lazer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar categoria/i })).toBeInTheDocument();
  });

  it('exibe erro de validação ao submeter campo em branco', async () => {
    render(<CategoriaForm />);
    const button = screen.getByRole('button', { name: /criar categoria/i });

    fireEvent.click(button);

    expect(screen.getByText('O nome da categoria é obrigatório e não pode ser vazio')).toBeInTheDocument();
    expect(categoriaService.criarCategoria).not.toHaveBeenCalled();
  });

  it('chama o serviço criarCategoria com sucesso e limpa o input', async () => {
    const fakeCat = {
      id: '1',
      nome: 'Transporte',
      userId: 'user-1',
      createdAt: '2026-10-15T00:00:00Z',
      updatedAt: '2026-10-15T00:00:00Z'
    };
    (categoriaService.criarCategoria as jest.Mock).mockResolvedValue(fakeCat);
    const mockOnCriada = jest.fn();

    render(<CategoriaForm onCategoriaCriada={mockOnCriada} />);
    const input = screen.getByPlaceholderText('Ex: Alimentação, Transporte, Lazer');
    const button = screen.getByRole('button', { name: /criar categoria/i });

    fireEvent.change(input, { target: { value: 'Transporte' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(categoriaService.criarCategoria).toHaveBeenCalledWith({ nome: 'Transporte' });
      expect(screen.getByText('Categoria criada com sucesso!')).toBeInTheDocument();
      expect(mockOnCriada).toHaveBeenCalledWith(fakeCat);
      expect((input as HTMLInputElement).value).toBe('');
    });
  });
});

describe('CategoriaTable Component', () => {
  it('renderiza mensagem de estado vazio quando não há categorias', () => {
    render(<CategoriaTable categorias={[]} />);
    expect(screen.getByText('Nenhuma categoria cadastrada ainda')).toBeInTheDocument();
  });

  it('renderiza a lista de categorias em tabela', () => {
    const fakeList = [
      { id: '1', nome: 'Alimentação', userId: 'u1', createdAt: '', updatedAt: '' },
      { id: '2', nome: 'Transporte', userId: 'u1', createdAt: '', updatedAt: '' }
    ];

    render(<CategoriaTable categorias={fakeList} />);
    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('Transporte')).toBeInTheDocument();
    expect(screen.getByText('2 categorias')).toBeInTheDocument();
  });

  it('habilita modo de edição inline ao clicar no nome ou ícone de editar', () => {
    const fakeList = [
      { id: '1', nome: 'Alimentação', userId: 'u1', createdAt: '', updatedAt: '' }
    ];

    render(<CategoriaTable categorias={fakeList} />);
    const editBtn = screen.getByLabelText('Editar categoria Alimentação');

    fireEvent.click(editBtn);

    const inlineInput = screen.getByLabelText('Editar nome da categoria Alimentação');
    expect(inlineInput).toBeInTheDocument();
    expect((inlineInput as HTMLInputElement).value).toBe('Alimentação');
  });
});
