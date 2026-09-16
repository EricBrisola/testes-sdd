import { Container, LoginCard, Title, Subtitle } from './styles';
import { GoogleLoginButton } from '../../components/GoogleLoginButton';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
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
