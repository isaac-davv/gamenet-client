import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es
  })
}

export default formatDate