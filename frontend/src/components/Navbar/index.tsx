import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/user';
import {
  NavContainer,
  NavContent,
  BrandSection,
  NavLinks,
  StyledNavLink,
  RightSection,
  UserLabel,
  LogoutButton
} from './styles';

export interface NavbarProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <NavContainer>
      <NavContent>
        <BrandSection onClick={() => navigate('/')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Controle de Gastos
        </BrandSection>

        <NavLinks>
          <StyledNavLink to="/" end>
            Nova Movimentação
          </StyledNavLink>
          <StyledNavLink to="/movimentacoes">
            Movimentações
          </StyledNavLink>
          <StyledNavLink to="/categorias">
            Categorias
          </StyledNavLink>
        </NavLinks>

        <RightSection>
          {user && <UserLabel>Olá, {user.nome}</UserLabel>}
          {onLogout && <LogoutButton onClick={onLogout}>Sair</LogoutButton>}
        </RightSection>
      </NavContent>
    </NavContainer>
  );
}
