import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Bet from 'App/Models/Bet'

export default class BetSeeder extends BaseSeeder {
  public async run () {
    await Bet.createMany([
      {
        id: 9,
        userId: 2,
        gameId: 3,
        choosenNumbers: "14,27,28,43,48",
        price: 2
      },
      {
        id: 10,
        userId: 2,
        gameId: 2,
        choosenNumbers: "19,39,49,50,51,55",
        price: 4.5
      },
      {
        id: 11,
        userId: 2,
        gameId: 1,
        choosenNumbers: "3,5,6,7,8,9,10,11,12,14,17,18,19,20,25",
        price: 2.5
      },
      {
        id: 12,
        userId: 2,
        gameId: 2,
        choosenNumbers: "6,14,28,33,44,47",
        price: 4.5
      },
      {
        id: 13,
        userId: 2,
        gameId: 2,
        choosenNumbers: "7,9,29,36,46,56",
        price: 4.5
      }
    ])
  }
}
