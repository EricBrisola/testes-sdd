import { Container, Title, MovimentacaoFormWrapper } from './styles';
import MovimentacaoForm from '../components/MovimentacaoForm';
import Navbar from '../components/Navbar';
import type { User } from '../types/user';

export interface HomeProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function Home({ user, onLogout }: HomeProps) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <Container>
        <Title>Controle de Gastos</Title>

        <MovimentacaoFormWrapper>
          <MovimentacaoForm />
        </MovimentacaoFormWrapper>
      </Container>
    </>
  );
}
