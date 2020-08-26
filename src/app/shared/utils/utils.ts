import * as moment from "moment"

export const formatDate = (date: string, format: string): string => {
  return moment(date).format(format);
}

export const valueOrNull = (value: any) => (value !== undefined ? value : null);