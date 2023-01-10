import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Table } from 'react-bootstrap'


function Shoping() {

  var options = {
    "key": "rzp_live_Ay9af2dQeUH8A6", // Enter the Key ID generated from the Dashboard
    "amount": "200", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Nilesh Nigade",
    "description": "Test Transaction",
    "image": "https://myupchar-banner.s3.ap-south-1.amazonaws.com/widget/avatar/doctor-avatar-male.png",
    "order_id": "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "callback_url": "",
    "prefill": {
        "name": "",
        "email": "",
        "contact": ""
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    },
    "handler": function (response){
      console.log(response);
      alert("success");
    }
};
  var rzp1 = new window.Razorpay(options);

  let [products, setProducts] = useState([]);
  let [total, setTotal] = useState(0);
  let [order, setOrder] = useState({
    name: "",
    email: "",
    mobileno: "",
    address: "",
    city: "",
    pincode: "",
    products: [],
    status: "pending"
  });

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((result) => {
      console.log(result.data);
      let myproducts = result.data.map((product, id) => {
        return { ...product, quantity: 0 }
      })
      setProducts(myproducts);
    })
  }, []);

  useEffect(() => {
    let total = 0;
    let orderproducts = [];
    products.forEach(product => {
      total += product.quantity * product.price;
      if (product.quantity > 0)
        orderproducts.push(product);
    });
    setTotal(total);
    document.getElementById("totalNav").innerHTML = total.toFixed(2);
    setOrder({ ...order, products: orderproducts });
  }, [products]);

  function increment(product, e) {
    e.preventDefault();

    let myproducts = products.map((prod, i) => {
      if (prod.id === product.id)
        prod.quantity++;

      return prod;
    });
    setProducts(myproducts);
  }

  function decrement(product, e) {
    e.preventDefault();
    let myproducts = products.map((prod, i) => {
      if (prod.id === product.id && prod.quantity > 0)
        prod.quantity--;

      return prod;
    });
    setProducts(myproducts);
  }

  function handleChange(e) {
    e.preventDefault();
    setOrder({ ...order, [e.target.id]: e.target.value });
  }

  function placeOrder(e) {
    e.preventDefault();
    if (total === 0) {
      alert("Please select product");
      return;
    }
    //Validation for all textboxes
    //Now callplace order API
    localStorage.setItem("order", JSON.stringify(order));
    //Now start payment

    options.prefill.name = order.name;
    options.prefill.email = order.email;
    options.prefill.contact = order.mobileno;
    options.amount = 200;// total * 100;
    rzp1 = new window.Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed', function (response){
      console.log(response.error);
      alert("Failed");
    });
  }


  return (
    <div>
      <Container>
        <div style={{ height: "400px", overflowY: "scroll" }}>
          <Table className='mt-3' size="lg">
            <thead className='text-align-left'>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Description</th>
                <th>Price</th>
                <th colSpan={4} scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {
                products.map((product, i) => {
                  return (
                    <tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td>< img src={product.image} style={{ height: "100px" }} /></td>
                      <td>{product.title}</td>
                      <td>{product.price.toFixed(2)}</td>
                      <td><Button className='btn btn-danger' onClick={(e) => { decrement(product, e) }}>-</Button></td>
                      <td> {product.quantity} </td>
                      <td><Button className='btn btn-success' onClick={(e) => { increment(product, e) }}>+</Button></td>
                      <td>{(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </div>
        <div className='row'>
          <div className='col-lg-12'>
            Total : {total.toFixed(2)}
          </div>
          <div className='col-lg-4'>
            Name <input className='form-control' id="name" onChange={(e) => { handleChange(e) }} type="text" />
          </div>
          <div className='col-lg-4'>
            Email <input type="email" id="email" onChange={(e) => { handleChange(e) }} className='form-control' />
          </div>
          <div className='col-lg-4'>
            Mobile No <input type="text" id="mobileno" onChange={(e) => { handleChange(e) }} className='form-control' />
          </div>
          <div className='col-lg-4'>
            Address<input type="text" id="address" onChange={(e) => { handleChange(e) }} className='form-control' />
          </div>
          <div className='col-lg-4'>
            City<input type="text" id="city" onChange={(e) => { handleChange(e) }} className='form-control' />
          </div>
          <div className='col-lg-4'>
            Pincode<input type="number" id="pincode" onChange={(e) => { handleChange(e) }} className='form-control' />
          </div>
          <button onClick={(e) => { placeOrder(e) }} className='btn btn-success'>Submit</button>
        </div>
      </Container>
    </div>
  )
}

export default Shoping
