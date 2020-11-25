import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Layout from './components/Layout';
import AuthorTable from './AuthorTable';
import BookTable from './BookTable';

const history = createBrowserHistory();

function App() {
  return (
    <Layout>
      <Router history={history}>
        <Switch>
          <Route exact path="/authors" component={AuthorTable} />
          <Route exact path="/" component={BookTable} />
        </Switch>
      </Router>
    </Layout>
  );
}

export default App;
