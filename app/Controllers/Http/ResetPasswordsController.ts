import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import { PasswordValidator, ResetPasswordValidator } from 'App/Validators'
import crypto from 'crypto'

export default class ResetPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    const { email, url } = await request.validate(ResetPasswordValidator)

    try {
      const user = await User.findByOrFail('email', email)
      user.token = crypto.randomBytes(10).toString('hex')
      user.tokenCreatedAt = DateTime.now()

      await user.save()

      await Mail.sendLater((message) => {
        message
          .from('saamsmith15@gmail.com')
          .to(user.email)
          .subject('Reset Password')
          .htmlView('emails/reset_password', {
            username: user.name,
            url: `${url}/?token="${user.token}`,
          })
      })
    } catch (error) {
      return response.notFound({ message: 'User not found' })
    }
  }

  public async changePassword({ request, response }: HttpContextContract) {
    const { password, token } = await request.validate(PasswordValidator)

    try {
      const user = await User.findByOrFail('token', token)

      const periodInSeconds = 1 * 60 * 60 // 1 hour:  1 hour *  60 minutes * 60 seconds

      if (user.token && user.tokenCreatedAt) {
        const isTokenExpired =
          DateTime.now().toSeconds() - user.tokenCreatedAt.toSeconds() > periodInSeconds

        if (isTokenExpired)
          return response.status(401).send({ error: { message: 'This token has expired' } })

        user.password = password
        user.token = null
        user.tokenCreatedAt = null
        await user.save()

        await Mail.sendLater((message) => {
          message
            .from('saamsmith15@gmail.com')
            .to(user.email)
            .subject('Reset Password')
            .htmlView('emails/password_changed', { username: user.name })
        })
      }

    } catch (error) {
      return response.status(409).send({ error: { message: 'Invalid token!' } })
    }
  }
}
