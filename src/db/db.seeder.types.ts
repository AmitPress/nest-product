interface User{
    id: number,
    name: string,
    email: string,
    password: string
}

interface Product{
    id: number,
    name: string,
    price: number
}

interface Order{
    id: number,
    userId: number,
    createdAt: Date,
    totalAmount: number
}

interface OrderItem{
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    price: number
}