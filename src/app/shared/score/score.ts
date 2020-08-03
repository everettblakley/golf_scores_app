import { Resource, Serializer } from "../genericHttpService";

export class Score extends Resource {
    public course: string;
    public grossScore: number;
    public createdAt: string;
    public scoreDate: string;
    public slope: number;
    public rating: number;
    public conditions: string;
    public tees: string;
    // Default number of holes is 18
    public holes: number = 18;
}

export class ScoreSerializer implements Serializer {
    fromJson(json: any): Score {
        const score = new Score();
        score.id = json.id;
        score.course = json.course;
        score.createdAt = json.createdAt;
        score.scoreDate = json.scoreDate;
        score.slope = json.slope;
        score.rating = json.rating;
        score.conditions = json.conditions;
        score.tees = json.tees;
        score.holes = json.holes;

        return score;
    }
    toJson(resource: Score) {
        return {
            id: resource.id,
            course: resource.course,
            createdAt: resource.createdAt,
            scoreDate: resource.scoreDate,
            slope: resource.slope,
            rating: resource.rating,
            conditions: resource.conditions,
            tees: resource.tees,
            holes: resource.holes,
        };
    }
}
