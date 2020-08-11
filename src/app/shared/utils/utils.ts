import * as moment from "moment"

export function formatDate(date: string, format: string): string {
  return moment(date).format(format);
}