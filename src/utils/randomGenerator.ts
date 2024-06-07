export const getRandomDate = (from: Date, to: Date) => {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
};

export const getRandomInt = (max: number) => {
    return Math.ceil(Math.random() * max);
};
