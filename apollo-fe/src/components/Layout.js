import React from 'react';
import {
    Menu,
    Container
} from 'semantic-ui-react';

export default function Layout({ children }) {
    return (
        <>
            <Menu fixed="top" inverted>
                <Container>
                    <Menu.Item as="a" header href="/">
                        Book Store
                    </Menu.Item>
                    <Menu.Item as="a" href="/">Books</Menu.Item>
                    <Menu.Item as="a" href="/authors">Authors</Menu.Item>
                </Container>
            </Menu>
            <Container style={{paddingTop:52}}>
                { children }
            </Container>
        </>
    );
}