import { Container, Title, UserCard, LogoutButton, UserInfo, FeedbackMessage, MovimentacaoFormWrapper } from './styles.ts';
import MovimentacaoForm from '../components/MovimentacaoForm';

interface User {
  id: string;
  nome: string;
  email: string;
}

interface HomeProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function Home({ user, onLogout }: HomeProps) {
  return (
    <Container>
      <Title>Controle de Gastos</Title>
      <UserCard>
        <UserInfo>
          <h2>Olá, {user?.nome || 'Usuário'}! 👋</h2>
          <p>{user?.email}</p>
        </UserInfo>
        <LogoutButton onClick={onLogout}>Sair da conta</LogoutButton>
      </UserCard>

      <MovimentacaoFormWrapper>
        <MovimentacaoForm />
      </MovimentacaoFormWrapper>

      <FeedbackMessage>
        Autenticação realizada com sucesso.
      </FeedbackMessage>
    </Container>
  );
}
