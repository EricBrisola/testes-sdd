import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const NavContainer = styled.nav`
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.85rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box;
`;

export const NavContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

export const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
  cursor: pointer;
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledNavLink = styled(NavLink)`
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: #111827;
    background-color: #f3f4f6;
  }

  &.active {
    color: #2563eb;
    background-color: #eff6ff;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserLabel = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const LogoutButton = styled.button`
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: #fca5a5;
  }
`;
