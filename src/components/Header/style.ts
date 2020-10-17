import styled from 'styled-components';

interface ContainerProps {
  size?: 'small' | 'large';
}

export const Container = styled.div<ContainerProps>`
  background: #3ac5d2;
  padding: 30px 0;

  header {
    width: 1120px;
    display: flex;
    justify-content: flex-end;
    left: 10%;
    position: relative;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};

    nav {
      a {
        color: #fff;
        text-decoration: none;
        font-size: 21px;
        transition: opacity 0.2s;

        & + a {
          margin-left: 32px;
        }

        &:hover {
          opacity: 0.6;
        }
      }
    }
  }
`;
