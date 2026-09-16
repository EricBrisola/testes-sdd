import { render, screen } from '@testing-library/react';
import Home from '../../src/pages/Home';

describe('Home Component', () => {
  it('renders the title', () => {
    render(<Home />);
    expect(screen.getByText('Controle de Gastos')).toBeInTheDocument();
  });
});
