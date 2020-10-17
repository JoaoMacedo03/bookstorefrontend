import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

import Header from '../../components/Header';
import formatDate from '../../utils/formatDate';

import { useAuth } from '../../hooks/auth';

import { Container, TableContainer, Icons } from './styles';

interface Book {
  id: number;
  name: string;
  opinion: string;
  created_at: Date;
  formattedDate: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [books, setBooks] = useState<Book[]>([]);
  
  useEffect(() => {
    async function loadBooks(): Promise<void> {
      const {
        data: { books: booksResponse },
      } = await api.get('book');

      const booksFormatted = booksResponse.map(
        (book: Book) => ({
          ...book,
          formattedDate: formatDate(book.created_at),
        }),
      );

      setBooks(booksFormatted);
    }

    loadBooks();
  }, []);

  const handleEdit = useCallback((book: Book): void => {
    history.push('/book', { ...book });
  }, []);

  const handleDelete = useCallback(async (id: number): Promise<void> => {
    await api.delete(`book/${id}`);
    window.location.reload();
  }, []);

  return (
    <>
      <Header />
      <Container>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Opinião</th>
                <th>Criado em</th>
                <th>Opções</th>
              </tr>
            </thead>

            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td className="title">{book.name}</td>
                  <td>{book.opinion}</td>
                  <td>{book.formattedDate}</td>
                  <td>
                    <Icons>
                      <i 
                        style={{ color: 'green' }} 
                        className="lni lni-highlight-alt"
                        title="Editar"
                        onClick={() => handleEdit(book)}
                      ></i>
                      {user.role == 0 && 
                        <i 
                          style={{ color: 'red' }} 
                          className="lni lni-trash"
                          title="Excluir"
                          onClick={() => handleDelete(book.id)}
                        ></i> 
                      }
                      
                    </Icons>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
