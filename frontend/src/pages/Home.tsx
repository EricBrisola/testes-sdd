import { Container, Title, UserCard, LogoutButton, UserInfo } from './Home.styles';

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
      <p style={{ marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
        Autenticação realizada com sucesso. Sessão protegida via cookie HttpOnly.
      </p>
    </Container>
  );
}
