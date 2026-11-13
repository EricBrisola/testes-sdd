import {
  ModalBackdrop,
  ModalContent,
  WarningIconWrapper,
  ModalTitle,
  ModalMessage,
  ModalActions,
  CancelButton,
  ConfirmButton
} from './styles';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemNome?: string;
  isParcela?: boolean;
  totalParcelas?: number | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  itemNome,
  isParcela = false,
  totalParcelas,
  loading = false,
  onConfirm,
  onCancel
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <WarningIconWrapper>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </WarningIconWrapper>

        <ModalTitle>
          {isParcela ? 'Excluir Movimentação Parcelada?' : 'Excluir Movimentação?'}
        </ModalTitle>

        <ModalMessage>
          {isParcela ? (
            <>
              A movimentação <strong>"{itemNome || 'selecionada'}"</strong> faz parte de um parcelamento
              {totalParcelas ? ` em ${totalParcelas}x` : ''}. Ao confirmar,{' '}
              <strong>todas as parcelas vinculadas serão excluídas conjuntamente</strong>. Esta ação não pode ser desfeita.
            </>
          ) : (
            <>
              Tem certeza de que deseja remover a movimentação{' '}
              <strong>"{itemNome || 'selecionada'}"</strong>? Esta ação não pode ser desfeita.
            </>
          )}
        </ModalMessage>

        <ModalActions>
          <CancelButton type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </CancelButton>
          <ConfirmButton type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Excluindo...' : 'Sim, Excluir'}
          </ConfirmButton>
        </ModalActions>
      </ModalContent>
    </ModalBackdrop>
  );
}
