export const parseOrderBy = (orderBy: string, validFields: string[]) => {
  const orders = orderBy
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .map(part => {
      const direction = part.startsWith('-') ? 'desc' : 'asc'
      const field = part.replace(/^[-+]/, '')
      return { field, direction }
    })
    .filter(({ field }) => validFields.includes(field))

  return orders
}
