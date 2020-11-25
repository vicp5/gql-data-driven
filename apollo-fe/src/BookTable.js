import React from 'react';
import Table from './components/Table';
import ButtonModal from './components/ButtonModal';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button, Form, Select } from 'semantic-ui-react';

const GET_BOOKS = gql`
    query GetBooks {
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

const ADD_BOOK = gql`
    mutation AddBook($book: NewBook!) {
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

function BookForm({ authors = [], defaultAuthor, onCompleted }) {
    const [ selectedAuthor, setSelectedAuthor ] = React.useState(defaultAuthor ? defaultAuthor.id : null);
    const [ addBook ] = useMutation(ADD_BOOK, {
        onCompleted,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, price } = e.target.elements;
        addBook({
            variables: { book: {
                authorId: selectedAuthor,
                name: name.value,
                price: parseFloat(price.value),
            }},
        });
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
    const { loading, error, data } = useQuery(GET_BOOKS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Failed!</p>;

    return <Table
        data={data.books}
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
                render: <CreateBook authors={data.authors} />
            }
        ]}
    />;
}

export default BookTable;