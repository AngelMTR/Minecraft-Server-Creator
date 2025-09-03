async function getProduct() {
    const products = await fetch('http://localhost:5000/products')
    return await products.json()
}

async function getProductById(id) {
    const products = await fetch(`http://localhost:5000/products/${id}`)
    return await products.json()
}

getProduct().then(result => {
    console.log(result)
})

getProductById(10).then(result => {
    console.log(result)
})
