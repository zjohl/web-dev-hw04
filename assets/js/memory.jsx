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
            allowClicks: true,
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
        if(this.state.visibleTiles.length === 2) {
            this.setState({allowClicks: false});
            setTimeout(() => {
                this.setState({allowClicks: true, visibleTiles: []});
            }, 1000);
        }
    }

    canClick(clickedTile) {
        return this.state.allowClicks &&
        !_.find(this.state.inactiveTiles, tile => {return tile.index === clickedTile.index}) &&
        ! _.find(this.state.inactiveTiles, tile => {return tile.index === clickedTile.index})
    }

    onTileClick(clickedTile) {
        if (this.canClick(clickedTile)) {
            this.channel.push("click", { index: clickedTile.index}).receive("ok", this.receiveView.bind(this));
        }
    }

    restart() {
        this.channel.push("restart").receive("ok", this.receiveView.bind(this));
    }

    hasWon() {
        return this.state.inactiveTiles.size === this.state.numTiles;
    }

    findValue(index) {
        if(_.map(this.state.inactiveTiles, 'index').includes(index)) {
            return _.find(this.state.inactiveTiles, tile => {return tile.index === index})['value'];
        } else if (_.map(this.state.visibleTiles, 'index').includes(index)) {
            return _.find(this.state.visibleTiles, tile => {return tile.index === index})['value'];
        } else {
            return "?";
        }
    }

    renderTiles() {
        let tiles = [];
        for(let i = 0; i < this.state.numTiles; i++) {
            tiles = tiles.concat({
                active: !_.map(this.state.inactiveTiles, 'index').includes(i),
                visible: _.map(this.state.visibleTiles, 'index').includes(i),
                index: i,
                value: this.findValue(i),
            })
        }

        return _.map(tiles, tile => {
            let stateClass = tile.active ? "active" : "inactive";
            let visibleClass = tile.visible || !tile.active ? "" : " hidden";
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

