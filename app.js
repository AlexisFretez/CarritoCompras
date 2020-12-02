document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    // console.log(data);
    pintarProductos(data);
    detectarBotones(data);
  } catch (error) {
    console.log(error);
  }
};

const contenedorProductos = document.querySelector("#contenedor-productos");
const pintarProductos = data => {
  const template = document.querySelector("#template-productos").content;
  const fragment = document.createDocumentFragment();
  //console.log(template);

  data.forEach(producto => {
    //console.log(producto);
    template.querySelector("img").setAttribute("src", producto.thumbnailUrl);

    template.querySelector("h5").textContent = producto.title;
    template.querySelector("p span").textContent = producto.precio;
    template.querySelector("button").dataset.id = producto.id;
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  contenedorProductos.appendChild(fragment);
};

let carrito = {};

const detectarBotones = data => {
  const botones = document.querySelectorAll(".card button");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      console.log(btn.dataset.id);
      const producto = data.find(item => item.id === parseInt(btn.dataset.id));
      producto.cantidad = 1;
      if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
      }
      carrito[producto.id] = { ...producto };
      console.log(carrito);
      pintarCarrito();
    });
  });
};
const items = document.querySelector("#items");
const pintarCarrito = () => {
  //pendiente innerHTML
  items.innerHTML = "";
  const template = document.querySelector("#template-carrito").content;
  const fragment = document.createDocumentFragment();
  Object.values(carrito).forEach(producto => {
    console.log(producto);
    template.querySelector("th").textContent = producto.id;
    template.querySelectorAll("td")[0].textContent = producto.title;
    template.querySelectorAll("td")[1].textContent = producto.cantidad;
    template.querySelector("span").textContent =
      producto.precio * producto.cantidad;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter();
  accionBotones();
};

const footer = document.querySelector("#footer-carrito");

const pintarFooter = () => {
  footer.innerHTML = "";

  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
     <th scope="row" colspan="5"> Carrito Vacio </th>
     `;
    return;
  }
  const template = document.querySelector("#template-footer").content;
  const fragment = document.createDocumentFragment();
  //sumar cantidad y sumar totales
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  //aca para sumar el precioTotal
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  console.log(nPrecio);
  //pintamos el suma de las cantidades
  template.querySelectorAll("td")[0].textContent = nCantidad;
  //pintamos el total de Precio
  template.querySelector("span").textContent = nPrecio;
  const clone = template.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const boton = document.querySelector("#vaciar-carrito");
  boton.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};
const accionBotones = () => {};
