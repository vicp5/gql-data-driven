use mysql::{from_row, params, Error as DBError, Row};

use crate::schemas::root::Context;
use crate::schemas::author::Author;

#[derive(Default, Debug)]
pub struct Book {
    pub id: String,
    pub author_id: String,
    pub name: String,
    pub price: f64,
    pub status: String,
}

#[juniper::object(Context = Context)]
impl Book {
    fn id(&self) -> &str {
        &self.id
    }
    fn author_id(&self) -> &str {
        &self.author_id
    }
    fn name(&self) -> &str {
        &self.name
    }
    fn price(&self) -> &f64 {
        &self.price
    }
    fn status(&self) -> &str {
        &self.status
    }

    fn author(&self, context: &Context) -> Option<Author> {
        let mut conn = context.pool.get().unwrap();
        let author: Result<Option<Row>, DBError> = conn.first_exec(
            "SELECT * FROM author WHERE id=:id",
            params! {"id" => &self.author_id},
        );
        if let Err(err) = author {
            None
        } else {
            let (id, name) = from_row(author.unwrap().unwrap());
            Some(Author { id, name })
        }
    }
}

#[derive(GraphQLInputObject)]
#[graphql(description = "A book")]
pub struct NewBook {
    pub author_id: String,
    pub name: String,
    pub price: f64
}