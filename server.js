const { createServer } = require("http")
const next = require("next")
const { Server } = require("socket.io")
const { writeFileSync, readFileSync, existsSync, unlinkSync } = require("fs")
const { join } = require("path")
const { randomBytes } = require("crypto")

const dev = process.env.ENV === "development"
const app = next({ dev: false })
const handle = app.getRequestHandler()
 
function readGameData(roomId) {
  const dataPath = join(__dirname, `/temp/game_${roomId}.json`)
  return JSON.parse(readFileSync(dataPath, "utf-8"))
}

function writeGameData(roomId, data) {
  const dataPath = join(__dirname, `/temp/game_${roomId}.json`)
  if (!existsSync(dataPath)) writeFileSync(dataPath, JSON.stringify({}))
  const d = readGameData(roomId)
  writeFileSync(dataPath, JSON.stringify({...d, ...data}))
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: process.env.NEXT_PUBLIC_ORIGIN
    },
  })

  function startGame(gameId) {
    writeGameData(gameId, {started: true})
    io.to(gameId).emit("game-started")
    let time = (4 * 60) - 1
    const interval = setInterval(() => {
      if (time < 0) {
        const scores = readGameData(gameId).users
        io.to(gameId).emit("game-ended", scores)
        const room = io.sockets.adapter.rooms.get(gameId)
        if (room) {
          for (const socketId of room) {
            const socket = io.sockets.sockets.get(socketId)
            socket?.leave(gameId)
          }
        }
        unlinkSync(join(__dirname, `/temp/game_${gameId}.json`))
        return clearInterval(interval)
      }
      io.to(gameId).emit("time", time)
      time--
    }, 1000) ////////
  }

  io.on("connection", socket => {
    console.log("Client connected:", socket.id)

    socket.on("user-id", data => {
      socket.name = data.name
      socket.userId = data.userId
    })

    socket.on("init-game", () => {
      const gameId = randomBytes(3).toString("hex")
      socket.join(gameId)
      writeGameData(gameId, {gameId, started: false, createdBy: socket.userId, users: [{id: socket.userId, name: socket.name, score: 0}]})
      io.to(gameId).emit("player-joined", 1)
      socket.emit("send-game-link", gameId)
    })

    socket.on("player-join", gameId => {
      const room = io.sockets.adapter.rooms.get(gameId)
      const exists = room !== undefined && room.size > 0
      if (!exists) return socket.emit("no-lobby")
      const data = readGameData(gameId)
      if (data.users.map(u => u.id).includes(socket.userId)) {
        return socket.emit("no-lobby")
      }
      writeGameData(gameId, {gameId, users: [...data.users, {id: socket.userId, name: socket.name, score: 0}]})
      socket.join(gameId)
      socket.emit("joined-game")
      io.to(gameId).emit("player-joined", room.size)
      if (data.started) socket.emit("game-started")
    })

    socket.on("start-game", gameId => {
      startGame(gameId)
    })

    socket.on("answer-selected", data => {
      const gameData = readGameData(data.gameId)
      if (gameData.users.find(user => user.id === data.user.id)) {
        writeGameData(data.gameId, {users: [...gameData.users.filter(user => user.id !== data.user.id), data.user]})
      } else {
        writeGameData(data.gameId, {users: [...gameData.users, data.user]})
      }
    })

    socket.on("disconnecting", () => {
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          const roomSize = io.sockets.adapter.rooms.get(room).size - 1
          if (roomSize === 0) {
            const filePath = join(__dirname, `/temp/game_${room}.json`)
            if (existsSync(filePath)) {
              return unlinkSync(filePath)
            }
          }
          const data = readGameData(room)
          if (data.createdBy === socket.userId) {
            io.to(room).emit("game-started")
            startGame(room)
          }
          writeGameData(room, {started: true, users: [...data.users.filter(user => user.id !== socket.userId)]})
          io.to(room).emit("player-joined", io.sockets.adapter.rooms.get(room).size - 1)
        }
      })
      console.log("Client disconnected:", socket.id)
    })
  })

  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  })
})
