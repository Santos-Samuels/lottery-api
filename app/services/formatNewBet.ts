import { choosen, IBetsToSave } from 'App/Controllers/Http/BetsController'
import Game from 'App/Models/Game'

export const formatNewBet = async (game: choosen, user_id: number): Promise<IBetsToSave> => {
  const gameRule = await Game.findByOrFail('id', game.game_id)
 
  const formatedGame =  {
    game_id: game.game_id,
    choosen_numbers: game.choosen_numbers.toLocaleString(),
    price: gameRule.price,
    user_id,
  }

  return formatedGame
}
