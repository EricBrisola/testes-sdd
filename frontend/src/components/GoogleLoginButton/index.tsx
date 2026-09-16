import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { api } from '../../services/api';
import { Container } from './styles';

interface GoogleLoginButtonProps {
  onSuccess: (user: any) => void;
  onError: () => void;
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const response = await api.post('/api/auth/google', {
        token: credentialResponse.credential
      });
      onSuccess(response.data.user);
    } catch (error) {
      console.error('Login failed', error);
      onError();
    }
  };

  return (
    <Container>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={onError}
      />
    </Container>
  );
}
