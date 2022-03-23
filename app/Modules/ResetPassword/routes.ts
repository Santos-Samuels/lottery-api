import Route from '@ioc:Adonis/Core/Route'

Route.post('/reset-password', 'ResetPasswordsController.store')
Route.post('/change-password', 'ResetPasswordsController.changePassword')