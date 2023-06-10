//Variables
const formulario = document.querySelector("#formulario");
const listaGastos = document.querySelector("#lista-gastos");

//Eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

//Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  actualizarRestante() {
    //obtenemos la cantidad gastada haciendo uso del método reduce recorriendo nuestro array de gastos
    const cantidadGastada = this.gastos.reduce(
      (totalGastado, gasto) => totalGastado + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - cantidadGastada;
  }

  registrarGasto(objGasto) {
    this.gastos = [...this.gastos, objGasto];
    this.actualizarRestante();
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    //calculamos el restante sin el gasto eliminado
    this.actualizarRestante();
  }
}

class UI {
  mostrarPresupuesto(presupuesto) {
    document.querySelector("#presupuesto span").textContent = `$${presupuesto}`;
    document.querySelector("#restante span").textContent = `$${presupuesto}`;
  }

  mostrarAlerta(mensaje, tipoAlerta) {
    const alerta = document.createElement("div");
    alerta.textContent = mensaje;
    if (tipoAlerta === "error") {
      alerta.classList.add(
        "bg-red-200",
        "text-red-700",
        "p-2",
        "mb-3",
        "rounden-sm",
        "border",
        "border-red-500"
      );
    } else {
      alerta.classList.add(
        "bg-green-200",
        "text-green-700",
        "p-2",
        "mb-3",
        "rounded-sm",
        "border",
        "border-green-500"
      );
    }

    //insertamos la alerta antes del button del form
    formulario.insertBefore(alerta, document.querySelector("#btnAgregarGasto"));

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {
    //limpiar el HTML de los gastos
    this.limpiarGastos();

    gastos.forEach((gasto) => {
      const { nombreGasto, cantidad, id } = gasto;
      const liGasto = document.createElement("li");
      liGasto.className =
        "border border-gray-300 flex justify-between rounded-sm bg-gray-100 w-full items-center py-1 px-2 font-bold mb-1";
      liGasto.innerHTML = `${nombreGasto} <span class="bg-blue-600 text-white rounded-xl p-1 text-sm">$${cantidad}</span>`;
      liGasto.dataset.id = id;
      const btnEliminar = document.createElement("button");
      btnEliminar.innerHTML = "Borrar &times";
      btnEliminar.className =
        "bg-red-500 text-white rounded-sm p-1 hover:bg-red-600";
      btnEliminar.onclick = () => {
        eliminarGasto(id);
        this.mostrarGastoEliminado(nombreGasto, cantidad);
      };
      liGasto.appendChild(btnEliminar);
      //agregamos el gasto a la lista
      listaGastos.appendChild(liGasto);
    });
  }

  limpiarGastos() {
    while (listaGastos.firstChild) {
      listaGastos.removeChild(listaGastos.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante span").textContent = `$${restante}`;
  }

  modificarAlertaRestante(objPresupuesto) {
    const { presupuesto, restante } = objPresupuesto;
    const restanteDiv = document.querySelector("#restante");

    if (restante < presupuesto * 0.25) {
      restanteDiv.className =
        "bg-red-300 p-2 mb-2 border border-red-500 text-red-800";
    } else if (restante < presupuesto * 0.5) {
      restanteDiv.className =
        "bg-yellow-300 p-2 mb-2 border border-yellow-500 text-yellow-800";
    } else {
      restanteDiv.className =
        "bg-green-300 p-2 border border-green-500 text-green-800";
    }

    if (restante <= 0) {
      this.mostrarAlerta("El presupuesto se ha agotado", "error");
      const btnAgregarGasto = document.querySelector("#btnAgregarGasto");
      btnAgregarGasto.disabled = true;
      btnAgregarGasto.classList.add("opacity-80", "cursor-not-allowed");
    }else{
        btnAgregarGasto.disabled = false;
        btnAgregarGasto.classList.remove("opacity-80", "cursor-not-allowed");
    }
  }

  mostrarGastoEliminado(nombreGasto, cantidad) {
    const gastoEliminado = document.createElement('p');
    gastoEliminado.className = 'p-1 bg-gray-200 text-gray-600 rounded-md mb-4 border border-gray-400 text-center text-sm';
    gastoEliminado.innerHTML = `Gasto <span class="font-bold">"${nombreGasto}"</span> valor <span class="font-bold">$${cantidad}</span> eliminado`;
    document.querySelector('#divPresupuesto').insertBefore(gastoEliminado, document.querySelector('#presupuesto'));
    setTimeout(() => {
        gastoEliminado.remove();
    }, 3000);
  }
}

//Instanciación
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("¿Cuál es tu presupuesto para los gastos de esta semana?");

  if (
    presupuestoUsuario === "" ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario === null ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
    return;
  }

  ui.mostrarPresupuesto(presupuestoUsuario);

  //Instanciamos presupuesto
  presupuesto = new Presupuesto(presupuestoUsuario);
}

function agregarGasto(e) {
  e.preventDefault();

  const nombreGasto = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  if (gasto === "" || cantidad === "") {
    ui.mostrarAlerta("Todos los campos son obligatorios", "error");
    return;
  }

  ui.mostrarAlerta("Gasto ingresado correctamente", "exito");

  //registro las propiedades para llenar el array gastos de la case Presupuesto
  const objGasto = { nombreGasto, cantidad, id: Date.now() };
  presupuesto.registrarGasto(objGasto);

  //muestro los gastos en el HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  //actualizamos el restante
  ui.actualizarRestante(restante);
  //modificamos la alerta de restante
  ui.modificarAlertaRestante(presupuesto);
}

//Función para eliminar un gasto
function eliminarGasto(id) {
  presupuesto.eliminarGasto(id);
  //destructuring
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.modificarAlertaRestante(presupuesto);
}
