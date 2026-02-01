/***********************
 * IDENTIFICACIÓN USUARIO
 ***********************/
let usuario = localStorage.getItem('usuario');

if (!usuario) {
  usuario = prompt("Introduce tu nombre:");
  if (!usuario) usuario = "Anonimo";
  localStorage.setItem('usuario', usuario);
}

/***********************
 * VARIABLES PRINCIPALES
 ***********************/
let retos = [];
let retoActual = null;

/***********************
 * CARGA DE RETOS
 ***********************/
fetch('data/retos.json')
  .then(response => response.json())
  .then(data => {
    retos = data;
    cargarReto();
  });

/***********************
 * CARGAR SIGUIENTE RETO
 * (EN ORDEN CRECIENTE)
 ***********************/
function cargarReto() {

  // Retos ya completados por este usuario
  let hechos = JSON.parse(localStorage.getItem('retosHechos_' + usuario)) || [];

  // Retos pendientes
  let pendientes = retos.filter(r => !hechos.includes(r.id));

  // Si no quedan retos → fin del juego
  if (pendientes.length === 0) {
    document.getElementById('bloqueoReto').style.display = "none";
    document.getElementById('zonaReto').style.display = "block";
    document.getElementById('zonaReto').innerHTML = `
      <h2>¡Enhorabuena, ${usuario}!</h2>
      <p>🏆 ¡VIRUS ELIMINADO! La conexión a la red se ha restablecido con éxito.<p>\n<\p> Habéis demostrado ser un equipo de élite.<p>\n<\p>Dirigíos ahora al profesor para reclamar vuestro Comodín de Resurrección.<p>\n<\p>¡MISIÓN CUMPLIDA!<\p>
      <p>El juego se reiniciará en 25 segundos...</p>
    `;

    setTimeout(() => {
      localStorage.removeItem('retosHechos_' + usuario);
      cargarReto();
    }, 25000);

    return;
  }

  // ORDENAR retos pendientes por ID
  pendientes.sort((a, b) => a.id - b.id);

  // Seleccionar el siguiente reto
  retoActual = pendientes[0];

  // Mostrar pantalla de código
  document.getElementById('bloqueoReto').style.display = "block";
  document.getElementById('zonaReto').style.display = "none";
  document.getElementById('respuesta').style.display = "none";
  document.querySelector('button[onclick="comprobarRespuesta()"]').style.display = "none";

  document.getElementById('codigoReto').value = "";
  document.getElementById('mensajeCodigoReto').textContent = "";
  document.getElementById('mensaje').textContent = "";
}

/****************************
 * VERIFICAR CÓDIGO DEL RETO
 ****************************/
function verificarCodigoReto() {

  let codigoIngresado = document
    .getElementById('codigoReto')
    .value
    .trim()
    .toLowerCase();

  let codigoCorrecto = retoActual.codigo.trim().toLowerCase();

  if (codigoIngresado === codigoCorrecto) {

    // Desbloquear reto
    document.getElementById('bloqueoReto').style.display = "none";
    document.getElementById('zonaReto').style.display = "block";
    document.getElementById('respuesta').style.display = "inline";
    document.querySelector('button[onclick="comprobarRespuesta()"]').style.display = "inline";

    // Mostrar contenido del reto
    document.getElementById('zonaReto').innerHTML = `
      <h2>Reto ${retoActual.id} · ${retoActual.area}</h2>
      <h3>${retoActual.titulo}</h3>
      <img src="${retoActual.imagen}">
      ${retoActual.descripcion}
    `;
if (window.MathJax) {
  MathJax.typeset();
}

  } else {
    document.getElementById('mensajeCodigoReto').textContent =
      "Código incorrecto. Inténtalo de nuevo.";
  }
}

/****************************
 * COMPROBAR RESPUESTA
 ****************************/
function comprobarRespuesta() {

  let respuesta = document
    .getElementById('respuesta')
    .value
    .trim()
    .toLowerCase();

  let solucion = retoActual.solucion.trim().toLowerCase();

  if (respuesta === solucion) {

    // Guardar reto como completado
    let hechos = JSON.parse(localStorage.getItem('retosHechos_' + usuario)) || [];
    hechos.push(retoActual.id);
    localStorage.setItem('retosHechos_' + usuario, JSON.stringify(hechos));

    document.getElementById('mensaje').textContent =
      "Reto superado. Pasando al siguiente reto...";

    // Espera de 5 segundos antes del siguiente reto
    setTimeout(() => {
      document.getElementById('respuesta').value = "";
      cargarReto();
    }, 5000);

  } else {
    document.getElementById('mensaje').textContent =
      "Respuesta incorrecta. Inténtalo de nuevo.";
  }
}





