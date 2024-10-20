// obtenemos el cid del cart del usuairo logueado
fetch("/api/carts/user/cart", {
    method: "GET",
    credentials: "include"
})
.then(response => {
    if(!response.ok){
        throw new Error("Error al obtener el id del carrito");
    }
    return response.json();
})
.then(data => {
    const cid = data.cid;

    // anadir evento a los botones
    const button = document.querySelectorAll(".btn");
    console.log(button);

    button.forEach(button => {
        button.addEventListener("click", function() {
            const pid = this.getAttribute('data-product-id');
            const quantityInput =  document.getElementById(`quantity-${pid}`);

            const quantity = parseInt(quantityInput.value);


            addToCart(cid, pid, quantity);

            console.log(pid);
            
        })
    })
}).catch(error => {console.log("Error al obtener el id del carrito", error);
});


function addToCart(cid, pid, quantity){
    fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({quantity: quantity}),
        credentials: 'include'

    })
    .then(response => {
        if(!response.ok){
            throw new Error("Error al agregar al carrito");
        }

        return response.json();
    })
    .then(data => {
        console.log("Producto agregado al carrito: ", data);

    })
    .catch(error => {
        console.log(`Error: ${error}`);
        
    });

};