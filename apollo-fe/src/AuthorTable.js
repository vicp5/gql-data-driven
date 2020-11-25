import React from 'react';
import Table from './components/Table';
import ButtonModal from './components/ButtonModal';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button, Form } from 'semantic-ui-react';

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      books {
        id
        name
      }
    }
  }
`;

const ADD_AUTHOR = gql`
  mutation AddAuthor($author: NewAuthor!) {
    createAuthor(author: $author) {
      id
      name
      books {
        id
        name
      }
    }
  }
`;

function AuthorForm({ onCompleted }) {
  const [ addAuthor ] = useMutation(ADD_AUTHOR, {
    onCompleted,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAuthor({
      variables: { author: { name: e.target.elements.name.value } }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>Name</label>
        <input name="name" placeholder="Name" />
      </Form.Field>
      <Button
        type="submit"
        positive
      >
        Add
      </Button>
    </Form>
  );
}

function CreateAuthor() {
  return (
    <ButtonModal title="Add Author" description="Add a new author" icon="user">
      <AuthorForm onCompleted={() => window.location.href = '/authors'}/>
    </ButtonModal>
  );
}

function AuthorTable() {
  const { loading, error, data } = useQuery(GET_AUTHORS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed!</p>;

  return <Table
    data={data.authors}
    columns={[
      {
        name: "Name",
        accessor: "name",
      },
      {
        name: "Books",
        resolve: (author) => author.books.length,
      },
      {
        name: "Latest",
        resolve: (author) => author.books.length > 0 ? author.books[author.books.length - 1].name : "NA"
      }
    ]}
    actions={[
      {
        render: <CreateAuthor />,
      }
    ]}
  />;
}

export default AuthorTable;