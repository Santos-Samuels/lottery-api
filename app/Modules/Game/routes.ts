import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.post('/create', 'GamesController.store')
      Route.put('/update', 'GamesController.update')
      Route.delete('/delete', 'GamesController.destroy')
    }).middleware('auth')
  }).prefix(':id')

  Route.get('/', 'GamesController.index')
}).prefix('games')