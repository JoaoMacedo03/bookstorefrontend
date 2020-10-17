import React from 'react';

import { Link } from 'react-router-dom';

import { Container } from './style';
import { useAuth } from '../../hooks/auth';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'small' }: HeaderProps) => {
  const { user } = useAuth();
  return (
    <Container size={size}>
      <header>
        <nav>
          <Link to="/dashboard">Home</Link>
          {user.role == 0 && <Link to="/book">Adicionar Livro</Link> }
          <Link to="/logout">Sair</Link>
        </nav>
      </header>
    </Container>
  )
};
  
export default Header;
