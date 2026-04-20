// Espera a que la página termine de cargar antes de ejecutar el código
window.onload = function () {

    // Busca el titular principal de la portada
    const titular = document.getElementById("titular-principal");

    // Busca la primera noticia disponible en la página
    const primeraNoticia = document.querySelector(".noticia");

    // Si existe el titular principal, cambia su color
    if (titular) {
        titular.style.color = "#153A5B";
    }

    // Si existe al menos una noticia, la destaca con un borde superior rojo
    if (primeraNoticia) {
        primeraNoticia.style.borderTop = "4px solid #C81121";
    }

    // Llama a la función que muestra la fecha y hora actual por primera vez
    actualizarFechaHora();

    // Ejecuta la función actualizarFechaHora cada segundo
    setInterval(actualizarFechaHora, 1000);

    // Busca el botón para agregar nuevos artículos
    const botonAgregarArticulo = document.getElementById("btn-agregar-articulo");

    // Si existe el botón, asocia el evento click
    if (botonAgregarArticulo) {
        botonAgregarArticulo.addEventListener("click", agregarArticulo);
    }

    // Busca el botón para enviar mensajes de contacto
    const botonEnviarContacto = document.getElementById("btn-enviar-contacto");

    // Si existe el botón, asocia el evento click
    if (botonEnviarContacto) {
        botonEnviarContacto.addEventListener("click", enviarMensajeContacto);
    }

    // Carga mensajes de contacto guardados
    cargarMensajesContacto();

    // Carga artículos guardados previamente para la página actual
    cargarArticulosDesdeLocalStorage();

    // Actualiza el contador de artículos
    actualizarContadorArticulos();
};


// Función que actualiza fecha y hora en la barra superior
function actualizarFechaHora() {

    // Busca el contenedor del reloj
    const contenedorFechaHora = document.getElementById("fecha-hora");

    // Si no existe, termina para evitar errores
    if (!contenedorFechaHora) {
        return;
    }

    // Obtiene fecha y hora actual
    const ahora = new Date();

    // Arreglos para nombres de días y meses
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    // Obtiene componentes de fecha
    const diaSemana = dias[ahora.getDay()];
    const diaMes = ahora.getDate();
    const mesActual = meses[ahora.getMonth()];
    const anioActual = ahora.getFullYear();

    // Obtiene componentes de hora
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    let segundos = ahora.getSeconds();

    // Formatea con cero inicial si corresponde
    if (horas < 10) horas = "0" + horas;
    if (minutos < 10) minutos = "0" + minutos;
    if (segundos < 10) segundos = "0" + segundos;

    // Construye texto final
    const textoFechaHora = diaSemana + ", " + diaMes + " de " + mesActual + " de " + anioActual + " - " + horas + ":" + minutos + ":" + segundos;

    // Muestra fecha y hora en pantalla
    contenedorFechaHora.textContent = textoFechaHora;
}


// Función que crea visualmente un artículo principal o secundario según su tipo
function crearArticuloHTML(titulo, descripcion, imagenBase64, tipoArticulo) {

    // Crea la columna contenedora que usará Bulma
    const columna = document.createElement("div");

    // Si es principal se agrega en media columna
    if (tipoArticulo === "principal") {
        columna.className = "column is-6";
    } else {
        // Si es secundario se agrega ocupando toda la columna lateral
        columna.className = "column is-12";
    }

    // Si el artículo es principal, se construye como tarjeta grande
    if (tipoArticulo === "principal") {

        const articulo = document.createElement("article");
        articulo.className = "card noticia noticia-principal h-100";

        const cardContentSuperior = document.createElement("div");
        cardContentSuperior.className = "card-content pb-2";

        const categoria = document.createElement("p");
        categoria.className = "categoria is-size-7 has-text-weight-bold mb-2";
        categoria.textContent = "ACTUALIDAD";

        const tituloArticulo = document.createElement("h3");
        tituloArticulo.className = "title is-4 mb-4";
        tituloArticulo.textContent = titulo;

        cardContentSuperior.appendChild(categoria);
        cardContentSuperior.appendChild(tituloArticulo);
        articulo.appendChild(cardContentSuperior);

        // Si existe imagen, se agrega como bloque visual
        if (imagenBase64) {
            const cardImage = document.createElement("div");
            cardImage.className = "card-image";

            const figure = document.createElement("figure");
            figure.className = "image";

            const imagenArticulo = document.createElement("img");
            imagenArticulo.className = "imagen-noticia";
            imagenArticulo.src = imagenBase64;
            imagenArticulo.alt = "Imagen del artículo agregado";

            figure.appendChild(imagenArticulo);
            cardImage.appendChild(figure);
            articulo.appendChild(cardImage);
        }

        const cardContentInferior = document.createElement("div");
        cardContentInferior.className = "card-content pt-4";

        const resumenArticulo = document.createElement("p");
        resumenArticulo.className = "resumen";
        resumenArticulo.textContent = descripcion;

        cardContentInferior.appendChild(resumenArticulo);
        articulo.appendChild(cardContentInferior);

        columna.appendChild(articulo);
        return columna;
    }

    // Si el artículo es secundario, se construye en formato compacto lateral
    const articuloSecundario = document.createElement("article");
    articuloSecundario.className = "noticia-secundaria";

    const categoriaSecundaria = document.createElement("p");
    categoriaSecundaria.className = "categoria is-size-7 has-text-weight-bold mb-1";
    categoriaSecundaria.textContent = "ACTUALIDAD";

    const tituloSecundario = document.createElement("h3");
    tituloSecundario.className = "title is-6 mb-2";
    tituloSecundario.textContent = titulo;

    const resumenSecundario = document.createElement("p");
    resumenSecundario.className = "resumen is-size-7";
    resumenSecundario.textContent = descripcion;

    articuloSecundario.appendChild(categoriaSecundaria);
    articuloSecundario.appendChild(tituloSecundario);

    // En secundarios no se inserta imagen para mantener uniformidad visual del lateral
    articuloSecundario.appendChild(resumenSecundario);

    columna.appendChild(articuloSecundario);

    return columna;
}


// Función que captura los datos del formulario y agrega un nuevo artículo
function agregarArticulo() {

    // Busca el campo de tipo de artículo
    const campoTipo = document.getElementById("tipo-articulo");

    // Busca el campo de título
    const campoTitulo = document.getElementById("titulo-articulo");

    // Busca el campo de descripción
    const campoDescripcion = document.getElementById("descripcion-articulo");

    // Busca el campo de imagen
    const campoImagen = document.getElementById("imagen-articulo");

    // Verifica que existan todos los elementos necesarios
    if (!campoTipo || !campoTitulo || !campoDescripcion || !campoImagen) {
        return;
    }

    // Obtiene valores del formulario
    const tipo = campoTipo.value;
    const titulo = campoTitulo.value.trim();
    const descripcion = campoDescripcion.value.trim();
    const archivoImagen = campoImagen.files[0];

    // Valida campos obligatorios
    if (titulo === "" || descripcion === "") {
        alert("Debe completar el título y la descripción del artículo.");
        return;
    }

    // Si el artículo es secundario, no requiere procesar imagen para respetar formato compacto
    if (tipo === "secundario") {
        insertarNuevoArticulo(tipo, titulo, descripcion, null);

        // Limpieza del formulario
        campoTipo.value = "principal";
        campoTitulo.value = "";
        campoDescripcion.value = "";
        campoImagen.value = "";
        campoTitulo.focus();
        return;
    }

    // Si el usuario cargó imagen, se procesa con FileReader
    if (archivoImagen) {
        const lector = new FileReader();

        lector.onload = function (evento) {
            const imagenBase64 = evento.target.result;
            insertarNuevoArticulo(tipo, titulo, descripcion, imagenBase64);

            // Limpieza del formulario
            campoTipo.value = "principal";
            campoTitulo.value = "";
            campoDescripcion.value = "";
            campoImagen.value = "";
            campoTitulo.focus();
        };

        lector.readAsDataURL(archivoImagen);

    } else {
        // Si no hay imagen, igual se inserta el artículo principal
        insertarNuevoArticulo(tipo, titulo, descripcion, null);

        // Limpieza del formulario
        campoTipo.value = "principal";
        campoTitulo.value = "";
        campoDescripcion.value = "";
        campoImagen.value = "";
        campoTitulo.focus();
    }
}


// Función que inserta el nuevo artículo en el contenedor
function insertarNuevoArticulo(tipo, titulo, descripcion, imagenBase64) {

    // Crea el artículo visual
    const nuevoArticulo = crearArticuloHTML(titulo, descripcion, imagenBase64, tipo);

    // Si es principal, lo inserta al inicio del bloque principal
    if (tipo === "principal") {
        const zonaPrincipal = document.querySelector("#noticias-generales .columns");

        if (zonaPrincipal) {
            zonaPrincipal.prepend(nuevoArticulo);
        }

    } else {
        // Si es secundario, lo inserta al inicio del bloque secundario
        const zonaSecundaria = document.querySelector("#noticias-secundarias .columns");

        if (zonaSecundaria) {
            zonaSecundaria.prepend(nuevoArticulo);
        }
    }

    // Guarda artículo en localStorage
    guardarArticuloEnLocalStorage(titulo, descripcion, imagenBase64, tipo);

    // Actualiza el contador
    actualizarContadorArticulos();
}


// Función que genera fecha y hora para mensajes de contacto
function obtenerFechaHoraMensaje() {

    const ahora = new Date();

    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    const diaSemana = dias[ahora.getDay()];
    const diaMes = ahora.getDate();
    const mesActual = meses[ahora.getMonth()];
    const anioActual = ahora.getFullYear();

    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    let segundos = ahora.getSeconds();

    if (horas < 10) horas = "0" + horas;
    if (minutos < 10) minutos = "0" + minutos;
    if (segundos < 10) segundos = "0" + segundos;

    return diaSemana + ", " + diaMes + " de " + mesActual + " de " + anioActual + " - " + horas + ":" + minutos + ":" + segundos;
}


// Función que crea visualmente un mensaje publicado
function crearMensajeHTML(nombre, fecha, mensaje) {

    const bloqueMensaje = document.createElement("article");
    bloqueMensaje.className = "mensaje-publicado";

    const autorMensaje = document.createElement("p");
    autorMensaje.className = "mensaje-autor";
    autorMensaje.textContent = nombre;

    const fechaMensaje = document.createElement("p");
    fechaMensaje.className = "mensaje-fecha";
    fechaMensaje.textContent = fecha;

    const textoMensaje = document.createElement("p");
    textoMensaje.className = "mensaje-texto";
    textoMensaje.textContent = mensaje;

    bloqueMensaje.appendChild(autorMensaje);
    bloqueMensaje.appendChild(fechaMensaje);
    bloqueMensaje.appendChild(textoMensaje);

    return bloqueMensaje;
}


// Función que carga los mensajes guardados de contacto
function cargarMensajesContacto() {

    const listaMensajes = document.getElementById("lista-mensajes");

    if (!listaMensajes) {
        return;
    }

    listaMensajes.innerHTML = "";

    const mensajesGuardados = localStorage.getItem("mensajesContactoElFaro");

    if (!mensajesGuardados) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.textContent = "Aún no hay mensajes publicados.";
        listaMensajes.appendChild(mensajeVacio);
        return;
    }

    const mensajes = JSON.parse(mensajesGuardados);

    if (mensajes.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.textContent = "Aún no hay mensajes publicados.";
        listaMensajes.appendChild(mensajeVacio);
        return;
    }

    for (let i = 0; i < mensajes.length; i++) {
        const mensajeActual = mensajes[i];
        const bloqueMensaje = crearMensajeHTML(mensajeActual.nombre, mensajeActual.fecha, mensajeActual.mensaje);
        listaMensajes.appendChild(bloqueMensaje);
    }
}


// Función que envía mensaje de contacto
function enviarMensajeContacto() {

    const campoNombre = document.getElementById("nombre-contacto");
    const campoMensaje = document.getElementById("mensaje-contacto");

    if (!campoNombre || !campoMensaje) {
        return;
    }

    const nombre = campoNombre.value.trim();
    const mensaje = campoMensaje.value.trim();

    if (nombre === "" || mensaje === "") {
        alert("Debe completar el nombre y el mensaje antes de enviar.");
        return;
    }

    const fecha = obtenerFechaHoraMensaje();

    const nuevoMensaje = {
        nombre: nombre,
        fecha: fecha,
        mensaje: mensaje
    };

    const mensajesGuardados = localStorage.getItem("mensajesContactoElFaro");

    let mensajes = [];

    if (mensajesGuardados) {
        mensajes = JSON.parse(mensajesGuardados);
    }

    mensajes.push(nuevoMensaje);

    localStorage.setItem("mensajesContactoElFaro", JSON.stringify(mensajes));

    campoNombre.value = "";
    campoMensaje.value = "";
    campoNombre.focus();

    cargarMensajesContacto();
}


// Función que actualiza el contador total de artículos visibles
function actualizarContadorArticulos() {

    // Cuenta todos los artículos principales visibles
    const cantidadPrincipales = document.querySelectorAll(".noticia").length;

    // Busca el contador en pantalla
    const totalArticulos = document.getElementById("total-articulos");

    // Si existe, actualiza el total
    if (totalArticulos) {
        totalArticulos.textContent = cantidadPrincipales;
    }
}


// Función que determina la clave de almacenamiento según página actual
function obtenerClavePaginaArticulos() {

    const ruta = window.location.pathname;

    if (ruta.includes("index.html") || ruta.endsWith("/")) {
        return "articulos_index";
    }

    if (ruta.includes("deporte.html")) {
        return "articulos_deporte";
    }

    if (ruta.includes("negocios.html")) {
        return "articulos_negocios";
    }

    return null;
}


// Función que guarda un artículo en localStorage
function guardarArticuloEnLocalStorage(titulo, descripcion, imagenBase64, tipo) {

    const clavePagina = obtenerClavePaginaArticulos();

    if (!clavePagina) {
        return;
    }

    const articulosGuardados = localStorage.getItem(clavePagina);

    let articulos = [];

    if (articulosGuardados) {
        articulos = JSON.parse(articulosGuardados);
    }

    // Se guarda el artículo incluyendo tipo
    const nuevoArticulo = {
        titulo: titulo,
        descripcion: descripcion,
        imagen: imagenBase64,
        tipo: tipo
    };

    // Se agrega al inicio para que quede primero al recargar
    articulos.unshift(nuevoArticulo);

    localStorage.setItem(clavePagina, JSON.stringify(articulos));
}


// Función que carga artículos guardados para la página actual
function cargarArticulosDesdeLocalStorage() {

    const clavePagina = obtenerClavePaginaArticulos();

    if (!clavePagina) {
        return;
    }

    const articulosGuardados = localStorage.getItem(clavePagina);

    if (!articulosGuardados) {
        return;
    }

    const articulos = JSON.parse(articulosGuardados);

    for (let i = 0; i < articulos.length; i++) {

        const articuloActual = articulos[i];

        const nuevoArticulo = crearArticuloHTML(
            articuloActual.titulo,
            articuloActual.descripcion,
            articuloActual.imagen,
            articuloActual.tipo
        );

        // Inserta según tipo en su contenedor correspondiente
        if (articuloActual.tipo === "principal") {
            const zonaPrincipal = document.querySelector("#noticias-generales .columns");

            if (zonaPrincipal) {
                zonaPrincipal.appendChild(nuevoArticulo);
            }

        } else {
            const zonaSecundaria = document.querySelector("#noticias-secundarias .columns");

            if (zonaSecundaria) {
                zonaSecundaria.appendChild(nuevoArticulo);
            }
        }
    }
}