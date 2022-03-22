import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'
import { SignupUser, SigninUser, UpdateUser } from 'App/Validators'
import { DateTime } from 'luxon'

export default class AuthController {
  public async index({ auth, request, response }: HttpContextContract) {
    const data = request.only(['email', 'password'])
    await request.validate(SigninUser)

    try {
      const user = await User.findBy('email', data.email)
      const token = await auth
        .use('api')
        .attempt(data.email, data.password, { expiresIn: '7days', name: user?.serialize().email })

      return { token, user }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password'])
    await request.validate(SignupUser)
    const existentUser = await User.findBy('email', data.email)
    const permission = await Permission.findByOrFail('name', 'player')

    if (existentUser) {
      return response
        .status(400)
        .json({ error: { message: 'There is already a user with this email' } })
    }

    const user = await User.create({ ...data, permissionId: permission!.id })
    const token = await auth.use('api').attempt(data.email, data.password, {
      expiresIn: '7days',
    })

    await Mail.send((message) => {
      message
        .from('saamsmith15@gmail.com')
        .to(user.email)
        .subject('Welcome!!!')
        .htmlView('emails/welcome', { username: user.name })
    })

    return { user, token }
  }

  public async show({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findOrFail(id)
    const recents_bets = await Bet.query()
      .select('*')
      .where('created_at', '<=', DateTime.now().toSQL())
      .where('created_at', '>', DateTime.now().minus({ days: 30 }).startOf('day').toSQL())

    return {user, recents_bets}
  }

  public async update({ auth, request, response }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)

    await request.validate(UpdateUser)
    const data = request.only(['name', 'email', 'password'])
    const existentUser = await User.findBy('email', data.email)

    if (existentUser) {
      return response
        .status(400)
        .json({ error: { message: 'There is already a user with this email' } })
    }

    user?.merge(data)
    await user?.save()

    return user
  }

  public async destroy({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findBy('id', id)
    await user?.delete()
    return 'User has been deleted'
  }
}
