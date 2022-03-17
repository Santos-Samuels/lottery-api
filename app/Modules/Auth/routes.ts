import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'AuthController.show')
    Route.delete('/delete', 'AuthController.destroy')
    Route.put('/update', 'AuthController.update')
  }).middleware('auth')
  
  Route.post('/signup', 'AuthController.store')
  Route.post('/signin', 'AuthController.index')
}).prefix('user')