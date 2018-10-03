import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

// This is based off of the hangman.jsx file that nat provided

export default function game_init(root, channel) {
    ReactDOM.render(<Memory channel={channel}/>, root);
}

class Memory extends React.Component {
    constructor(props) {
        super(props);

        this.channel = props.channel;

        this.state = {
            numTiles: 16,
            numClicks: 0,
            visibleTiles: [],
            inactiveTiles: [],
        };

        this.channel.join()
            .receive("ok", this.receiveView.bind(this))
            .receive("error", resp => { console.log("Unable to join", resp) });
    }

    receiveView(view) {
        this.setState(view.game);
    }

    onTileClick(tile) {
        this.channel.push("click", { index: tile.index}).receive("ok", this.receiveView.bind(this));
    }

    restart() {
        this.channel.push("restart").receive("ok", this.receiveView.bind(this));
    }

    hasWon() {
        return this.state.visibleTiles.size === this.state.numTiles;
    }

    renderTiles() {
        let tiles = [];
        for(let i = 0; i < this.state.numTiles; i++) {
            tiles = tiles.concat({
                active: !_(this.state.inactiveTiles).map(tile => {return tile.index}).includes(i),
                visible: _(this.state.inactiveTiles).map(tile => {return tile.index}).includes(i),
                index: i,
                value: "?",
            })
        }

        return _.map(tiles, tile => {
            let stateClass = tile.active ? "active" : "inactive";
            let visibleClass = tile.visible ? "" : " hidden";
            let classes = "tile " + stateClass + visibleClass;
            return <div key={tile.index} className={classes} onClick={() => this.onTileClick(tile)}><div className="tile-content">{tile.value}</div></div>;
        });
    }

    render() {
        return (
            <div className="game">
                {this.hasWon() ? <p>YOU WON !!!</p> : <p>Super Cool Memory Game</p>}
                <div className="tiles">
                    {this.renderTiles()}
                </div>
                <button className="restart-button" onClick={this.restart.bind(this)}>Restart</button>
                <p>Num Clicks: {this.state.numClicks}</p>
            </div>
        );
    }
}

