import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.post('/create', 'GameController.store')
      Route.put('/update', 'GameController.update')
      Route.delete('/delete', 'GameController.destroy')
    }).middleware('auth')
  }).prefix(':id')

  Route.get('/', 'GameController.index')
}).prefix('games')