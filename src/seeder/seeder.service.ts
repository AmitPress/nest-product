import { Injectable } from '@nestjs/common';
import { faker  } from '@faker-js/faker';
import { DbService } from '../db/db.service';

// helper function to pick random elements
const pickRandomly = (collection: any[]): any[] => {
    let picked : any[] = [];
    const randomSize = Math.floor(Math.random() * (4 - 2 + 1)) + 2; // here I could use faker as well but I kept it raw
    for(let i=0; i < randomSize - 1; i += 1){ // one element is adjusted bcz one redundant will always be inserted for the first index
        const randomIndex = Math.floor(Math.random() * (collection.length - 1 - 0 + 1)) + 0;
        if( i == 0 ){ // this is to confirm that there are always to same element
          picked.push(collection[randomIndex])
          picked.push(collection[randomIndex])
        }else{
          picked.push(collection[randomIndex])
        }
    }
    return picked;
}

const createUniqueIdGenerator = () => {
    const history = new Set<number>();
  
    return (): number => {
        if (history.size >= 8196) throw new Error('All possible IDs have been used.');

        let tempId: number;
        do {
            tempId = faker.number.int({ min: 1, max: 8196 });
        } while (history.has(tempId));

        history.add(tempId);
        return tempId;
    };
};

const nMonthBackDate = (n: number) : Date => {
    const now = new Date();
    const smb = now.getMonth() - n - 1;
    const date_smb = now.setMonth(smb);
    return new Date(date_smb);
}
const getRandomDateFromRange = () => {
    const history = new Set<Date>();
  
    return (from: Date, to: Date): Date => {
        if (history.size >= 8196) throw new Error('All possible IDs have been used.');

        let tempDate: Date;
        do {
            tempDate = faker.date.between({from, to});
        } while (history.has(tempDate));

        history.add(tempDate);
        return tempDate;
    };
}

@Injectable()
export class SeederService {
    private users : User[] = []
    private products: Product[] = []
    private orders : Order[] = []
    private genId = createUniqueIdGenerator();
    private genDate = getRandomDateFromRange();
    constructor(private readonly db: DbService){}


    async isNotAlreadyPopulated(): Promise<boolean>{
        const query = `
        select count(*) as cnt
        from users
        `
        const result = await this.db.query<any>(query);
        return result.rows[0].cnt == 0
    }
    // user does not depend on any other table
    async populateUsers(numberOfUsers: number = 10) {
        const ids : number[] = []
        for(let i = 0; i < numberOfUsers; i+=1){
            const id = this.genId()
            const name = faker.person.fullName()
            const email = faker.internet.email()
            const password = faker.internet.password()
            this.users.push({id, name, email, password})

            const query = `
            insert into users values (
                $1, $2, $3, $4
            );
            `
            await this.db.query<User>(query, [id, name, email, password])
        }
        console.log("Populated Users Successfully.....")
    }
    // like user it also does bnot depend on any other table
    async populateProducts(numberOfProducts: number = 20) {
        for(let i = 0; i < numberOfProducts; i+=1){
            const id = this.genId()
            const name = faker.commerce.productName();
            const price = parseInt(faker.commerce.price());
            this.products.push({id, name, price})
            const query = `
            insert into products values (
                $1, $2, $3
            );
            `
            await this.db.query<User>(query, [id, name, price])
        }
        console.log("Populated Products Successfully.....")
    }
    // unlike above two, this one does depend on user
    async populateOrderEntryForeachUser(numberOfOrders: number = 5) {
        const sixMonthBefore = nMonthBackDate(6);
        for(const user of this.users){
            for(let i = 0; i < numberOfOrders; i+=1){
                const id = this.genId()
                const userId = user.id;
                const createdAt = this.genDate(sixMonthBefore, new Date());
                const totalAmount = 0;
                this.orders.push({id, userId, createdAt, totalAmount})
                const query = `
                insert into orders values (
                    $1, $2, $3, $4
                );
                `
                await this.db.query<User>(query, [id, userId, createdAt, totalAmount])
            }
        }
        console.log("Populated Orders Successfully.....")
    }
    // and this one depends on all the above ones directly and indirectly
    async populateOrderItemsForeachOrder() {
        for(const order of this.orders) {
            // order specific update params
            let totalAmount : number = order.totalAmount;
            // get 2 - 4 products where one product will be repeated twice
            const products : Product[] = pickRandomly(this.products);
            for(let i = 0; i < products.length; i += 1){ // for each product an orderitem will be registered
                const id = this.genId()
                const orderId = order.id;
                const productId = products[i].id;
                const quantity = faker.number.int({min: 1, max: 3});
                const price = products[i].price;
                // update totalAmount of the Order
                totalAmount += price * quantity;

                const query = `
                insert into order_items values (
                    $1, $2, $3, $4, $5
                );
                `
                await this.db.query<OrderItem>(query, [id, orderId, productId, quantity, price])

            }
            const query = `
            update orders
            set total_amount = $2
            where id = $1
            `
            await this.db.query(query, [order.id, totalAmount])

        }
        console.log("Seeding Completed Successfully.....")
    }
    
}
