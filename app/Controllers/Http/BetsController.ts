import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'

export default class BetsController {
  public async index({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()

    const bet  = await Bet.query().where('user_id', '=', id)

    return bet
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
