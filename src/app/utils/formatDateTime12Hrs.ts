export const formatDateTime12Hour = (timestamp: number | undefined) => {
    if (!timestamp) {
      return
    }
    console.log("timestamp",timestamp)
    const date = new Date(timestamp * 1000)
    console.log("date",date)
    const year = date.getFullYear()
    console.log("year",year)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    let hours = date.getHours()
    console.log("hrs",hours)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    
    // Convert to 12-hour format
    hours = hours % 12
    hours = hours ? hours : 12 // 0 should be 12
    
    const hoursStr = String(hours).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hoursStr}:${minutes} ${ampm}`
  }