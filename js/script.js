// Espera a que la página termine de cargar antes de ejecutar cambios
window.onload = function () {

    // Busca el titular principal de la portada
    const titular = document.getElementById("titular-principal");

    // Busca la primera noticia de la página
    const primeraNoticia = document.querySelector(".noticia");

    // Si existe el titular principal, cambia su color
    if (titular) {
        titular.style.color = "#153A5B";
    }

    // Si existe al menos una noticia, la destaca con un borde superior rojo
    if (primeraNoticia) {
        primeraNoticia.style.borderTop = "4px solid #C81121";
    }
};