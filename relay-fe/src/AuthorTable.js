import React from 'react';
import Table from './components/Table';
import ButtonModal from './components/ButtonModal';
import { Button, Form } from 'semantic-ui-react';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer, commitMutation } from 'react-relay';
import environment from './RelayEnvironment';

const GET_AUTHORS = graphql`
  query AuthorTableQuery {
    authors {
      id
      name
      age
      books {
        id
        name
      }
    }
  }
`;

const ADD_AUTHOR = graphql`
  mutation AuthorTableMutation($author: NewAuthor!) {
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

function commit(environment, author, config) {
    return commitMutation(
        environment,
        {
            mutation: ADD_AUTHOR,
            variables: { author },
            ...config,
        }
    )
}

function AuthorForm({ onCompleted }) {
    const handleSubmit = (e) => {
      e.preventDefault();
      commit(environment, {
        name: e.target.elements.name.value
      }, { onCompleted });
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
    return (
        <QueryRenderer
            environment={environment}
            query={GET_AUTHORS}
            variables={{}}
            render={({error, props}) => {
                if (error) return <p>Failed!</p>;
                if (!props) return <p>Loading...</p>;

                return <Table
                    data={props.authors}
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
            }}
        />
    );
}

export default AuthorTable;