let retos = [];
let retoActual = null;

fetch('data/retos.json')
  .then(respuesta => respuesta.json())
  .then(datos => {
    retos = datos;
    cargarReto();
  });

function cargarReto() {
  let hechos = JSON.parse(localStorage.getItem('retosHechos')) || [];

  let pendientes = retos.filter(r => !hechos.includes(r.id));

 if (pendientes.length === 0) {
  document.getElementById('zonaReto').innerHTML =
    "<h2>¡Enhorabuena!</h2><p>Has completado todos los retos STEAM.</p>" +
    "<p>Reiniciando el juego en 5 segundos...</p>";

  // Espera 5 segundos antes de reiniciar
  setTimeout(() => {
    localStorage.removeItem('retosHechos'); // borra el historial
    cargarReto(); // empieza de nuevo
  }, 5000);

  return;
}


  retoActual = pendientes[Math.floor(Math.random() * pendientes.length)];

  document.getElementById('zonaReto').innerHTML = `
    <h2>${retoActual.area}</h2>
    <h3>${retoActual.titulo}</h3>
    <img src="${retoActual.imagen}">
    <p>${retoActual.descripcion}</p>
  `;
}

function comprobarRespuesta() {
  let respuesta = document.getElementById('respuesta').value
    .toLowerCase()
    .trim();

  if (respuesta === retoActual.solucion.toLowerCase()) {
    let hechos = JSON.parse(localStorage.getItem('retosHechos')) || [];
    hechos.push(retoActual.id);
    localStorage.setItem('retosHechos', JSON.stringify(hechos));

    document.getElementById('mensaje').textContent =
      "Reto superado. Ve al siguiente reto...";

    setTimeout(() => {
  document.getElementById('mensaje').textContent = "";
  document.getElementById('respuesta').value = "";
  cargarReto();
}, 5000);
  } else {
    document.getElementById('mensaje').textContent =
      "Respuesta incorrecta. Inténtalo de nuevo.";
  }
}



