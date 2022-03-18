import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import { CreateGame, UpdateGame } from 'App/Validators'

export default class GamesController {
  public async index({}: HttpContextContract) {
    const games = await Game.all()
    return games
  }

  public async store({ request }: HttpContextContract) {
    const game = request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
    await request.validate(CreateGame)
    await Game.create(game)

    return game
  }

  public async update({request}: HttpContextContract) {
    const { gameId } = request.params()
    const updated = request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
    await request.validate(UpdateGame)

    const game = await Game.findBy('id', gameId)

    if (!game) {
      return 'Game not found'
    }

    game.merge(updated)
    await game.save()

    return game
  }

  public async destroy({ request }: HttpContextContract) {
    const { gameId } = request.params()
    const game = await Game.findBy('id', gameId)

    if (!game) {
      return 'Game not found'
    }

    await game.delete()

    return 'Game has been deleted'
  }
}
