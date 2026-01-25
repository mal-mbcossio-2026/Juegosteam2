let retos = [];
let retoActual = null;
let usuario = localStorage.getItem('usuario') || prompt("Introduce tu nombre:");
if (!usuario) usuario = "Anonimo";
localStorage.setItem('usuario', usuario);

// Cargar retos
fetch('data/retos.json')
  .then(respuesta => respuesta.json())
  .then(datos => {
    retos = datos;
    cargarReto();
  });

// Cargar un reto pendiente
function cargarReto() {
  let hechos = JSON.parse(localStorage.getItem('retosHechos_' + usuario)) || [];
  let pendientes = retos.filter(r => !hechos.includes(r.id));

  if (pendientes.length === 0) {
    document.getElementById('zonaReto').innerHTML =
      "<h2>¡Enhorabuena, " + usuario + "!</h2>" +
      "<p>Has completado todos los retos STEAM.</p>" +
      "<p>Haz una captura de esta pantalla para ganar.</p>" +
      "<p>Reiniciando el juego en 1 minuto...</p>";

    setTimeout(() => {
      localStorage.removeItem('retosHechos_' + usuario);
      cargarReto();
    }, 60000);
    return;
  }

  // Elegir reto aleatorio
  retoActual = pendientes[Math.floor(Math.random() * pendientes.length)];

  // Mostrar pantalla de código
  document.getElementById('bloqueoReto').style.display = "block";
  document.getElementById('zonaReto').style.display = "none";
  document.getElementById('respuesta').style.display = "none";
  document.querySelector('button[onclick="comprobarRespuesta()"]').style.display = "none";
  document.getElementById('mensajeCodigoReto').textContent = "";
  document.getElementById('codigoReto').value = "";
}

// Verificar código del reto
function verificarCodigoReto() {
  let codigoIngresado = document.getElementById('codigoReto').value.trim();

  if (codigoIngresado === retoActual.codigo) {
    document.getElementById('bloqueoReto').style.display = "none";
    document.getElementById('zonaReto').style.display = "block";
    document.getElementById('respuesta').style.display = "inline";
    document.querySelector('button[onclick="comprobarRespuesta()"]').style.display = "inline";

    document.getElementById('zonaReto').innerHTML = `
      <h2>${retoActual.area}</h2>
      <h3>${retoActual.titulo}</h3>
      <img src="${retoActual.imagen}">
      <p>${retoActual.descripcion}</p>
    `;
  } else {
    document.getElementById('mensajeCodigoReto').textContent = "Código incorrecto. Inténtalo de nuevo.";
  }
}

// Comprobar la respuesta del alumno
function comprobarRespuesta() {
  let respuesta = document.getElementById('respuesta').value.toLowerCase().trim();

  if (respuesta === retoActual.solucion.toLowerCase()) {
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

