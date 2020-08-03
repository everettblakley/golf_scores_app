export class Score {
    constructor(
        public id: number,
        public course: string,
        public grossScore: number,
        public createdAt: string,
        public scoreDate: string,
        public slope: number,
        public rating: number,
        public conditions: string,
        public tees: string,
        // Default number of holes is 18
        public holes: number = 18
    ) {}
}
