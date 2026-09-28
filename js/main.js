const contenedorCarrito = document.getElementById('contenedor-carrito');
const totalItemsHTML = document.getElementById('total-items');
const totalDineroHTML = document.getElementById('total-dinero');
const bannerAsincrono = document.getElementById('banner-asincrono');
const notificacionEstado = document.getElementById('notificacion-estado');


const obtenerStorageInicial = () => {
    let datosParseados = [];
    
    try {
        const datosRaw = localStorage.getItem('carrito');
        
        
        datosParseados = JSON.parse(datosRaw) ?? [];
        
    } catch (error) {
        
        console.error("Error al procesar el almacenamiento persistente:", error);
        
        
        notificacionEstado.innerText = "⚠️ No se pudo cargar tu carrito previo de forma segura. Se inicializó uno nuevo.";
        notificacionEstado.className = "notificacion error";
        
       
        datosParseados = [];
    } finally {
       
        return datosParseados;
    }
};

let carrito = obtenerStorageInicial();



setTimeout(() => {
    
    const cotizacionDolar = 1200; 
    
    
    bannerAsincrono.innerHTML = `🔔 Cotización del dólar hoy: $${cotizacionDolar} ARS | ¡Aprovechá un 10% OFF usando el código: CODEMODERNO!`;
    bannerAsincrono.classList.remove('hidden');
}, 3000); 



const renderizarVistaCarrito = () => {
    contenedorCarrito.innerHTML = '';

   
    carrito.length === 0 
        ? contenedorCarrito.innerHTML = `<p style="color: #7f8c8d;">El carrito está vacío actualmente.</p>`
        : carrito.forEach(producto => {
           
            const { id, nombre, precio, cantidad } = producto;

            const div = document.createElement('div');
            div.className = 'item-carrito';
            div.innerHTML = `
                <div>
                    <p><strong>${nombre}</strong></p>
                    <small>$${precio} x ${cantidad} u.</small>
                </div>
                <button class="btn-eliminar" onclick="eliminarProductoIndividual(${id})">❌</button>
            `;
            contenedorCarrito.appendChild(div);
        });

    actualizarContadores();
};

const actualizarContadores = () => {
    const totalUnidades = carrito.reduce((acumulador, { cantidad }) => acumulador + cantidad, 0);
    const totalPrecio = carrito.reduce((acumulador, { precio, cantidad }) => acumulador + (precio * cantidad), 0);

    totalItemsHTML.innerText = totalUnidades;
    totalDineroHTML.innerText = totalPrecio;
};

const guardarYSincronizar = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarVistaCarrito();
};

const agregarProducto = (productoNuevo) => {
    const existe = carrito.find(item => item?.id === productoNuevo?.id);
    existe ? existe.cantidad++ : carrito.push({ ...productoNuevo, cantidad: 1 });
    guardarYSincronizar();
};

const eliminarProductoIndividual = (idSeleccionado) => {
    carrito = carrito.filter(item => item.id !== idSeleccionado);
    guardarYSincronizar();
};

const vaciarTodoElCarrito = () => {
    carrito = [];
    localStorage.removeItem('carrito');
    renderizarVistaCarrito();
};


document.getElementById('btn-add-1').addEventListener('click', () => agregarProducto({ id: 1, nombre: 'Laptop Premium', precio: 1200 }));
document.getElementById('btn-add-2').addEventListener('click', () => agregarProducto({ id: 2, nombre: 'Smartphone Pro', precio: 800 }));
document.getElementById('btn-add-3').addEventListener('click', () => agregarProducto({ id: 3, nombre: 'Auriculares Bluetooth', precio: 150 }));
document.getElementById('btn-vaciar-carrito').addEventListener('click', vaciarTodoElCarrito);


renderizarVistaCarrito();