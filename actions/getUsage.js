import Usages from "@/utils/Models/Usages"

export default async function getUsage(userId) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime().toString()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime().toString()

  const results = await Usages.find({
    userId,
    dateTime: {
      $gte: startOfMonth,
      $lt: endOfMonth
    }
  })

 return {
    videoAndAudio: results.filter(u => u.type === "video" || u.type === "audio").length,
    documents: results.filter(u => u.type === "document").length,
    questions: results.filter(u => u.type === "questions").length,
    messages: results.filter(u => u.type === "message").length,
    seconds: results.reduce((sum, entry) => sum + parseFloat(entry.seconds), 0), 
    cost: results.reduce((sum, entry) => {
      if (entry.cost !== undefined) return sum + parseFloat(entry.cost)     
      return sum
    }, 0)
  }
}