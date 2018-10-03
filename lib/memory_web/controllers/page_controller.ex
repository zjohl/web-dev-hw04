defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def game(conn, params) do
    render conn, "game.html", game: params["game"]
  end

  def index(conn, _params) do
    render conn, "index.html"
  end
end
