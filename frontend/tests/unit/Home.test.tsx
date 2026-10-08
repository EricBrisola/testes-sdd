import { render } from '@testing-library/react';
import Home from '../../src/pages/Home';

describe('Home Component', () => {
  it('renders the title', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Controle de Gastos')).toBeInTheDocument();
  });
});
