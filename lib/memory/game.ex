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
    clicked_tile = get_tile(game, index)
    cond do
      (length(game.visibleTiles) == 2)->
        [clicked_tile]
      (length(game.visibleTiles) == 1) ->
        Enum.concat(game.visibleTiles, [clicked_tile])
      true ->
        [clicked_tile]
    end
  end

  def inactive_tiles(game, index) do
    if (length(game.visibleTiles) == 2) do
      visible_tile1 = Enum.at(game.visibleTiles, 0)
      visible_tile2 = Enum.at(game.visibleTiles, 1)

      if (visible_tile1.value == visible_tile2.value) do
        Enum.concat(game.inactiveTiles, [visible_tile1, visible_tile2])
      else
        game.inactiveTiles
      end
    else
      game.inactiveTiles
    end
  end

  def click(game, index) do
    if index >= 16 || index < 0 do
      raise "That's not a real tile"
    end

    new_game = Map.put(game, :numClicks, game.numClicks + 1)
    new_game = Map.put(new_game, :visibleTiles, visible_tiles(game, index))
    Map.put(new_game, :inactiveTiles, inactive_tiles(new_game, index))
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