import { useState } from "react";
import "./App.css";
import StripeCheckout from 'react-stripe-checkout'

function App() {
  const [product, setProduct] = useState({
    name: "React from facebook",
    price: 10,
    productBy: "facebook"
  })

  const makePayment = token => {
    const body = {
      token,
      product
    }
    const headers = {
      "Content-Type": "application/json"
    }

    return fetch(`http://localhost:8282/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }).then(response => {
      console.log(response)
      const { status } = response;
      console.log("Status", status)
    })
      .catch(err => {
        console.log(err)
      })

  }
  return (
    <div className="App">
      <StripeCheckout
        stripeKey={process.env.REACT_APP_KEY}
        token={makePayment}
        name="Buy React"
        amount={product.price * 100}
        shippingAddress
        billingAddress
      >
        <button className="btn btn-primary" >Buy the product at ${product.price}</button>
      </StripeCheckout>
    </div>
  );
}

export default App;
