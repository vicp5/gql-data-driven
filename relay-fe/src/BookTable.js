import React from 'react';
import Table from './components/Table';
import ButtonModal from './components/ButtonModal';
import { Button, Form, Select } from 'semantic-ui-react';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer, commitMutation } from 'react-relay';
import environment from './RelayEnvironment';

const GET_BOOKS = graphql`
    query BookTableQuery {
        books {
            id
            name
            price
            status
            author {
                id
                name
            }
        }
        authors {
            id
            name
        }
    }
`;

const ADD_BOOK = graphql`
    mutation BookTableMutation($book: NewBook!) {
        createBook(book: $book) {
            id
            name
            price
            status
            author {
                id
                name
            }
        }
    }
`;

function commit(environment, book, config) {
    return commitMutation(
        environment,
        {
            mutation: ADD_BOOK,
            variables: { book },
            ...config,
        }
    )
}

function BookForm({ authors = [], defaultAuthor, onCompleted }) {
    const [ selectedAuthor, setSelectedAuthor ] = React.useState(defaultAuthor ? defaultAuthor.id : null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, price } = e.target.elements;
        commit(environment, {
            authorId: selectedAuthor,
            name: name.value,
            price: parseFloat(price.value),
        }, { onCompleted });
    };

    return (
        <Form onSubmit={handleSubmit}>
            {
                defaultAuthor
                    ? <Form.Field control="input" label="Author" name="authorId" disabled value={defaultAuthor.id} />
                    : <Form.Field
                        control={Select}
                        placeholder="Select author"
                        label="Author"
                        name="authorId"
                        options={authors.map((author,i) => ({
                            key: `${author.id}`,
                            text: `${author.name}`,
                            value: `${author.id}`,
                        }))}
                        onChange={(e, {name, value}) => setSelectedAuthor(value)}
                    />
            }
            <Form.Field>
                <label>Name</label>
                <input name="name" placeholder="Name" />
            </Form.Field>
            <Form.Field>
                <label>Price</label>
                <input name="price" placeholder="Price" type="number" step="0.01" />
            </Form.Field>
            <Button
                type="submit"
                positive
                disbabled={!selectedAuthor}
            >
                Add
            </Button>
        </Form>
    );
}

function CreateBook(props) {
    return (
        <ButtonModal title="Add Book" description="Add a new book" icon="book">
            <BookForm {...props} onCompleted={() => window.location.href="/"} />
        </ButtonModal>
    );
}

function BookTable() {
    return (
        <QueryRenderer
            environment={environment}
            query={GET_BOOKS}
            variables={{}}
            render={({error, props}) => {
                if (error) return <p>Failed!</p>;
                if (!props) return <p>Loading...</p>;

                return <Table
                    data={props.books}
                    columns={[
                        {
                            name: "Title",
                            accessor: "name",
                        },
                        {
                            name: "Price",
                            resolve: (d) => `$${d.price}`,
                        },
                        {
                            name: "Status",
                            accessor: "status"
                        },
                        {
                            name: "Author",
                            resolve: (d) => d.author.name,
                        },
                    ]}
                    actions={[
                        {
                            render: <CreateBook authors={props.authors} />,
                        }
                    ]}
                />;
            }}
        />
    );
}

export default BookTable;