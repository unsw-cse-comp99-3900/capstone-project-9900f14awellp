api传到后端的内容：

1. invoice detail部分：subject发票标题，invoice number发票号码（invoice-info接口中返回的invoice_number字段），invoice date，paydue，currency（前端只会返回au）
2. 用户所在公司detail部分：公司名字，公司地址，公司abn，公司email
3. 客户所在公司detail部分：公司名字，公司地址，公司abn，公司email
4. 产品部分：{unit price，quantity，gst，subtotal}（subtotal=unit price\*quantity）
5. 总价部分：total_gst, total_price, capital_total_price
6. 付款详情：bankname，BSB，Account Number，Account Name
7. Notes

   ```json
   {
   "uuid": "string",
   "invoice_name": "string",
   "invoice_num": "string"
   "issue_date": "2024-07-25",
   "due_date": "2024-07-25",
   "currency": "string",
   "my_company_name": "string",
   "my_address": "string",
   "my_ABN": "string",
   "my_email": "string"
   "client_company_name": "string",
   "client_address": "string",
   "client_ABN": "string",
   "client_email": "string"
   "bank_name": "string",
   "account_num": "string",
   "bsb_num": "string",
   "account_name": "string",
   "subtotal": "string",
   "gst_total": "string",
   "total_amount": "string",
   "note": "string",
   "orders": [
   { //这里是商品1
   "unit_price": "string",
   "quantity": 0,
   "gst": "string",
   "amount": "string",
   }
   { //这里是商品2
   "unit_price": "string",
   "quantity": 0,
   "gst": "string",
   "amount": "string",
   }
   ]
   }
   ```

其他问题：

1. 需要一个draft接口，可以存入未完成的发票
2. 需要一个download pdf接口，可以单独调用生成pdf功能并返回，不会在数据库中存入发票？
