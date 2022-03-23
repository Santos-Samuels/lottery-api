import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import { ResetPasswordValidator } from 'App/Validators'
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
}
