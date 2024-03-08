const endpointAI = "https://api.openai.com/v1/chat/completions";
// weather key: 0880fbba4dc55f0825b8b03ecbde81d3
function buscarAlbum() {
  let album = document.getElementById("Album").value;
  let Input = "Informacion sobre " + album; // Mover la inicialización de Input aquí

  const opcionesAI = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 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",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: Input }],
    }),
  };

  // Hacer la solicitud a la API
  fetch(endpointAI, opcionesAI)
    .then((response) => response.json())
    .then((data) => {
      // Mostrar el resultado en el elemento con ID 'resultado-openai'
      const resultadoElemento = document.getElementById("resultado-openai");
      resultadoElemento.textContent = data.choices[0].message.content;
    })
    .catch((error) => console.error("Error:", error));

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials&client_id=f332aac31e044c98afa884e4ff48e235&client_secret=8a035584a882435fbbbcffc9e3230b69",
  };

  const endpointSpotifyToken = "https://accounts.spotify.com/api/token";

  // Primero, obtén el token de acceso de Spotify
  fetch(endpointSpotifyToken, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const accessToken = data.access_token;

      // Una vez que tengas el token, usa fetch para hacer una solicitud GET a la API de Spotify
      const searchEndpoint = `https://api.spotify.com/v1/search?q=${album}&type=album`;
      return fetch(searchEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    })
    .then((response) => response.json())
    .then((data) => {
      // Muestra el resultado en la consola o en pantalla
      console.log(data.albums.items);
      // Aquí puedes manipular los datos recibidos y mostrarlos en pantalla como desees
      mostrarResultado(data.albums.items);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function mostrarResultado(albums) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = ""; // Limpiar resultados anteriores
  const albumsToShow = albums.slice(0, 3); // Obtener solo los primeros tres álbumes
  albumsToShow.forEach((album) => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("album");

    const albumName = document.createElement("p");
    albumName.textContent = album.name;

    const albumImage = document.createElement("img");
    albumImage.classList.add("w-32", "h-auto"); // Clases de Tailwind para ajustar el tamaño de la imagen
    albumImage.src = album.images[0].url; // La URL de la imagen está en el primer objeto de la matriz images

    albumDiv.appendChild(albumImage);
    albumDiv.appendChild(albumName);
    resultadoDiv.appendChild(albumDiv);
  });
}

async function getWeather() {
  const weatherKey = "0880fbba4dc55f0825b8b03ecbde81d3";
  const locationInput = document.getElementById("locationInput").value;

  // Obtener la latitud y longitud de la ubicación
  const locationResponse = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=5&appid=${weatherKey}`
  );
  const locationData = await locationResponse.json();
  const { lat, lon } = locationData[0];

  // Obtener el clima usando la latitud y longitud
  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}`
  );
  const weatherData = await weatherResponse.json();

  // Actualizar el resultado en el HTML
  const weatherResultElement = document.getElementById("weatherResult");
  weatherResultElement.textContent = `El clima en ${locationInput} es: ${weatherData.weather[0].description}`;
}
