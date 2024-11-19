// // funcion para agregar al cart
// function addToCart(cid, pid, quantity){
//     fetch(`/api/carts/${cid}/products/${pid}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({quantity: quantity}),
//         credentials: 'include'

//     })
//     .then(response => {
//         if(!response.ok){
//             throw new Error("Error al agregar al carrito");
//         }

//         return response.json();
//     })
//     .then(data => {
//         console.log("Producto agregado al carrito: ", data);
//         return data;

//     })
//     .catch(error => {
//         console.log(`Error: ${error}`);
//         return Promise.reject(error);
        
//     });

// };

async function addToCart(cid, pid, quantity) {
    try {
        const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: pid, quantity: quantity })
        });

        // Verificamos si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al agregar al carrito');
        }
        // Obtenemos la respuesta en formato JSON
        const data = await response.json();
        console.log("Producto agregado al carrito:", data);
        return data;
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        throw error;
    }
}
    // obtenemos el carrito en el atributo del carrito
    const cid = document.querySelector("#dataCart").getAttribute("data-cart-id");
    console.log(cid);
    // añadir evento a los botones
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const pid = this.getAttribute('data-product-id');
            const quantityInput = document.getElementById(`quantity-${pid}`);
            const quantity = parseInt(quantityInput.value);
            const title = this.closest('.card').querySelector('h3').innerText; 

            console.log('cid:', cid);
            console.log('pid:', pid);

            addToCart(cid, pid, quantity)
            .then(() => {
                Swal.fire({
                    position: 'top-end',  // Posición del toast
                    icon: 'success',       // Tipo de alerta
                    title: `Producto "${title}" agregado al carrito.`,
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                    iconColor: '#fea',
                    background: '#003dff',
                    customClass: {
                        title: 'custom-title'
                    }
                });
            })
            .catch(error => {
                console.log("Error al agregar el producto al carrito", error);
            });
        });
    });












// // funcion para agregar al cart
// function addToCart(cid, pid, quantity){
//     fetch(`/api/carts/${cid}/products/${pid}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({quantity: quantity}),
//         credentials: 'include'

//     })
//     .then(response => {
//         if(!response.ok){
//             throw new Error("Error al agregar al carrito");
//         }

//         return response.json();
//     })
//     .then(data => {
//         console.log("Producto agregado al carrito: ", data);
//         return data;

//     })
//     .catch(error => {
//         console.log(`Error: ${error}`);
//         return Promise.reject(error);
        
//     });

// };



// // obtenemos el cid del cart del usuario logueado
// fetch("/api/carts/user/cart", {
//     method: "GET",
//     credentials: "include"
// })
// .then(response => {
//     if(!response.ok){
//         throw new Error("Error al obtener el id del carrito");
//     }
//     return response.json();
// })
// .then(data => {
//     const cid = data.cid;

//     // anadir evento a los botones
//     const button = document.querySelectorAll(".btn");

//     button.forEach(button => {
//         button.addEventListener("click", function() {
//             const pid = this.getAttribute('data-product-id');
//             const title = this.closest('.card').querySelector('h3').innerText;
//             const quantityInput =  document.getElementById(`quantity-${pid}`);
//             const quantity = parseInt(quantityInput.value);
            

//             addToCart(cid, pid, quantity)
//             .then(() => {
//                 Swal.fire({
//                     position: 'top-end',  // Posición del toast
//                     icon: 'success',       // Tipo de alerta
//                     title: `Producto "${title}" agregado al carrito.`,  // Mensaje
//                     showConfirmButton: false,  // No mostrar botón de confirmación
//                     timer: 3000,             // Tiempo en milisegundos para que desaparezca
//                     toast: true,        // Habilitar modo toast
//                     iconColor: '#ffffff',  // Cambia el color del icono
//                     background: '#007bff', // Cambia el color de fondo
//                 })
//             })
//             .catch(error => {
//                 console.log("Error al agregar el producto al carrito", error);
//             });
            
//         })
//     })
// }).catch(error => {console.log("Error al obtener el id del carrito", error);
// });


