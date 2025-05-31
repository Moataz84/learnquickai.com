const { createServer } = require("http")
const next = require("next")
const { Server } = require("socket.io")
const { writeFileSync, readFileSync, existsSync, unlinkSync } = require("fs")
const { join } = require("path")
const { randomBytes } = require("crypto")

const dev = process.env.ENV === "development"
const app = next({ dev })
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

  function startGame(gameId, duration, qInterval) {
    let time = (duration * 60)
    writeGameData(gameId, { started: true, interval: qInterval })
    io.to(gameId).emit("game-started", {users: readGameData(gameId).users, time, interval: qInterval})
    time--
    const interval = setInterval(() => {
      if (time < 0) {
        clearInterval(interval)

        const gameFile = join(__dirname, `/temp/game_${gameId}.json`)
        let scores = []

        if (existsSync(gameFile)) {
          try {
            scores = readGameData(gameId).users
          } catch (err) {
            console.error("Error reading game data:", err)
          }

          try {
            unlinkSync(gameFile)
          } catch (err) {
            console.error("Error deleting game file:", err)
          }
        } else {
          console.warn("Game file already deleted.")
        }

        io.to(gameId).emit("game-ended", scores)

        // Clean up sockets
        const room = io.sockets.adapter.rooms.get(gameId)
        if (room) {
          for (const socketId of room) {
            const socket = io.sockets.sockets.get(socketId)
            socket?.leave(gameId)
          }
        }
      } else {
        io.to(gameId).emit("time", time)
        const gameFile = join(__dirname, `/temp/game_${gameId}.json`)
        if (existsSync(gameFile)) {
          try {
            const scores = readGameData(gameId).users
            io.to(gameId).emit("score", scores)
          } catch (err) {
            console.error("Error reading scores for emit:", err)
          }
        }
        time--
      }
    }, 1000)
  }

  io.on("connection", socket => {
    console.log("Client connected:", socket.id)

    socket.on("user-id", data => {
      socket.name = data.name
      socket.userId = data.userId
    })

    socket.on("init-game", promptId => {
      const gameId = randomBytes(3).toString("hex")
      socket.join(gameId)
      writeGameData(gameId, {gameId, started: false, createdBy: socket.userId, users: [{id: socket.userId, name: socket.name, score: 0}], promptId})
      io.to(gameId).emit("player-joined", 1)
      socket.emit("send-game-link", gameId)
    })

    socket.on("player-join", ({promptId, gameId}) => {
      const room = io.sockets.adapter.rooms.get(gameId)
      const exists = room !== undefined && room.size > 0
      
      if (!exists) return socket.emit("no-lobby")
      const data = readGameData(gameId)
      if (data.promptId !== promptId) return socket.emit("no-lobby")
      if (data.users.map(u => u.id).includes(socket.userId)) {
        return socket.emit("no-lobby")
      }
      writeGameData(gameId, {gameId, users: [...data.users, {id: socket.userId, name: socket.name, score: 0}]})
      socket.join(gameId)
      socket.emit("joined-game")
      io.to(gameId).emit("player-joined", room.size)
      if (data.started) socket.emit("game-started", {interval: data.interval, users: data.users, time: 300})
    })

    socket.on("start-game", data => {
      startGame(data.gameId, data.duration, data.interval)
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
          if (data.createdBy === socket.userId && !data.started) {
            startGame(room, 5, 7)
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
