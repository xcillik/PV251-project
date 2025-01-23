export type Record = {
    categoryId: number;
    amount: number;
    createdAt: Date;
};

export type Category = {
    id: number;
    visible: boolean;
};

export type Period = {
    monthIndex: number;
    year: number;
};
