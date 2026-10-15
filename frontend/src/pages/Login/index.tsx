import { Container, LoginCard, Title, Subtitle } from './styles';
import { GoogleLoginButton } from '../../components/GoogleLoginButton';
import type { User } from '../../types/user';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  return (
    <Container>
      <LoginCard>
        <Title>Controle de Gastos</Title>
        <Subtitle>Faça login para continuar</Subtitle>
        <GoogleLoginButton 
          onSuccess={onLoginSuccess} 
          onError={() => alert('Falha ao tentar logar com o Google.')} 
        />
      </LoginCard>
    </Container>
  );
}
