export interface ProductType {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    rating: {
        rate: number;
        count: number;
    };
}
