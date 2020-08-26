import { Score } from "./score";
import { SortMethod, SortOption } from "../utils/utilTypes";
import * as moment from "moment";

export const sortScores = (scores: Score[], options: SortOption): Score[] => {
  let sortedScores: Score[] = scores;

  switch (options.method) {
    case SortMethod.DATE_ASC:
      sortedScores = scores.sort((a: Score, b: Score) => {
        const aDate = moment(a.scoreDate);
        const bDate = moment(b.scoreDate);
        return aDate.isAfter(bDate, "day")
          ? 1
          : aDate.isBefore(bDate, "day")
            ? -1
            : 0;
      })
      break;
    case SortMethod.DATE_DESC:
      sortedScores = scores.sort((a: Score, b: Score) => {
        const aDate = moment(a.scoreDate);
        const bDate = moment(b.scoreDate);
        return aDate.isBefore(bDate, "day")
          ? 1
          : aDate.isAfter(bDate, "day")
            ? -1
            : 0;
      })
      break;
    case SortMethod.SCORE_ASC:
      sortedScores = scores.sort((a: Score, b: Score) => {
        return a.grossScore > b.grossScore
          ? 1
          : a.grossScore < b.grossScore
            ? -1
            : 0;
      })
      break;
    case SortMethod.SCORE_DESC:
      sortedScores = scores.sort((a: Score, b: Score) => {
        return a.grossScore < b.grossScore
          ? 1
          : a.grossScore > b.grossScore
            ? -1
            : 0;
      })
      break;
    case SortMethod.COURSE_ASC:
      sortedScores = scores.sort((a: Score, b: Score) => {
        return a.course < b.course
          ? 1
          : a.course > b.course
            ? -1
            : 0;
      });
    case SortMethod.COURSE_DESC:
      sortedScores = scores.sort((a: Score, b: Score) => {
        return a.course > b.course
          ? 1
          : a.course < b.course
            ? -1
            : 0;
      });
    default:
      break;
  }

  return sortedScores;
}