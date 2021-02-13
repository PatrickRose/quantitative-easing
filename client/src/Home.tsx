import React, {ChangeEvent, Component, FormEvent, Fragment} from "react";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HomeState {
    submitting?: 'newGame' | 'joinGame'
}

export class Home extends Component<{}, HomeState> {
    constructor(props: {}) {
        super(props);
        this.state = {}
    }

    render() {
        return <Fragment>
            <div className="row">
                <div className="col"><h1 className="text-center">Q.E (Quantitative Easing)</h1></div>
            </div>

            <p className="lead">
                It's 2008 and the economy is crashing. You play as one of the largest nations in the world, and it is your job to save the economy by enacting QE (Quantitative Easing) measures and printing money to support collapsing companies.
            </p>

            <div className="card">
                <h3 className="card-header">
                    New game
                </h3>
                <div className="card-body">
                    <NewGameForm handleSubmit={(e) => this.submitNewGameForm(e)} submitting={this.state.submitting === 'newGame'}/>
                </div>
            </div>
        </Fragment>
    }

    private submitNewGameForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        this.setState({submitting: "newGame"});

        setTimeout(
            () => {
                this.setState({submitting: undefined});
            },
            2000
        )
    }
}

interface NameState {
    newGameName?: string,
    newPlayerName?: string,
}

interface NameProps {
    submitting: boolean
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

class NewGameForm extends Component<NameProps, NameState> {
    constructor(props: NameProps) {
        super(props);

        this.state = {};
    }


    render() {
        const icon = this.props.submitting ?
            <span className={"ml-1"}><FontAwesomeIcon icon={faSpinner} spin/></span> :
            null;


        return <form onSubmit={this.props.handleSubmit}>
            <div className="form-group">
                <label htmlFor="newGameName">Game name</label>
                <input
                    name="newGameName"
                    type="text"
                    className="form-control"
                    value={this.state.newGameName}
                    onChange={(e) => this.handleInputChange(e)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="newPlayerName">Your player name</label>
                <input
                    name="newPlayerName"
                    type="text"
                    className="form-control"
                    value={this.state.newPlayerName}
                    onChange={(e) => this.handleInputChange(e)}
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={this.props.submitting}>
                Create game
                {icon}
            </button>
        </form>;
    }

    handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
        const target = e.target;
        const value = target.value;
        const stateToSet: NameState = {};

        switch (target.name) {
            case 'newPlayerName':
                stateToSet.newPlayerName = value;
               break;
            case 'newGameName':
               stateToSet.newGameName = value;
               break;
            default:
                throw Error(`Unknown target ${target.name}`);
        }

        this.setState(stateToSet);
    }
}
