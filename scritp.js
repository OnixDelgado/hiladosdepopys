// ===== VARIABLES GLOBALES =====
let carrito = [];
let productos = [];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    inicializarNavegacion();
    inicializarFiltros();
    inicializarFormularioContacto();
    inicializarModal();
    cargarProductos();
}

// ===== NAVEGACIÓN RESPONSIVA =====
function inicializarNavegacion() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Cambiar navegación al hacer scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--blanco)';
            header.style.backdropFilter = 'none';
        }
    });
}

// ===== FILTROS DE PRODUCTOS =====
function inicializarFiltros() {
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const productoCards = document.querySelectorAll('.producto-card');
    
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filtroBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const categoria = this.getAttribute('data-categoria');
            
            // Filtrar productos
            productoCards.forEach(card => {
                if (categoria === 'todos' || card.getAttribute('data-categoria') === categoria) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Animación de entrada para productos
    observarProductos();
}

function observarProductos() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    const productoCards = document.querySelectorAll('.producto-card');
    productoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===== MODAL DE PRODUCTOS =====
function inicializarModal() {
    const modal = document.getElementById('modal-producto');
    const closeModal = document.querySelector('.close-modal');
    const btnProductos = document.querySelectorAll('.btn-producto');
    
    // Abrir modal
    btnProductos.forEach(btn => {
        btn.addEventListener('click', function() {
            const productoCard = this.closest('.producto-card');
            abrirModalProducto(productoCard);
        });
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', cerrarModal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
}

function abrirModalProducto(productoCard) {
    const modal = document.getElementById('modal-producto');
    const modalBody = document.querySelector('.modal-body');
    
    const imagen = productoCard.querySelector('.producto-img img').src;
    const titulo = productoCard.querySelector('h3').textContent;
    const descripcion = productoCard.querySelector('p').textContent;
    const precio = productoCard.querySelector('.producto-precio').textContent;
    
    modalBody.innerHTML = `
        <div class="modal-producto">
            <div class="modal-imagen">
                <img src="${imagen}" alt="${titulo}">
            </div>
            <div class="modal-info">
                <h2>${titulo}</h2>
                <p class="modal-descripcion">${descripcion}</p>
                <div class="modal-precio">${precio}</div>
                <div class="modal-opciones">
                    <div class="cantidad-selector">
                        <label for="cantidad">Cantidad:</label>
                        <div class="cantidad-controls">
                            <button class="cantidad-btn" data-accion="decrementar">-</button>
                            <input type="number" id="cantidad" value="1" min="1" max="10">
                            <button class="cantidad-btn" data-accion="incrementar">+</button>
                        </div>
                    </div>
                    <button class="btn agregar-carrito" data-producto="${titulo}">
                        <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                    </button>
                    <button class="btn btn-secundario contactar-producto">
                        <i class="fas fa-envelope"></i> Consultar Personalizado
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar controles de cantidad
    inicializarControlesCantidad();
    
    // Agregar evento al botón de carrito
    const btnAgregarCarrito = modalBody.querySelector('.agregar-carrito');
    btnAgregarCarrito.addEventListener('click', function() {
        agregarAlCarrito(titulo, precio, document.getElementById('cantidad').value);
    });
    
    // Agregar evento al botón de contacto
    const btnContactar = modalBody.querySelector('.contactar-producto');
    btnContactar.addEventListener('click', function() {
        cerrarModal();
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('mensaje').value = `Hola Popys, me interesa el producto "${titulo}". ¿Podrías darme más información?`;
        document.getElementById('mensaje').focus();
    });
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function inicializarControlesCantidad() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidadBtns = document.querySelectorAll('.cantidad-btn');
    
    cantidadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const accion = this.getAttribute('data-accion');
            let valor = parseInt(cantidadInput.value);
            
            if (accion === 'incrementar' && valor < 10) {
                cantidadInput.value = valor + 1;
            } else if (accion === 'decrementar' && valor > 1) {
                cantidadInput.value = valor - 1;
            }
        });
    });
    
    cantidadInput.addEventListener('change', function() {
        let valor = parseInt(this.value);
        if (valor < 1) this.value = 1;
        if (valor > 10) this.value = 10;
    });
}

function cerrarModal() {
    const modal = document.getElementById('modal-producto');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===== CARRITO DE COMPRAS =====
function agregarAlCarrito(producto, precio, cantidad) {
    const productoExistente = carrito.find(item => item.nombre === producto);
    
    if (productoExistente) {
        productoExistente.cantidad += parseInt(cantidad);
    } else {
        carrito.push({
            nombre: producto,
            precio: precio,
            cantidad: parseInt(cantidad)
        });
    }
    
    mostrarNotificacion('Producto agregado al carrito');
    actualizarContadorCarrito();
    cerrarModal();
}

function actualizarContadorCarrito() {
    // En una implementación completa, aquí actualizarías el contador del carrito
    console.log('Carrito actualizado:', carrito);
}

// ===== FORMULARIO DE CONTACTO =====
function inicializarFormularioContacto() {
    const formulario = document.getElementById('formulario-contacto');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            enviarFormulario();
        });
    }
    
    // Validación en tiempo real
    const inputs = formulario.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validarCampo);
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validarCampo.call(this);
            }
        });
    });
}

function validarCampo() {
    const valor = this.value.trim();
    const tipo = this.type;
    const nombre = this.name;
    
    // Limpiar errores previos
    this.classList.remove('error', 'success');
    
    let esValido = true;
    let mensajeError = '';
    
    switch (nombre) {
        case 'nombre':
            if (valor.length < 2) {
                esValido = false;
                mensajeError = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valor)) {
                esValido = false;
                mensajeError = 'Por favor ingresa un email válido';
            }
            break;
            
        case 'telefono':
            const telefonoRegex = /^[0-9+\-\s()]{10,}$/;
            if (valor && !telefonoRegex.test(valor)) {
                esValido = false;
                mensajeError = 'Por favor ingresa un teléfono válido';
            }
            break;
            
        case 'mensaje':
            if (valor.length < 10) {
                esValido = false;
                mensajeError = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    if (esValido) {
        this.classList.add('success');
        eliminarMensajeError(this);
    } else {
        this.classList.add('error');
        mostrarMensajeError(this, mensajeError);
    }
    
    return esValido;
}

function mostrarMensajeError(campo, mensaje) {
    eliminarMensajeError(campo);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mensaje-error';
    errorDiv.textContent = mensaje;
    errorDiv.style.color = 'var(--fucsia)';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    
    campo.parentNode.appendChild(errorDiv);
}

function eliminarMensajeError(campo) {
    const errorExistente = campo.parentNode.querySelector('.mensaje-error');
    if (errorExistente) {
        errorExistente.remove();
    }
}

function enviarFormulario() {
    const formulario = document.getElementById('formulario-contacto');
    const inputs = formulario.querySelectorAll('input, textarea');
    let formularioValido = true;
    
    // Validar todos los campos
    inputs.forEach(input => {
        if (!validarCampo.call(input)) {
            formularioValido = false;
        }
    });
    
    if (formularioValido) {
        // Simular envío del formulario
        const btnEnviar = formulario.querySelector('button[type="submit"]');
        const textoOriginal = btnEnviar.textContent;
        
        btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btnEnviar.disabled = true;
        
        setTimeout(() => {
            mostrarNotificacion('¡Mensaje enviado con éxito! Popys te contactará pronto.');
            formulario.reset();
            inputs.forEach(input => input.classList.remove('success'));
            btnEnviar.innerHTML = textoOriginal;
            btnEnviar.disabled = false;
        }, 2000);
    } else {
        mostrarNotificacion('Por favor corrige los errores en el formulario', 'error');
    }
}

// ===== NOTIFICACIONES =====
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Eliminar notificación existente
    const notificacionExistente = document.querySelector('.notificacion');
    if (notificacionExistente) {
        notificacionExistente.remove();
    }
    
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    // Estilos para la notificación
    notificacion.style.position = 'fixed';
    notificacion.style.top = '20px';
    notificacion.style.right = '20px';
    notificacion.style.background = tipo === 'success' ? 'var(--fucsia)' : '#ff4444';
    notificacion.style.color = 'white';
    notificacion.style.padding = '15px 20px';
    notificacion.style.borderRadius = '5px';
    notificacion.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notificacion.style.zIndex = '10000';
    notificacion.style.transform = 'translateX(400px)';
    notificacion.style.transition = 'transform 0.3s ease';
    
    document.body.appendChild(notificacion);
    
    // Animación de entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.remove();
            }
        }, 300);
    }, 4000);
}

// ===== ANIMACIONES AL SCROLL =====
function observarElementos() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    const elementosAnimados = document.querySelectorAll('.personalizados-content, .sobre-mi-content, .contacto-content');
    elementosAnimados.forEach(elemento => {
        elemento.classList.add('animar-al-scroll');
        observer.observe(elemento);
    });
}

// ===== CARGA DE PRODUCTOS (SIMULADA) =====
function cargarProductos() {
    // En una implementación real, esto vendría de una API
    productos = [
        {
            id: 1,
            nombre: "Bufanda Elegante",
            categoria: "prendas",
            precio: "$4.500",
            descripcion: "Bufanda tejida a crochet con hilos de algodón premium",
            imagen: "https://via.placeholder.com/300x300/fuchsia/ffffff?text=Bufanda"
        },
        {
            id: 2,
            nombre: "Suéter Clásico",
            categoria: "prendas",
            precio: "$8.900",
            descripcion: "Suéter tejido con lana de primera calidad",
            imagen: "https://via.placeholder.com/300x300/fuchsia/ffffff?text=Suéter"
        },
        {
            id: 3,
            nombre: "Gorro Invierno",
            categoria: "accesorios",
            precio: "$3.200",
            descripcion: "Gorro tejido con diseño único y materiales cálidos",
            imagen: "https://via.placeholder.com/300x300/fuchsia/ffffff?text=Gorro"
        },
        {
            id: 4,
            nombre: "Mantel Bohemio",
            categoria: "hogar",
            precio: "$6.500",
            descripcion: "Mantel tejido con patrones únicos para decorar tu hogar",
            imagen: "https://via.placeholder.com/300x300/fuchsia/ffffff?text=Mantel"
        },
        {
            id: 5,
            nombre: "Muñeca Amigurumi",
            categoria: "accesorios",
            precio: "$2.800",
            descripcion: "Muñeca tejida con técnica amigurumi, ideal para regalo",
            imagen: "https://via.placeholder.com/300x300/fuchsia/ffffff?text=Muñeca"
        },
        {
            id: 6,
            nombre: "Almohadón Decorativo",
            categoria: "hogar",
            precio: "$4.200",
            descripcion: "Almohadón tejido con diseños geométricos modernos",
            imagen: "https://via.placeholder.com/300x300/fuchsia/ffffff?text=Almohadón"
        }
    ];
    
    console.log('Productos cargados:', productos);
}

// ===== CONTADOR DE VISITAS (OPCIONAL) =====
function inicializarContadorVisitas() {
    let visitas = localStorage.getItem('visitas_hilados_popys');
    visitas = visitas ? parseInt(visitas) + 1 : 1;
    localStorage.setItem('visitas_hilados_popys', visitas);
    console.log(`Visitas al sitio: ${visitas}`);
}

// Inicializar contador de visitas al cargar la página
inicializarContadorVisitas();

// ===== ANIMACIONES CSS ADICIONALES =====
const style = document.createElement('style');
style.textContent = `
    .animar-al-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animar-al-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    input.error, textarea.error {
        border-color: var(--fucsia) !important;
        box-shadow: 0 0 0 2px rgba(255, 0, 255, 0.1) !important;
    }
    
    input.success, textarea.success {
        border-color: #4CAF50 !important;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .modal-producto {
        display: flex;
        gap: 2rem;
    }
    
    .modal-imagen {
        flex: 1;
    }
    
    .modal-imagen img {
        width: 100%;
        border-radius: 10px;
    }
    
    .modal-info {
        flex: 1;
    }
    
    .modal-precio {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--fucsia);
        margin: 1rem 0;
    }
    
    .cantidad-selector {
        margin: 1.5rem 0;
    }
    
    .cantidad-controls {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
    }
    
    .cantidad-btn {
        background: var(--gris);
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-weight: bold;
    }
    
    #cantidad {
        width: 50px;
        text-align: center;
        margin: 0 10px;
        border: 1px solid var(--gris-oscuro);
        border-radius: 5px;
        padding: 5px;
    }
    
    .btn-secundario {
        background: transparent;
        border: 2px solid var(--fucsia);
        color: var(--fucsia);
        margin-top: 10px;
    }
    
    .btn-secundario:hover {
        background: var(--fucsia);
        color: white;
    }
    
    @media (max-width: 768px) {
        .modal-producto {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);

// ===== GESTIÓN DE IMÁGENES =====
function inicializarGaleriaImagenes() {
    // Precargar imágenes importantes
    precargarImagenes([
        'assets/logo.png',
        'assets/hero-background.jpg',
        'assets/logo-hero.png'
    ]);
    
    // Lazy loading para imágenes de productos
    inicializarLazyLoading();
    
    // Galería en modal de productos
    inicializarGaleriaModal();
}

function precargarImagenes(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

function inicializarLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('img-loading');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
}

function inicializarGaleriaModal() {
    // Esta función se llamará desde abrirModalProducto
}

// ===== FUNCIÓN MEJORADA PARA MODAL =====
function abrirModalProducto(productoCard) {
    const modal = document.getElementById('modal-producto');
    const modalBody = document.querySelector('.modal-body');
    
    const productoId = productoCard.getAttribute('data-producto-id');
    const producto = productos.find(p => p.id == productoId);
    
    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }
    
    modalBody.innerHTML = `
        <div class="modal-producto">
            <div class="modal-imagen">
                <img src="${producto.imagenPrincipal}" alt="${producto.nombre}" id="modal-imagen-principal">
                ${producto.galeria && producto.galeria.length > 0 ? `
                <div class="modal-gallery">
                    ${producto.galeria.map((img, index) => `
                        <img src="${img}" alt="${producto.nombre} ${index + 1}" 
                             class="modal-gallery-img ${index === 0 ? 'active' : ''}"
                             data-imagen="${img}">
                    `).join('')}
                </div>
                ` : ''}
            </div>
            <div class="modal-info">
                <h2>${producto.nombre}</h2>
                <p class="modal-descripcion">${producto.descripcion}</p>
                
                ${producto.detalles ? `
                <div class="modal-detalles">
                    <h4>Detalles del producto:</h4>
                    <ul>
                        ${producto.detalles.map(detalle => `<li>${detalle}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="modal-precio">${producto.precio}</div>
                
                <div class="modal-opciones">
                    <div class="cantidad-selector">
                        <label for="cantidad">Cantidad:</label>
                        <div class="cantidad-controls">
                            <button class="cantidad-btn" data-accion="decrementar">-</button>
                            <input type="number" id="cantidad" value="1" min="1" max="10">
                            <button class="cantidad-btn" data-accion="incrementar">+</button>
                        </div>
                    </div>
                    <button class="btn agregar-carrito" data-producto-id="${producto.id}">
                        <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                    </button>
                    <button class="btn btn-secundario contactar-producto">
                        <i class="fas fa-envelope"></i> Consultar Personalizado
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Inicializar galería si existe
    if (producto.galeria && producto.galeria.length > 0) {
        inicializarGaleriaModal();
    }
    
    // Resto del código igual...
}

function inicializarGaleriaModal() {
    const galleryImages = document.querySelectorAll('.modal-gallery-img');
    const mainImage = document.getElementById('modal-imagen-principal');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Actualizar imagen principal
            mainImage.src = this.getAttribute('data-imagen');
            
            // Actualizar clase active
            galleryImages.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ===== ESTRUCTURA DE DATOS MEJORADA =====
function cargarProductos() {
    productos = [
        {
            id: 1,
            nombre: "Llaveros Personalizados",
            categoria: "accesorios",
            precio: "$1.200",
            descripcion: "Llaveros tejidos a crochet con diseños únicos y personalizados",
            imagenPrincipal: "assets/productos/llaveros-1.jpg",
            galeria: [
                "assets/productos/llaveros-2.jpg",
                "assets/productos/llaveros-3.jpg"
            ],
            detalles: [
                "Material: Hilo de algodón",
                "Incluye anillo metálico resistente",
                "Personalizable con iniciales",
                "Perfecto para regalo"
            ]
        },
        {
            id: 2,
            nombre: "Riñonera-Bandolera",
            categoria: "accesorios",
            precio: "$5.800",
            descripcion: "Bandolera práctica y moderna tejida con hilos de colores",
            imagenPrincipal: "assets/productos/rinonera-1.jpg",
            galeria: [
                "assets/productos/rinonera-2.jpg",
                "assets/productos/rinonera-3.jpg"
            ],
            detalles: [
                "Material: Hilo de algodón reforzado",
                "Correa ajustable",
                "Cierre seguro",
                "Compartimento principal espacioso"
            ]
        },
        {
            id: 3,
            nombre: "Portaplatos Decorativos",
            categoria: "hogar",
            precio: "$2.500",
            descripcion: "Portaplatos tejidos que protegen tus mesas y decoran tu hogar",
            imagenPrincipal: "assets/productos/portaplatos-1.jpg",
            galeria: [
                "assets/productos/portaplatos-2.jpg",
                "assets/productos/portaplatos-3.jpg"
            ],
            detalles: [
                "Material: Hilo de algodón",
                "Diámetro: 15-20cm",
                "Resistente al calor",
                "Lavable a mano"
            ]
        },
        {
            id: 4,
            nombre: "Cartucheras Originales",
            categoria: "accesorios",
            precio: "$3.200",
            descripcion: "Cartucheras tejidas con diseños creativos para tus útiles",
            imagenPrincipal: "assets/productos/cartuchera-1.jpg",
            galeria: [
                "assets/productos/cartuchera-2.jpg",
                "assets/productos/cartuchera-3.jpg"
            ],
            detalles: [
                "Material: Hilo de algodón",
                "Cierre de calidad",
                "Compartimentos internos",
                "Ideal para estudiantes"
            ]
        },
        {
            id: 5,
            nombre: "Set Materos Completo",
            categoria: "hogar",
            precio: "$4.800",
            descripcion: "Set incluye portatermo y base para mate, tejido con amor",
            imagenPrincipal: "assets/productos/set-matero-1.jpg",
            galeria: [
                "assets/productos/set-matero-2.jpg",
                "assets/productos/set-matero-3.jpg"
            ],
            detalles: [
                "Material: Hilo de algodón grueso",
                "Incluye portatermo y base",
                "Aislamiento térmico",
                "Medidas estándar para termos"
            ]
        },
        {
            id: 6,
            nombre: "Carteras Infantiles",
            categoria: "niños",
            precio: "$3.500",
            descripcion: "Carteras tejidas para niños con personajes y diseños divertidos",
            imagenPrincipal: "assets/productos/cartera-ninos-1.jpg",
            galeria: [
                "assets/productos/cartera-ninos-2.jpg",
                "assets/productos/cartera-ninos-3.jpg"
            ],
            detalles: [
                "Material: Hilo de algodón suave",
                "Diseños infantiles",
                "Correa ajustable",
                "Perfecta para cumpleaños"
            ]
        }
    ];
    
    renderizarProductos();
}

function renderizarProductos() {
    const productosGrid = document.querySelector('.productos-grid');
    
    if (!productosGrid) return;
    
    productosGrid.innerHTML = productos.map(producto => `
        <div class="producto-card" data-categoria="${producto.categoria}" data-producto-id="${producto.id}">
            <div class="producto-img">
                ${producto.imagenPrincipal ? 
                    `<img src="${producto.imagenPrincipal}" alt="${producto.nombre}" 
                          data-src="${producto.imagenPrincipal}" class="img-loading">` :
                    `<div class="producto-placeholder">
                        <span>${producto.nombre}<br><small>Imagen próximamente</small></span>
                    </div>`
                }
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="producto-precio">${producto.precio}</div>
                <button class="btn-producto">Ver Detalles</button>
            </div>
        </div>
    `).join('');
    
    // Re-inicializar eventos después de renderizar
    inicializarEventosProductos();
}

function inicializarEventosProductos() {
    // Re-asignar eventos a los botones de productos
    const btnProductos = document.querySelectorAll('.btn-producto');
    btnProductos.forEach(btn => {
        btn.addEventListener('click', function() {
            const productoCard = this.closest('.producto-card');
            abrirModalProducto(productoCard);
        });
    });
    
    // Re-inicializar observador para animaciones
    observarProductos();
}

// ===== INICIALIZACIÓN MEJORADA =====
function inicializarApp() {
    inicializarNavegacion();
    cargarProductos(); // Cargar antes que los filtros
    inicializarFiltros();
    inicializarFormularioContacto();
    inicializarModal();
    inicializarGaleriaImagenes();
    observarElementos();
}
