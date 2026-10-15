import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';

describe('Home Component', () => {
  it('renders the title', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Controle de Gastos' })).toBeInTheDocument();
  });
});
