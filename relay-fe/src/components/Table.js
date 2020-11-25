import React from 'react';
import { Button, Table as STable, Icon } from 'semantic-ui-react';

const Table = ({ data = [], columns = [], actions }) => (
    <STable compact celled>
        <STable.Header>
            <STable.Row>
                {
                    columns.map((c, i) => (
                        <STable.HeaderCell key={i}>
                            { c.name }
                        </STable.HeaderCell>
                    ))
                }
            </STable.Row>
        </STable.Header>
        <STable.Body>
            {
                data.map((d, i) => (
                    <STable.Row key={i}>
                        {
                            columns.map((c, j) => (
                                <STable.HeaderCell key={j}>
                                    {
                                        c.resolve ? c.resolve(d) : d[c.accessor]
                                    }
                                </STable.HeaderCell>
                            ))
                        }
                    </STable.Row>
                ))
            }
        </STable.Body>
        {
            actions && <STable.Footer fullWidth>
                <STable.Row>
                    {
                        Array.from(Array(columns.length - 1), (_, i) => (
                            <STable.HeaderCell key={i} />
                        ))
                    }
                    {
                        actions.map((action, i) => (
                            <STable.HeaderCell key={i}>
                            {action.render
                                ?   action.render
                                :   
                                        <Button
                                            floated="right"
                                            icon
                                            labelPosition="left"
                                            primary
                                            size="small"
                                            onClick={action.onClick}
                                        >
                                            <Icon name={action.icon} />
                                            { action.label }
                                        </Button>}
                            </STable.HeaderCell>
                        ))
                    }
                </STable.Row>
            </STable.Footer>
        }
    </STable>
);

export default Table;