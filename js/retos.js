let retos = [];
let retoActual = null;

// Cargar retos
fetch('data/retos.json')
  .then(respuesta => respuesta.json())
  .then(datos => {
    retos = datos;
    cargarReto();
  });

// Función para cargar un reto aleatorio pendiente
function cargarReto() {
  // Recuperar el progreso del usuario actual
  let hechos = JSON.parse(localStorage.getItem('retosHechos_' + usuario)) || [];

  // Filtrar los retos pendientes
  let pendientes = retos.filter(r => !hechos.includes(r.id));

  // Si ya completó todos
  if (pendientes.length === 0) {
    document.getElementById('zonaReto').innerHTML =
      "<h2>¡Enhorabuena, " + usuario + "!</h2>" +
      "<p>Has completado todos los retos STEAM.</p>" +
      "<p>Reiniciando el juego en 5 segundos...</p>";

    setTimeout(() => {
      localStorage.removeItem('retosHechos_' + usuario); // reinicia solo este usuario
      cargarReto(); // empieza de nuevo
    }, 5000);

    return;
  }

  // Elegir reto aleatorio
  retoActual = pendientes[Math.floor(Math.random() * pendientes.length)];

  // Mostrar reto
  document.getElementById('zonaReto').innerHTML = `
    <h2>${retoActual.area}</h2>
    <h3>${retoActual.titulo}</h3>
    <img src="${retoActual.imagen}">
    <p>${retoActual.descripcion}</p>
  `;
}

// Comprobar la respuesta
function comprobarRespuesta() {
  let respuesta = document.getElementById('respuesta').value
    .toLowerCase()
    .trim();

  if (respuesta === retoActual.solucion.toLowerCase()) {
    // Guardar progreso del usuario actual
    let hechos = JSON.parse(localStorage.getItem('retosHechos_' + usuario)) || [];
    hechos.push(retoActual.id);
    localStorage.setItem('retosHechos_' + usuario, JSON.stringify(hechos));

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




