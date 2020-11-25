use juniper::{FieldError, FieldResult, RootNode};
use mysql::{from_row, params, Error as DBError, Row};

use crate::db::Pool;

use super::book::{Book, NewBook};
use super::author::{Author, NewAuthor};

pub struct Context {
    pub pool: Pool,
}

impl juniper::Context for Context {}

pub struct QueryRoot;

#[juniper::object(Context = Context)]
impl QueryRoot {
    #[graphql(description = "List of all authors")]
    fn authors(context: &Context) -> FieldResult<Vec<Author>> {
        let mut conn = context.pool.get().unwrap();
        let authors = conn
            .prep_exec("SELECT * FROM author", ())
            .map(|result| {
                result
                    .map(|x| x.unwrap())
                    .map(|mut row| {
                        let (id, name) = from_row(row);
                        Author { id, name }
                    })
                    .collect()
            })
            .unwrap();
        Ok(authors)
    }

    #[graphql(description = "Get an author by ID")]
    fn author(context: &Context, id: String) -> FieldResult<Author> {
        let mut conn = context.pool.get().unwrap();
        let author: Result<Option<Row>, DBError> =
            conn.first_exec("SELECT * FROM author WHERE id=:id", params! {"id" => id});

        if let Err(err) = author {
            return Err(FieldError::new(
                "Author not found",
                graphql_value!({ "not_found": "author not found" }),
            ));
        }

        let (id, name) = from_row(author.unwrap().unwrap());
        Ok(Author { id, name })
    }

    #[graphql(description = "List of all books")]
    fn books(context: &Context) -> FieldResult<Vec<Book>> {
        let mut conn = context.pool.get().unwrap();
        let books = conn
            .prep_exec("SELECT * FROM book", ())
            .map(|result| {
                result
                    .map(|x| x.unwrap())
                    .map(|mut row| {
                        let (id, author_id, name, price, status) = from_row(row);
                        Book {
                            id,
                            author_id,
                            name,
                            price,
                            status,
                        }
                    })
                    .collect()
            })
            .unwrap();
        Ok(books)
    }

    #[graphql(description = "Get a book by ID")]
    fn book(context: &Context, id: String) -> FieldResult<Book> {
        let mut conn = context.pool.get().unwrap();
        let book: Result<Option<Row>, DBError> =
            conn.first_exec("SELECT * FROM book WHERE id=:id", params! {"id" => id});

        if let Err(err) = book {
            return Err(FieldError::new(
                "Book not found",
                graphql_value!({ "not_found": "book not found" }),
            ));
        }

        let (id, author_id, name, price, status) = from_row(book.unwrap().unwrap());
        Ok(Book {
            id,
            author_id,
            name,
            price,
            status,
        })
    }
}

pub struct MutationRoot;

#[juniper::object(Context = Context)]
impl MutationRoot {
    #[graphql(description = "Create new author")]
    fn create_author(context: &Context, author: NewAuthor) -> FieldResult<Author> {
        let mut conn = context.pool.get().unwrap();
        let new_id = uuid::Uuid::new_v4().to_simple().to_string();

        let insert: Result<Option<Row>, DBError> = conn.first_exec(
            "INSERT INTO author(id, name) VALUES(:id, :name)",
            params! {
                "id" => &new_id,
                "name" => &author.name,
            },
        );

        match insert {
            Ok(opt_row) => Ok(Author {
                id: new_id,
                name: author.name,
            }),
            Err(err) => {
                let msg = match err {
                    DBError::MySqlError(err) => err.message,
                    _ => "internal error".to_owned(),
                };
                Err(FieldError::new(
                    "Failed to create new author",
                    graphql_value!({ "internal_error": msg }),
                ))
            }
        }
    }

    #[graphql(description = "Create a new book")]
    fn create_book(context: &Context, book: NewBook) -> FieldResult<Book> {
        let mut conn = context.pool.get().unwrap();
        let new_id = uuid::Uuid::new_v4().to_simple().to_string();
        let default_status = "PENDING";
        let insert: Result<Option<Row>, DBError> = conn.first_exec(
            "INSERT INTO book(id, author_id, name, price, status) VALUES(:id, :author_id, :name, :price, :status)",
            params! {
                "id" => &new_id,
                "author_id" => &book.author_id,
                "name" => &book.name,
                "price" => &book.price.to_owned(),
                "status" => &default_status,
            },
        );

        match insert {
            Ok(opt_row) => Ok(Book {
                id: new_id,
                author_id: book.author_id,
                name: book.name,
                price: book.price,
                status: default_status.to_owned(),
            }),
            Err(err) => {
                let msg = match err {
                    DBError::MySqlError(err) => err.message,
                    _ => "internal error".to_owned(),
                };
                Err(FieldError::new(
                    "Failed to create a new book",
                    graphql_value!({ "internal_error": msg }),
                ))
            }
        }
    }
}

pub type Schema = RootNode<'static, QueryRoot, MutationRoot>;

pub fn create_schema() -> Schema {
    Schema::new(QueryRoot, MutationRoot)
}