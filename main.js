/* Fondo de Video */
var videoElemento = document.getElementById('videoFondo');

/* function videoCarga() {
    var videoFuente = document.createElement('source');
    videoFuente.src = "video/intro.mp4";
    videoFuente.type = "video/mp4";
    videoElemento.appendChild(videoFuente);
    videoElemento.load();
}
videoCarga(); */

const changeTheme = document.getElementById('changeTheme');
const body = document.body

changeTheme.addEventListener('click', () => {
    localStorage.getItem('body');
    if(body.style.backgroundColor === "white") {
        body.style.backgroundColor = "black";
    } else {
        body.style.backgroundColor = "white";
    }
});

// Variable para almacenar todas los departamentos
let todosLosDpto = [];
// Variable para almacenar todos las ciudades
let todasLasCiudades = [];

const API_URL = 'http://localhost:3000';
const dataURL = 'data.json'; // Ruta al archivo JSON de datos

function verificarDptoDuplicado(dptoName) {
    return fetch(`${API_URL}/Departamentos?nomDepartamento=${dptoName}`)
        .then((response) => response.json())
        .then((departamentos) => {
            return departamentos.length > 0; // Devuelve true si se encontraron departamentos con el mismo nombre
        })
        .catch((error) => {
            console.error('Error al verificar departamento duplicado:', error);
        });
}

function verificarCityDuplicada(cityName, cityId) {
    return fetch(`${API_URL}/Ciudades?NomCiudad=${cityName}&departamentoId=${cityId}`)
        .then((response) => response.json())
        .then((ciudades) => {
            return ciudades.length > 0; // Devuelve true si se encontraron las ciudades con el mismo nombre y departamentoId
        })
        .catch((error) => {
            console.error('Error al comprobar la ciudad duplicada:', error);
        });
}

function mostrarDetallesDpto(dptoName) {
    // Obtener los datos de los departamentos directamente del archivo JSON
    fetch(dataURL)
        .then((response) => response.json())
        .then((data) => {
            const dpto = data.Departamentos.find((r) => r.nomDepartamento === dptoName);
            if (dpto) {
                // Muestra los detalles de la departamentos en un diálogo modal
                Swal.fire({
                    title: dpto.nomDepartamento,
                    html: `
                    <p><strong>Dpto ID:</strong> ${dpto.id}</p>
                    `,
                    confirmButtonText: 'Cerrar'
                });
            } else {
                console.error('Dpto no encontrado');
            }
        })
        .catch((error) => {
            console.error('Error al cargar los detalles de los departamentos:', error);
        });
}

function mostrarDetallesCity(cityName) {
    // Obtener los datos de las ciudades directamente del archivo JSON
    fetch(dataURL)
        .then((response) => response.json())
        .then((data) => {
            const city = data.Ciudades.find((p) => p.nomCiudad === cityName);
            if (city) {
                // Muestra los detalles de las ciudades en un diálogo modal
                Swal.fire({
                    title: city.nomCiudad,
                    html: `
                    <p><strong>Dpto ID:</strong> ${city.departamentoId}</p>
                    <p><strong>Imagen:</strong></p>
                    <img src="${city.imagen}" alt="Imagen de la Ciudad" style="width: 200px; height: auto;">
                    `,
                    confirmButtonText: 'Cerrar'
                });
            } else {
                console.error('Ciudad no encontrado');
            }
        })
        .catch((error) => {
            console.error('Error al cargar detalles de la ciudad:', error);
        });
}

function confirmarEditarDpto(cityId) {
    // Obtener el nombre de los departamentos correspondiente al cityId
    fetch(`${API_URL}/Departamentos/${cityId}`)
        .then((response) => response.json())
        .then((dpto) => {
            const dptoName = dpto.nomDepartamento;

            Swal.fire({
                title: 'Editar Dpto',
                text: `¿Deseas editar el dpto "${dptoName}"?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        mostrarDptoEditarForm(cityId);
                    }
                });
        })
        .catch((error) => {
            console.error('Error al cargar el Dpto:', error);
        });
}

function confirmarEditarCity(cityId) {
    // Obtener los datos de las ciudades correspondiente al cityId
    fetch(`${API_URL}/Ciudades/${cityId}`)
        .then((response) => response.json())
        .then((city) => {
            const cityName = city.nomCiudad;

            Swal.fire({
                title: 'Editar Ciudad',
                text: `¿Deseas editar la Ciudad "${cityName}"?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        mostrarCityEditarForm(cityId);
                    }
                });
        })
        .catch((error) => {
            console.log('Error al cargar la ciudad:', error);
        });
}

function mostrarDptoEditarForm(cityId) {
    // Obtener el nombre de los departamentos correspondiente al cityId
    fetch(`${API_URL}/Departamentos/${cityId}`)
        .then((response) => response.json())
        .then((dpto) => {
            const dptoName = dpto.nomDepartamento;

            Swal.fire({
                title: 'Editar Dpto',
                html: `
                <p>Dpto a editar: ${dptoName}</p>
                <input type="text" id="edit-dpto-name-input" placeholder="Nuevo Nombre de Dpto" required>
                `,
                confirmButtonText: 'Guardar Cambios',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const newDptoName = document.getElementById('edit-dpto-name-input').value;
                    return editarDpto(cityId, newDptoName);
                }
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        const { value } = result;
                        if (value) {
                            console.log('Dpto editado exitosamente');
                            cargarDpto();
                        } else {
                            console.error('Error al editar el Dpto');
                        }
                    }
                });
        })
        .catch((error) => {
            console.error('Error al cargar el Dpto:', error);
        });
}

function mostrarCityEditarForm(cityId) {
    // Obtener los datos de la ciudad correspondiente al cityId
    fetch(`${API_URL}/Ciudades/${cityId}`)
        .then((response) => response.json())
        .then((city) => {
            const cityName = city.nomCiudad;
            const cityImage = city.imagen;

            Swal.fire({
                title: 'Editar Ciudad',
                html: `
                <p>Llenar todos los campos, Thanks!</p>
                <p>Ciudad a editar: ${cityName}</p>
                <input type="text" id="edit-city-name-input" placeholder="Nuevo nombre de Ciudad" required>
                <input type="text" id="edit-city-image-input" placeholder="Nueva imagen de Ciudad" required>
                `,
                confirmButtonText: 'Guardar Cambios',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const newPointName = document.getElementById('edit-city-name-input').value;
                    const newPointImage = document.getElementById('edit-city-image-input').value;
                    return editarCity(cityId, newPointName, newPointImage);
                }
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        const { value } = result;
                        if (value) {
                            console.log('Ciudad editada exitosamente!');
                            cargarCity();
                        } else {
                            console.log('Error al editar la ciudad!');
                        }
                    }
                });
        })
        .catch((error) => {
            console.log('Error al cargar el ciudad:', error);
        });
}

function editarDpto(cityId, dptoName) {
    const dpto = { nomDepartamento: dptoName };

    return fetch(`${API_URL}/Departamentos/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dpto),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud de edicion');
            }
        })
        .then((updatedDpto) => {
            // Actualizar los datos en el localStorage
            const departamentos = JSON.parse(localStorage.getItem('routes')) || [];
            const dptoIndex = departamentos.findIndex((dpto) => dpto.id === cityId.toString());
            if (dptoIndex !== -1) {
                departamentos[dptoIndex] = updatedDpto;
                localStorage.setItem('routes', JSON.stringify(departamentos));
            }

            return updatedDpto;
        })
        .catch((error) => {
            console.error('Error al editar el Dpto:', error);
        });
}

function editarCity(cityId, cityName, cityImage) {
    const city = {
        nomCiudad: cityName,
        imagen: cityImage,
    };

    return fetch(`${API_URL}/Ciudades/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(city),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud de edicion!');
            }
        })
        .then((updatedPoint) => {
            // Actualizar los datos en el localStorage
            const ciudades = JSON.parse(localStorage.getItem('points')) || [];
            const pointIndex = ciudades.findIndex((city) => city.id === cityId.toString());
            if (pointIndex !== -1) {
                ciudades[pointIndex] = updatedPoint;
                localStorage.setItem('points', JSON.stringify(ciudades));
            }

            return updatedPoint;
        })
        .catch((error) => {
            console.error('Error al editar la ciudad:', error);
        });
}

function confirmarBorrarDpto(cityId) {
    // Obtener los datos de los departamentos correspondiente al cityId
    fetch(`${API_URL}/Departamentos/${cityId}`)
        .then((response) => response.json())
        .then((dpto) => {
            const dptoName = dpto.nomDepartamento;
            Swal.fire({
                title: 'Eliminar Dpto',
                html: `Al eliminar el dpto "${dptoName}", eliminas sus ciudades correspondientes!
                ¿Aceptas?`,
                text: ``,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        borrarDpto(cityId);
                    }
                });
        })
        .catch((error) => {
            console.error('Error al cargar el Dpto:', error);
        })
}

function confirmarBorrarCity(cityId) {
    // Obtener los datos de la ciudad correspondiente al cityId
    fetch(`${API_URL}/Ciudades/${cityId}`)
        .then((response) => response.json())
        .then((city) => {
            const cityName = city.nomCiudad;
            const cityImage = city.imagen;
            const pointCityId = city.departamentoId;
            Swal.fire({
                title: 'Eliminar Ciudad',
                text: `¿Deseas eliminar esta ciudad "${cityName}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        borrarCity(cityId);
                    }
                })
        })
}

function borrarDpto(cityId) {
    fetch(`${API_URL}/Departamentos/${cityId}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.ok) {
                console.log('Dpto eliminado exitosamente!');

                // Eliminar las ciudades asociados al Dpto en el JSON SERVER
                eliminarCityPorDptoId(cityId);

                // Eliminar el Dpto del localStorage
                const departamentos = JSON.parse(localStorage.getItem('routes')) || [];
                const updatedDptos = departamentos.filter((dpto) => dpto.id !== cityId.toString());
                localStorage.setItem('routes', JSON.stringify(updatedDptos));
            } else {
                console.log('Error al eliminar la dpto!');
            }
        })
        .then(() => {
            // ... Codigos Adicionales de Apoyo
        })
        .catch((error) => {
            console.error('Error al eliminar la dpto:', error);
        });
}

function eliminarCityPorDptoId(cityId) {
    fetch(`${API_URL}/Ciudades?departamentoId=${cityId}`, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((ciudades) => {
            if (Array.isArray(ciudades)) {
                const deletePointPromises = ciudades.map((city) =>
                    borrarCity(city.id)
                );
                return Promise.all(deletePointPromises);
            }
        })
        .then(() => {
            console.log('Ciudades eliminados exitosamente!');
            cargarDpto();
            cargarCity();
        })
        .catch((error) => {
            console.error('Error al eliminar las ciudades:', error);
        });
}

function borrarCity(cityId) {
    fetch(`${API_URL}/Ciudades/${cityId}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.ok) {
                console.log('Ciudad eliminada exitosamente!');

                // Eliminar la ciudad del localStorage
                const ciudades = JSON.parse(localStorage.getItem('points')) || [];
                const updatedPoints = ciudades.filter((city) => city.id !== cityId.toString());
                localStorage.setItem('points', JSON.stringify(updatedPoints));
            } else {
                console.log('Error al eliminar la ciudad!');
            }
        })
        .catch((error) => {
            console.error('Error al eliminar la ciudad:', error);
        })
}

const añadirDptoForm = document.getElementById('add-route-form');
const añadirCityForm = document.getElementById('add-point-form');
const dptoTable = document.getElementById('listaDpto');

añadirDptoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar recargar la pagina

    const dptoNameInput = document.getElementById('dpto-name-input');
    const dptoName = dptoNameInput.value;
    verificarDptoDuplicado(dptoName)
        .then((isDuplicate) => {
            if (isDuplicate) {
                Swal.fire({
                    title: 'Dpto Duplicado',
                    text: 'Ya existe un dpto con el mismo nombre.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                añadirDpto(dptoName)
                    .then(() => {
                        dptoNameInput.value = '';
                        console.log('Dpto agregada exitosamente');
                        cargarDpto();
                    })
                    .catch((error) => {
                        console.error('Error al agregar la dpto:', error);
                    });
            }
        });
});

añadirCityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cityNameInput = document.getElementById('city-name-input');
    const cityImageInput = document.getElementById('city-image-input');
    const dptoSelect = document.getElementById('route-select');
    const cityId = dptoSelect.value;
    const cityName = cityNameInput.value;
    const cityImage = cityImageInput.value;

    verificarCityDuplicada(cityName, cityId)
        .then((isDuplicate) => {
            if (isDuplicate) {
                Swal.fire({
                    title: 'Ciudad Duplicado',
                    text: 'Ya existe una ciudad con el mismo nombre en este dpto.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                añadirCity(cityId, cityName, cityImage)
                    .then(() => {
                        cityNameInput.value = '';
                        cityImageInput.value = '';
                        console.log('Ciudad agregado exitosamente');
                    })
                    .catch((error) => {
                        console.error('Error al agregar el ciudad:', error);
                    });
            }
        });
});

function añadirDpto(dptoName) {
    const dpto = {
        id: null, // Establecer el ID como null para que sea asignado por el JSON SERVER
        nomDepartamento: dptoName
    };

    return fetch(`${API_URL}/Departamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dpto),
    })
        .then((response) => response.json())
        .then((newDpto) => {
            newDpto.id = newDpto.id.toString(); // Convertir el ID a cadena

            // Guardar los datos en el localStorage
            const departamentos = JSON.parse(localStorage.getItem('routes')) || [];
            departamentos.push(newDpto);
            localStorage.setItem('routes', JSON.stringify(departamentos));

            return newDpto;
        })
        .catch((error) => {
            console.error('Error al agregar el dpto:', error);
        });
}

function añadirCity(cityId, cityName, cityImage) {
    const city = {
        id: null, // Establecer el ID como null para que sea asignado por el JSON SERVER
        nomCiudad: cityName,
        departamentoId: parseInt(cityId),
        imagen: cityImage,
    };

    return fetch(`${API_URL}/Ciudades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(city),
    })
        .then((response) => response.json())
        .then((newPoint) => {
            newPoint.id = newPoint.id.toString(); // Convertir el ID a cadena

            // Guardar los datos en el localStorage
            const ciudades = JSON.parse(localStorage.getItem('points')) || [];
            ciudades.push(newPoint);
            localStorage.setItem('points', JSON.stringify(ciudades));

            return newPoint;
        })
        .catch((error) => {
            console.error('Error al agregar la ciudad:', error);
        });
}

// Obtener todos los departamentos al cargar la pagina
const dptoDelLocalStorage = JSON.parse(localStorage.getItem('routes')) || [];
todosLosDpto = dptoDelLocalStorage;
renderizarDpto(dptoDelLocalStorage);

// Obtener todas las ciudades al cargar la pagina
const cityDelLocalStorage = JSON.parse(localStorage.getItem('points')) || [];
todasLasCiudades = cityDelLocalStorage;
renderizarCity(cityDelLocalStorage);

function renderizarDpto(departamentos) {
    const tbody = dptoTable.querySelector('tbody');
    tbody.innerHTML = '';

    if (Array.isArray(departamentos)) {
        departamentos.forEach((dpto) => {
            const row = document.createElement('tr');
            row.innerHTML = `
      <td>${dpto.id}</td>
      <td>${dpto.nomDepartamento}</td>
      <td>
        <button class="editar" onclick="confirmarEditarDpto(${dpto.id})">Editar</button>
        <button class="info" onclick="mostrarDetallesDpto('${dpto.nomDepartamento}')">Info</button>
        <button class="borrar" onclick="confirmarBorrarDpto(${dpto.id})">Borrar</button>
      </td>
      `;
            tbody.appendChild(row);
        });
    }
}

function renderizarOpcionesDpto(departamentos) {
    const dptoSelect = document.getElementById('route-select');

    if (Array.isArray(departamentos)) {
        departamentos.forEach((dpto) => {
            const option = document.createElement('option');
            option.value = dpto.id;
            option.textContent = dpto.id; // Usar el ID general como etiqueta de opción
            dptoSelect.appendChild(option);
        });
    }
}

function renderizarCity(ciudades) {
    const tbody = document.getElementById('listaCiudades').querySelector('tbody');
    tbody.innerHTML = '';

    if (Array.isArray(ciudades)) {
        ciudades.forEach((city) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${city.id}</td>
        <td>${city.nomCiudad}</td>
        <td>${city.departamentoId}</td>
        <td><img src="${city.imagen}" alt="Imagen de la ciudad" style="width: 100px; height:50px;"></td>
        <td>
          <button class="editar" onclick="confirmarEditarCity(${city.id})">Editar</button>
          <button class="info" onclick="mostrarDetallesCity('${city.nomCiudad}')">Info</button>
          <button class="borrar" onclick="confirmarBorrarCity(${city.id})">Borrar</button>
        </td>
      `;
            tbody.appendChild(row);
        });
    }
}

function cargarDpto() {
    const dptoDelLocalStorage = JSON.parse(localStorage.getItem('routes')) || [];

    if (dptoDelLocalStorage.length > 0) {
        todosLosDpto = dptoDelLocalStorage;
        renderizarDpto(dptoDelLocalStorage);
        renderizarOpcionesDpto(dptoDelLocalStorage);
    } else {
        fetch(`${API_URL}/Departamentos`)
            .then((response) => response.json())
            .then((departamentos) => {
                todosLosDpto = departamentos;
                localStorage.setItem('routes', JSON.stringify(departamentos));
                renderizarDpto(departamentos);
                renderizarOpcionesDpto(departamentos);
            })
            .catch((error) => {
                console.error('Error loading routes:', error);
            });
    }
}

function cargarCity() {
    const cityDelLocalStorage = JSON.parse(localStorage.getItem('points')) || [];

    if (cityDelLocalStorage.length > 0) {
        todasLasCiudades = cityDelLocalStorage;
        renderizarCity(cityDelLocalStorage);
    } else {
        fetch(`${API_URL}/Ciudades`)
            .then((response) => response.json())
            .then((ciudades) => {
                todasLasCiudades = ciudades;
                localStorage.setItem('points', JSON.stringify(ciudades));
                renderizarCity(ciudades);
            })
            .catch((error) => {
                console.error('Error loading points:', error);
            });
    }
}

// Agregar evento de entrada en el campo de busqueda
document.getElementById("buscador-departamentos").addEventListener("input", buscarDpto);


// Obtener todos los departamentos al cargar la pagina
fetch(`${API_URL}/Departamentos`)
    .then((response) => response.json())
    .then((departamentos) => {
        todosLosDpto = departamentos;
        actualizarListaDpto(todosLosDpto);
    })
    .catch((error) => {
        console.error('Error loading routes:', error);
    });

// Funcion para buscar departamentos por su nombre
function buscarDpto() {
    const filtro = document.getElementById("buscador-departamentos").value.trim();
    const mensajeElement = document.getElementById("mensaje-departamento");

    // Restablecer el contenido del mensaje a una cadena vacia
    mensajeElement.textContent = "";

    if (filtro === "") {
        // Si el campo de busqueda esta vacio, mostrar todos los departamentos
        actualizarListaDpto(todosLosDpto);
    } else {
        // Filtrar los departamentos segun el nombre
        const dptoFiltrados = todosLosDpto.filter((dpto) =>
            dpto.nomDepartamento.toLowerCase().includes(filtro.toLowerCase())
        );

        if (dptoFiltrados.length > 0) {
            // Si se encontraron departamentos que coinciden con el filtro, mostrarlas
            actualizarListaDpto(dptoFiltrados);
        } else {
            // Si no se encontraron departamentos, mostrar mensaje de no encontrado
            mensajeElement.textContent = `No se encontró ninguno dpto con el nombre "${filtro}"`;
            actualizarListaDpto([]);
        }
    }
}

function actualizarListaDpto(dptoMostrar) {
    const tablaDptoElement = document.getElementById("listaDpto");
    const tablaHTML =
        "<table>" +
        "<thead>" +
        "<tr>" +
        "<th>ID</th>" +
        "<th>Dpto</th>" +
        "<th>Acciones</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>" +
        "</table>";

    // Agregar la tabla de departamentos al elemento HTML
    tablaDptoElement.innerHTML = tablaHTML;

    // Obtener el cuerpo de la tabla
    const tbodyElement = tablaDptoElement.querySelector("tbody");

    // Si no se proporciona la lista de departamentos a mostrar, se utiliza la lista completa
    if (!dptoMostrar) {
        dptoMostrar = todosLosDpto;
    }

    // Generar las filas de la tabla con los datos de los departamentos
    const filasHTML = dptoMostrar.map(function (dpto) {
        return (
            "<tr>" +
            "<td>" +
            dpto.id +
            "</td>" +
            "<td>" +
            dpto.nomDepartamento +
            "</td>" +
            "<td>" +
            "<button class=\"editar-button\" onclick=\"confirmarEditarDpto(" +
            dpto.id +
            ")\">Editar</button>" +
            "<button class=\"info-button\" onclick=\"mostrarDetallesDpto('" +
            dpto.nomDepartamento +
            "')\">Info</button>" +
            "<button class=\"eliminar-button\" onclick=\"confirmarBorrarDpto(" +
            dpto.id +
            ")\">Borrar</button>" +
            "</td>" +
            "</tr>"
        );
    });

    // Agregar las filas al cuerpo de la tabla
    tbodyElement.innerHTML = filasHTML.join("");
}

// Obtener todas las ciudades al cargar la página
fetch(`${API_URL}/Ciudades`)
    .then((response) => response.json())
    .then((ciudades) => {
        todasLasCiudades = ciudades;
        actualizarlistaCiudades(todasLasCiudades);
    })
    .catch((error) => {
        console.error('Error loading points:', error);
    });

// Funcion para buscar las ciudades por nombre y departamentoId
function buscarCity() {
    const filtro = document.getElementById("buscador-ciudades").value.trim();
    const mensajeElement = document.getElementById("mensaje-ciudades");

    // Restablecer el contenido del mensaje a una cadena vacia
    mensajeElement.textContent = "";

    if (filtro === "") {
        // Si el campo de busqueda esta vacio, mostrar todos las ciudades
        actualizarlistaCiudades(todasLasCiudades);
    } else {
        // Filtrar las ciudades segun el nombre y departamentoId
        const ciudadesFiltrados = todasLasCiudades.filter((city) =>
            city.nomCiudad && city.nomCiudad.toLowerCase().includes(filtro.toLowerCase()) ||
            city.departamentoId.toString() === filtro
        );

        if (ciudadesFiltrados.length > 0) {
            // Si se encontraron las ciudades que coinciden con el filtro, mostrarlos
            actualizarlistaCiudades(ciudadesFiltrados);
        } else {
            // Si no se encontraron las ciudades, mostrar mensaje de no encontrado
            mensajeElement.textContent = `No se encontro ninguna ciudad con el nombre "${filtro}" o el ID del Departamento "${filtro}"`;
            actualizarlistaCiudades([]);
        }
    }
}

// Funcion para actualizar la lista de las ciudades en el HTML
function actualizarlistaCiudades(cityMostrar) {
    const tablaCiudadesElement = document.getElementById("listaCiudades");
    const tablaHTML =
        "<table>" +
        "<thead>" +
        "<tr>" +
        "<th>ID</th>" +
        "<th>Ciudad</th>" +
        "<th>Dpto ID</th>" +
        "<th>Imagen</th>" +
        "<th>Acciones</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>" +
        "</table>";

    // Agregar la tabla de las ciudades al elemento HTML
    tablaCiudadesElement.innerHTML = tablaHTML;

    // Obtener el cuerpo de la tabla
    const tbodyElement = tablaCiudadesElement.querySelector("tbody");

    // Si no se proporciona la lista de las ciudades a mostrar, se utiliza la lista completa
    if (!cityMostrar) {
        cityMostrar = todasLasCiudades;
    }

    // Generar las filas de la tabla con los datos de las ciudades
    const filasHTML = cityMostrar.map(function (city) {
        return (
            "<tr>" +
            "<td>" + city.id + "</td>" +
            "<td>" + city.nomCiudad + "</td>" +
            "<td>" + city.departamentoId + "</td>" +
            "<td><img src=\"" + city.imagen + "\" alt=\"Imagen de la Ciudad\" style=\"width: 100px; height: 50px;\"></td>" +
            "<td>" +
            "<button class=\"editar\" onclick=\"confirmarEditarCity(" + city.id + ")\">Editar</button>" +
            "<button class=\"info\" onclick=\"mostrarDetallesCity('" + city.nomCiudad + "')\">Info</button>" +
            "<button class=\"borrar\" onclick=\"confirmarBorrarCity(" + city.id + ")\">Borrar</button>" +
            "</td>" +
            "</tr>"
        );
    });

    // Agregar las filas al cuerpo de la tabla
    tbodyElement.innerHTML = filasHTML.join("");
}

// Llamar a la funcion buscarCity despues de obtener las ciudades a traves de fetch
document.getElementById("buscador-ciudades").addEventListener("input", buscarCity);

cargarDpto();
cargarCity();