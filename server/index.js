const cors = require('cors')
const express = require('express')
const stripe = require("stripe")("sk_test_51JSZyxSFYy0xhcrcI84qJUlZCBqyeTAiVXwiVskDo5M1abJybf48UxD4yjUzHOqiVHDSFbVvPdmqKsopKN2Dj2xt00hB2aO8nt")
const { v4: uuid } = require('uuid')

const app = express()


//middleware
app.use(express.json())
app.use(cors())

//routes
app.get('/', (req, res) => {
    res.send("IT works")
})

app.post('/payment', (req, res) => {

    const { product, token } = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price)
    const idempotencyKey = uuid()

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'USD',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempotencyKey })
    })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err))

})



app.listen(8282, () => {
    console.log("App is listening at port 8282")
})