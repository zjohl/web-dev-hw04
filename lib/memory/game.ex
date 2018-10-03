defmodule Memory.Game do
  # I used Nat"s lectures notes as a reference for this assignment


  # Things to keep track of:
  # numClicks: 0,
  # visibleTiles: {},
  # inactiveTiles: {},
  #
  # array of tiles {index, value}


  def new do
    %{
      tiles: new_game(),
      numClicks: 0,
      visibleTiles: [],
      inactiveTiles: [],
    }
  end

  def client_view(game) do
    %{
      tiles: game.tiles,
      numClicks: game.numClicks,
      visibleTiles: game.visibleTiles,
      inactiveTiles: game.inactiveTiles,
    }
  end

  def get_tile(game, index) do
    Enum.find(game.tiles, fn tile ->
      index == tile.index
    end)
  end

  def visible_tiles(game, index) do
    if Enum.empty?(game.visibleTiles) do
      get_tile(game, index)
    end
  end

  def click(game, index) do
    if index >= 16 || index < 0 do
      raise "That's not a real tile"
    end

    Map.put(game, :numClicks, game.numClicks + 1)
  end

  def new_game do
    pos_vals = ["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"]

    vals = Enum.shuffle(pos_vals)
    vals_index = Enum.with_index(vals)

    Enum.map vals_index, fn {val, i} ->
      %{
        index: i,
        value: val,
      }
    end
  end

end