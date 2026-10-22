import type { MovimentacaoComCategoria } from '../../types/movimentacao';
import { formatarMoeda } from '../../utils/formatters';
import {
  CardsGrid,
  Card,
  CardHeader,
  CardNome,
  NaturezaBadge,
  CardBody,
  CardValor,
  CardFooter,
  CardActionButton
} from './styles';

export interface MovimentacaoCardsProps {
  movimentacoes: MovimentacaoComCategoria[];
  onEditar?: (movimentacao: MovimentacaoComCategoria) => void;
  onExcluir?: (movimentacao: MovimentacaoComCategoria) => void;
}

export default function MovimentacaoCards({
  movimentacoes,
  onEditar,
  onExcluir
}: MovimentacaoCardsProps) {
  return (
    <CardsGrid>
      {movimentacoes.map((item) => (
        <Card key={item.id}>
          {/* Header com Nome e Badge de Entrada/Despesa */}
          <CardHeader>
            <CardNome>{item.nome}</CardNome>
            <NaturezaBadge $tipo={item.tipo}>
              {item.tipo === 'ENTRADA' ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  Entrada
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
          </CardHeader>

          {/* Body com Valor */}
          <CardBody>
            <CardValor $tipo={item.tipo}>
              {item.tipo === 'ENTRADA' ? '+ ' : '- '}
              {formatarMoeda(item.valor)}
            </CardValor>
          </CardBody>

          {/* Footer com Ações */}
          <CardFooter>
            {onEditar && (
              <CardActionButton
                className="edit"
                onClick={() => onEditar(item)}
                title="Editar movimentação"
                aria-label={`Editar ${item.nome}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </CardActionButton>
            )}
            {onExcluir && (
              <CardActionButton
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
              </CardActionButton>
            )}
          </CardFooter>
        </Card>
      ))}
    </CardsGrid>
  );
}
