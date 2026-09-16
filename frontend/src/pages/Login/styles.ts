import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f9fc;
`;

export const LoginCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`;

export const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;
