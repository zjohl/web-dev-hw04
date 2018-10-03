// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";
import $ from "jquery";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket";
import game_init from "./memory";

// The js below is taken  from nat's lecture notes

function form_init() {
    let channel = socket.channel("games:demo", {});
    channel.join()
        .receive("ok", resp => { console.log("Joined successfully", resp) })
        .receive("error", resp => { console.log("Unable to join", resp) });

    $('#game-button').click(() => {
        let xx = $('#game-input').val();
        window.gameName = xx;
        window.location.href='/game/' + xx;
    });
}

function start() {
    let root = document.getElementById('root');
    if (root) {
        let channel = socket.channel("games:" + window.gameName, {});
        game_init(root, channel);
    }

    if (document.getElementById('game-input')) {
        form_init();
    }
}

$(start);

