import React, {Component, Fragment} from 'react';
import {Route, Switch, useLocation, useParams} from "react-router-dom";
import {Home} from "./Home";

class App extends Component<{}> {
    render() {
        return <Fragment>
            <main className='container content'>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/game/:game">
                        <Game/>
                    </Route>
                    <Route path="*">
                        <NoMatch/>
                    </Route>
                </Switch>
            </main>
            <footer className="footer">
                <div className="container">
                    <p>
                        Q.E was designed by Gavin Birnbaum and published by boardgametables.com
                    </p>
                    <p>
                        This implementation written by Patrick Rose.
                        If you like the game, <a title="Product page for Q.E" href="https://www.boardgametables.com/products/qe-quantitative-easing-board-game">buy a real copy!</a>
                    </p>
                </div>
            </footer>
        </Fragment>
    }
}

interface GameRoute {
    game: string
}

function Game() {
    let {game} = useParams<GameRoute>();

    return (
        <div>
            <h3>ID: {game}</h3>
        </div>
    );
}

function NoMatch() {
    let location = useLocation();

    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
}

export default App;
