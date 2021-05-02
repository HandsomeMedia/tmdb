import { dateInRange } from '../utils.js'

// TODO: Add more test coverage

describe('utils.js #dateInRange(target, range)', () => {
  it('returns true/false for target in/out of date range', () => {
    const result1 = dateInRange('2015-1-1', ['2014-1-1', '2016-1-1'])
    const result2 = dateInRange('2012-1-1', ['2014-1-1', '2016-1-1'])

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  it('handles open-ended range and returns true if range not provided', () => {
    const result1 = dateInRange('2015-1-1', ['2014-1-1', ''])
    const result2 = dateInRange('2015-1-1', ['', '2016-1-1'])
    const result3 = dateInRange('2018-1-1', ['', '2016-1-1'])
    const result4 = dateInRange('2015-1-1', ['', ''])

    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(result3).toBe(false)
    expect(result4).toBe(true)
  })
})
