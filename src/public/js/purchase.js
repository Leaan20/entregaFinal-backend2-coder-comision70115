

// Lógica para limpiar el carrito
document.querySelector('.cleanCart').addEventListener('click', async () => {
    const { value: confirm } = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará todos los productos de tu carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, limpiar carrito!'
    });

    if (confirm) {
        try {
            // Obtener el `cartId` del atributo `data-cart-id` en el DOM
            const cartId = document.querySelector('.cartContainer').getAttribute('data-cart-id');

            if (!cartId) {
                throw new Error('No se encontró el ID del carrito.');
            }

            // Petición DELETE al backend utilizando el `cartId`
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                Swal.fire('Carrito Limpiado!', 'Todos los productos han sido eliminados.', 'success');
                document.querySelector('.cartContainer').innerHTML = '<p>El carrito está vacío.</p>';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al limpiar el carrito.');
            }
        } catch (error) {
            Swal.fire('Error!', error.message, 'error');
        }
    }
});

// Lógica para finalizar la compra
document.querySelector('.buyCart').addEventListener('click', async () => {
    try {
        // Obtener el `cartId` desde el DOM (atributo `data-cart-id`)
        const cartId = document.querySelector('.cartContainer').getAttribute('data-cart-id');

        if (!cartId) {
            throw new Error('No se encontró el ID del carrito.');
        }

        // Confirmación de la compra
        const { value: confirm } = await Swal.fire({
            title: '¿Estás listo para comprar?',
            text: "Asegúrate de que tu carrito esté correcto.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, comprar!'
        });

        if (confirm) {
            // Hacer la solicitud de compra
            const purchaseResponse = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Para asegurarse de que las cookies se envían
            });

            if (purchaseResponse.ok) {
                const result = await purchaseResponse.json();
                // Redirigir a la página del ticket usando el código del ticket
                window.location.href = `/ticket/${result.purchaseTicket.code}`;
            } else {
                const result = await purchaseResponse.json();
                if (result.outStockProducts) {
                    Swal.fire({
                        title: 'Error!',
                        text: `No hay suficiente stock para: ${result.outStockProducts.map(p => p.product.name).join(', ')}`,
                        icon: 'error'
                    });
                } else {
                    Swal.fire('Error!', result.message, 'error');
                }
            }
        }
    } catch (error) {
        console.error("Error al intentar realizar la compra:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar realizar la compra. Por favor, intenta nuevamente más tarde.',
            icon: 'error'
        });
    }
});