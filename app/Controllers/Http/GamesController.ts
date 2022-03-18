import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import { CreateGame, UpdateGame } from 'App/Validators'

export default class GamesController {
  public async index({}: HttpContextContract) {
    const games = await Game.all()
    return games
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
    await request.validate(CreateGame)
    const game = await Game.create(data)

    return game
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params()
    const game = Game.findByOrFail('id', id)

    return game
  }

  public async update({ request }: HttpContextContract) {
    const { id } = request.params()
    const updated = request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
    await request.validate(UpdateGame)

    const game = await Game.findByOrFail('id', id)

    game.merge(updated)
    await game.save()

    return game
  }

  public async destroy({ request }: HttpContextContract) {
    const { id } = request.params()
    const game = await Game.findByOrFail('id', id)

    await game.delete()

    return 'Game has been deleted'
  }
}
