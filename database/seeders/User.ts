import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const uniqueKey = 'email'

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'teste@teste.com',
        password: 'secret'
      },
      {
        email: 'teste2@teste.com',
        password: 'secret2'
      },
      {
        email: 'teste3@teste.com',
        password: 'secret3'
      },
    ])
  }
}
