const socket = io()

const roomId = window.location.pathname.split('/')[2]

const username = generateName()

socket.emit('joinRoom', {username, roomId})

socket.on('getOtherPlayers', (users) => {
  // Add in the other players
  console.log(users)

  const players = document.querySelector('.players')
  players.innerHTML = ''

  var users = users.filter(user => user.socketId != socket.id)
  users.forEach(user => {
    console.log(user)
    var div = document.createElement('div')
    div.innerHTML = `
      <div class="player-slot">
        <div>${user.username}</div>
        <canvas class="board board-${user.socketId}" width="100" height="200"></canvas>
      </div>
    `
    players.appendChild(div)
  })
})

socket.on('message', (msg) => {
  console.table(msg)
})
