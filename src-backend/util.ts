export function summaryName(name:string): string[] {
  name = name.replace('_','-')
  return name.split('-').map(word => hashNameSegment(word))
}

export function hashNameSegment(segment:string): string {
  let result = segment.toLowerCase()
  if (['cdn','cod','cdd','cd','nr'].includes(result))
      result = 'cd'
  return result
}

export function compareNames(segmentPK:string[],segmentCompare:string[]): boolean {
  if (segmentPK.length > segmentCompare.length)
      return false
  let result = true
  for (let i = 0; i < segmentPK.length; i++) {
      const element1 = segmentPK[i]
      const element2 = segmentCompare[i]
      if (!compareSegments(element1,element2))
          result = false
  }
  return result
}

export function compareSegments(segment1:string,segment2:string): boolean {
  let size = Math.min(segment1.length,segment2.length)-1
  let s1 = segment1.substring(0,size).toLowerCase()
  let s2 = segment2.substring(0,size).toLowerCase()
  return (s1 == s2)
}