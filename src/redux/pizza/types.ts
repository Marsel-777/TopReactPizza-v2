export type Pizza = {
    id: string;
    title: string;
    info: string;
    price: number;
    price1: number;
    price2: number;
    imageUrl: string;
    sizes: number[];
    types: number[];
    rating: number;
}

export enum Status {
    LOADING = 'loading',
    SUCCESS = 'completed',
    ERROR = 'error',
}


export type SearchPizzaParams = {
    sortBy: string;
    order: string;
    category: string;
    search: string;
    currentPage: string;
}

export interface PizzaSliceState {
    items: Pizza[];
    status: Status;
}