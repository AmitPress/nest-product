import { Controller, Get, Header, Query, StreamableFile } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { Workbook } from 'exceljs';
import { createWriteStream } from 'fs';
@Controller('api')
export class ApiController {
    constructor(private readonly db : DbService){}

    @Get('/monthly-total-sales')
    async monthlyTotalSales(){
        const query = `
        SELECT 
            TO_CHAR(created_at, 'YYYY-MM') AS year_month,
            SUM(total_amount) AS total_sales
        FROM orders
        GROUP BY year_month
        ORDER BY year_month desc;
        `
        const result = await this.db.query<any>(query)
        return result.rows
    }
    @Get('/per-month-user-sale')
    async perMonthUserSale(@Query() queries: any){
        const query = `
        select u.name as username, count(*) as total_orders, sum(total_amount) as total_spending
        from order_items oi
            left join orders o
            on oi.order_id = o.id
            left join users u
            on o.user_id = u.id
            left join products p
            on oi.product_id = p.id
        where to_char(o.created_at, 'YYYY-MM') = $1
        group by u.name
        order by total_orders desc
        `
        const result = await this.db.query<any>(query, [queries.year_month])
        return {
            forMonth: queries.year_month,
            sales: result.rows
        }
    }
    
    @Get("/most-ordered-product-of-each-month")
    async mostOrderedProductOfTheMonth(){
        const query = `
        select distinct on ( year_month )
            to_char(o.created_at, 'YYYY-MM') as year_month,
            p.username as product,
            sum(quantity) as sold_unit_quantity
        from order_items oi
            left join orders o
            on oi.order_id = o.id
            left join products p
            on oi.product_id = p.id
        group by year_month, p.username
        order by year_month, sold_unit_quantity desc
        `
        const result = await this.db.query<any>(query)
        return result.rows
    }

    @Get('/download-monthly-sales')
    @Header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    @Header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    async downloadMonthlySales(@Query() queries: any){
        const workbook = new Workbook()
        const worksheet = workbook.addWorksheet(`${queries.year_month}-report`)
        worksheet.columns = [
            {header: 'Product', key: 'product', width: 20},
            {header: 'Price', key: 'price', width: 20},
        ]
        const query = `
        select 
            p.username as Product, 
            p.price as Price
        from order_items oi
            left join orders o
            on oi.order_id = o.id
            left join products p
            on oi.product_id = p.id
        where to_char(o.created_at, 'YYYY-MM') = $1
        `
        const result = await this.db.query<any>(query, [queries.year_month])
        // console.log(result.rows); // this was for debugging
        worksheet.addRows(result.rows);
        const buffer = await workbook.xlsx.writeBuffer()
        return new StreamableFile(buffer as Uint8Array)
    }

}
