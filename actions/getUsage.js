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

  return results.reduce((sum, entry) => sum + parseFloat(entry.seconds), 0)
}