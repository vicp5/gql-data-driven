use mysql::{from_row, params};

use crate::schemas::book::Book;
use crate::schemas::root::Context;

#[derive(Default, Debug)]
pub struct Author {
    pub id: String,
    pub name: String,
}

#[derive(GraphQLInputObject)]
#[graphql(description = "An author")]
pub struct NewAuthor {
    pub name: String,
}

#[juniper::object(Context = Context)]
impl Author {
    fn id(&self) -> &str {
        &self.id
    }
    fn name(&self) -> &str {
        &self.name
    }

    fn books(&self, context: &Context) -> Vec<Book> {
        let mut conn = context.pool.get().unwrap();

        conn.prep_exec(
            "SELECT * FROM book WHERE author_id=:author_id",
            params! {
                "author_id" => &self.id
            },
        )
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
        .unwrap()
    }
}