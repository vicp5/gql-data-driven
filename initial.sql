CREATE TABLE author (id text not null, name text not null);
CREATE TABLE book (id text not null, author_id text not null, name text not null, price DECIMAL(10,2) not null, status text not null);