import type { MovimentacaoComCategoria } from '../../types/movimentacao';
import { formatarMoeda } from '../../utils/formatters';
import {
  ListContainer,
  TableWrapper,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
  ItemName,
  ItemValor,
  NaturezaBadge,
  MetodoBadge,
  CategoriaTag,
  ActionsCell,
  ActionButton
} from './styles';

export interface MovimentacaoListProps {
  movimentacoes: MovimentacaoComCategoria[];
  onEditar?: (movimentacao: MovimentacaoComCategoria) => void;
  onExcluir?: (movimentacao: MovimentacaoComCategoria) => void;
}

export default function MovimentacaoList({
  movimentacoes,
  onEditar,
  onExcluir
}: MovimentacaoListProps) {
  const getMetodoLabel = (metodo: string) => {
    switch (metodo) {
      case 'PIX':
        return 'Pix';
      case 'CARTAO':
        return 'Cartão';
      case 'DINHEIRO':
        return 'Dinheiro';
      default:
        return metodo;
    }
  };

  return (
    <ListContainer>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nome</TableHeaderCell>
              <TableHeaderCell>Valor</TableHeaderCell>
              <TableHeaderCell>Fluxo</TableHeaderCell>
              <TableHeaderCell>Tipo</TableHeaderCell>
              <TableHeaderCell>Categoria</TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'right' }}>Ações</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {movimentacoes.map((item) => (
              <TableRow key={item.id}>
                {/* 1. Nome */}
                <TableCell>
                  <ItemName>{item.nome}</ItemName>
                </TableCell>

                {/* 2. Valor */}
                <TableCell>
                  <ItemValor $tipo={item.tipo}>
                    {item.tipo === 'ENTRADA' ? '+ ' : '- '}
                    {formatarMoeda(item.valor)}
                  </ItemValor>
                </TableCell>

                {/* 3. Entrada ou Despesa */}
                <TableCell>
                  <NaturezaBadge $tipo={item.tipo}>
                    {item.tipo === 'ENTRADA' ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                        Receita
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        Despesa
                      </>
                    )}
                  </NaturezaBadge>
                </TableCell>

                {/* 4. Tipo de Movimentação (Método) */}
                <TableCell>
                  <MetodoBadge>{getMetodoLabel(item.metodoPagamento)}</MetodoBadge>
                </TableCell>

                {/* 5. Categoria */}
                <TableCell>
                  <CategoriaTag>{item.categoria?.nome || 'Sem categoria'}</CategoriaTag>
                </TableCell>

                {/* Ações: Editar e Excluir */}
                <TableCell>
                  <ActionsCell>
                    {onEditar && (
                      <ActionButton
                        className="edit"
                        onClick={() => onEditar(item)}
                        title="Editar movimentação"
                        aria-label={`Editar ${item.nome}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </ActionButton>
                    )}
                    {onExcluir && (
                      <ActionButton
                        className="delete"
                        onClick={() => onExcluir(item)}
                        title="Excluir movimentação"
                        aria-label={`Excluir ${item.nome}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </ActionButton>
                    )}
                  </ActionsCell>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </ListContainer>
  );
}
