import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const uniqueKey = 'email'

    await User.updateOrCreateMany(uniqueKey, [
      {
        name: 'teste',
        email: 'teste@teste.com',
        password: 'secret'
      },
      {
        name: 'teste',
        email: 'teste2@teste.com',
        password: 'secret2'
      },
      {
        name: 'teste',
        email: 'teste3@teste.com',
        password: 'secret3'
      },
    ])
  }
}
