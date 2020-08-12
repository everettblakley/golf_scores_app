import { Resource, Serializer } from "../genericFirebaseService";
import * as moment from "moment";
import { FirebaseHttpMetric } from "nativescript-plugin-firebase/performance/performance";

export class Score extends Resource {
    public course: string;
    public grossScore: number;
    public createdAt: moment.Moment;
    public scoreDate: moment.Moment;
    public slope: number;
    public rating: number;
    public conditions: string;
    public tees: string;
    // Default number of holes is 18
    public holes: number = 18;
    public id: string;
    public ownerId: string;

    constructor() {
        super();
        this.id = undefined;
        this.course = "";
        this.grossScore = 0;
        this.scoreDate = moment();
        this.createdAt = moment();
        this.slope = 0;
        this.rating = 0;
        this.conditions = "";
        this.tees = "";
        this.holes = 18;
        this.ownerId = undefined;
    }
}

export class ScoreSerializer implements Serializer {
    fromJson(json: any): Score {
        const score = new Score();
        score.id = json.id;
        score.course = json.course;
        score.createdAt = moment(json.createdAt);
        score.scoreDate = moment(json.scoreDate);
        score.slope = json.slope;
        score.rating = json.rating;
        score.conditions = json.conditions;
        score.tees = json.tees;
        score.holes = json.holes;
        score.grossScore = json.grossScore;
        score.ownerId = json.ownerId;

        return score;
    }
    toJson(resource: Score) {
        return {
            id: resource.id,
            course: resource.course,
            createdAt: resource.createdAt.toISOString(),
            scoreDate: resource.scoreDate.toISOString(),
            slope: resource.slope,
            rating: resource.rating,
            conditions: resource.conditions,
            tees: resource.tees,
            holes: resource.holes,
            grossScore: resource.grossScore,
            ownerId: resource.ownerId,
        };
    }
}
