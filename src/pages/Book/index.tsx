import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FiBook } from 'react-icons/fi';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';

import { Container, Content, AnimationContainer } from './style';

interface BookFormData {
  name: string;
  opinion: string;
  id: number;
}

const Book: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [opinion, setOpinion] = useState<string>('');
  const [bookId, setBookId] = useState<number>(0);

  const { user } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  useEffect(() => {
    if(history.location.state) {
      const bookData: any = history.location.state;
      setTitle(bookData.name);
      setOpinion(bookData.opinion);
      setBookId(bookData.id);
    }
  }, []);

  const handleSubmit = useCallback(
    async (data: BookFormData) => {
      try {
        if(history.location.state) {
          const bookData: any = history.location.state;
          data.id = bookData.id;
        } else {
          data.id = 0;
        }
        
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Título obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });
        
        if(data.id === 0) {
          await api.post('/book', data);

          addToast({
            type: 'success',
            title: 'Cadastro realizado',
            description: `Livro: ${data.name}, adicionado à coleção`,
          });
        } else {
          await api.put('/book', data);

          addToast({
            type: 'success',
            title: 'Alteração realizado',
            description: `Livro: ${data.name}, atualizado`,
          });
        }

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <Header />
      <Container>
        <Content>
          <AnimationContainer>
            <Form ref={formRef} onSubmit={handleSubmit}>
              {bookId === 0 && <h1>Faça o cadastro de um novo livro</h1>}
              {bookId !== 0 && <h1>Altere os dados do livro</h1>}

              {user.role == 0 && 
                <Input 
                  name="name" 
                  icon={FiBook} 
                  placeholder="Título"
                  defaultValue={title}
                />
              }

              {user.role == 1 && 
                <Input 
                  name="name" 
                  icon={FiBook} 
                  placeholder="Título"
                  defaultValue={title}
                  disabled
                />
              }

              <TextArea 
                name="opinion" 
                placeholder="Opinião" 
                defaultValue={opinion} 
              />

              {bookId === 0 && <Button type="submit">Criar</Button>}
              {bookId !== 0 && <Button type="submit">Alterar</Button>}
            </Form>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default Book;
