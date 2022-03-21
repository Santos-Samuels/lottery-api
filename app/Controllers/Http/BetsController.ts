import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Cart from 'App/Models/Cart'
import Game from 'App/Models/Game'

export interface choosen {
  choosen_numbers: number[]
  game_id: number
}

export interface IBetsToSave {
  choosen_numbers: string
  user_id: number
  game_id: number
  price: number
}

export default class BetsController {
  public async index({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()

    const bet = await Bet.query().select().where('user_id', '=', id)

    return bet
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const data: { games: choosen[] } = request.only(['games'])
    const cart = await Cart.query().select('min_cart_value').first()

    const newBets: IBetsToSave[] = []
    let totalAmount: number = 0

    for (let i = 0; i < data.games.length; i++) {
      const gameRule = await Game.findByOrFail('id', data.games[i].game_id)
      
      if (data.games[i].choosen_numbers.length > gameRule.maxNumber || data.games[i].choosen_numbers.length < gameRule.maxNumber) {
        return response.status(400).json({
          error: {
            menssage: `This ${gameRule.type} only allows ${gameRule.maxNumber} numbers choosen`,
          },
        })
      }

      newBets.push({
        game_id: data.games[i].game_id,
        choosen_numbers: data.games[i].choosen_numbers.toLocaleString(),
        price: gameRule.price,
        user_id: id,
      })

      totalAmount += gameRule.price
    }

    if (totalAmount < cart!.minCartValue) {
      return response.badRequest({
        message: `The min cart value authorized is R$ ${cart?.minCartValue
          .toFixed(2)
          .replace('.', ',')}`
      })
    }

    await Bet.createMany(newBets)
    
    return newBets
  }
}
