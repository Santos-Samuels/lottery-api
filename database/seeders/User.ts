import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const uniqueKey = 'email'
    const permissionId = await Permission.findBy('name', 'player')

    await User.updateOrCreateMany(uniqueKey, [
      {
        name: 'teste',
        email: 'teste@teste.com',
        password: 'secret',
        permissionId: permissionId!.id
      },
      {
        name: 'teste',
        email: 'teste2@teste.com',
        password: 'secret2',
        permissionId: permissionId!.id
      },
      {
        name: 'teste',
        email: 'teste3@teste.com',
        password: 'secret3',
        permissionId: permissionId!.id
      },
    ])
  }
}
