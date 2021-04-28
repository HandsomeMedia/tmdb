function dateInRange(target, range) {
  console.log(target, range)
  const targetDate = new Date(target)
  const startDate = new Date(range[0])
  const endDate = new Date(range[1])

  if (startDate < targetDate && targetDate < endDate) return true

  return false
}

function arrayItemMatch(arr1, arr2) {
  return arr1.some(item => arr2.includes(item))
}

export { dateInRange, arrayItemMatch }
