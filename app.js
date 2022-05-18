const cards = document.getElementById('cards')
const cards2 = document.getElementById('cards2')
const footer = document.getElementById('footer')
const iteams = document.getElementById('items')
const botonfinalizar = document.getElementById('boton-finalizar')
const numeroitem = document.getElementById('numero-item')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito ={} //Collecion de objetos

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()

    if(localStorage.getItem('carrito') ){
        carrito = JSON.parse ( localStorage.getItem ('carrito') )
        pintarCarrito()
    }
   
   
})

cards.addEventListener('click' ,( e ) => {//creamos un evento click y lo mandamos addcarrito
    addCarrito(e)
    
})

cards2.addEventListener('click' ,(e) => {//creamos un evento click y lo mandamos addcarrito
    addCarrito(e)
})

iteams.addEventListener('click', (e)=>{ //creamos un evento click y lo mandamos btnAccion
    btnAccion(e)
    
})





//Conseguimos La DATA y la mandamos a la funcion 'pintarcards' como parametro
const fetchData = async() =>{
    try{
        const res = await fetch('stockBebible.json')
        const data = await res.json()

        const res2 = await fetch('stockComestible.json')
        const data2 = await res2.json()

        // console.log(data)

        pintarCards(data);
        pintarCards2(data2);
    
    }catch(error){
        console.log(error)
    }
}


//Pintamos La Informacion a la web Bebible
const pintarCards = data =>{
    data.forEach( producto => {
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('span').textContent = producto.Precio
        templateCard.querySelector('img').setAttribute("src",producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//Pintamos La Informacion a la web Comestible
const pintarCards2 = data2 =>{
    data2.forEach( producto => {
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('span').textContent = producto.Precio
        templateCard.querySelector('img').setAttribute("src",producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards2.appendChild(fragment)
}


const  addCarrito = (e) =>{ //eventoClick

    if (e.target.classList.contains('btn-dark') ){
        setCarrito(e.target.parentElement.parentElement) //empujamos la info a setCArrito
        
        console.log(e.target.parentElement.parentElement)

        alert();
    }
    
    
    e.stopPropagation();
}

const setCarrito = (objeto) =>{//Capturar los elementos enviamos en el parametro'objeto'
    // console.log(objeto)
    const producto = { //lo guardamos en un objeto
        id:objeto.querySelector('.btn-dark').dataset.id,
        Nombre:objeto.querySelector('h5').textContent,
        Precio:objeto.querySelector('span').textContent,
        img:objeto.querySelector('img').src,
        cantidad: 1,
    }

    carrito.hasOwnProperty(producto.id) && (producto.cantidad = carrito[producto.id].cantidad + 1)
    // if(carrito.hasOwnProperty(producto.id)) {
    //     producto.cantidad = carrito[producto.id].cantidad + 1
    // }
    carrito[producto.id] = {...producto} 
    pintarCarrito()
}

const pintarCarrito = () =>{
    iteams.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('img').src = producto.img
        templateCarrito.querySelectorAll('td')[0].textContent= producto.Nombre
        templateCarrito.querySelectorAll('td')[1].textContent= producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.Precio
        const clone =templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    }) 

    iteams.appendChild(fragment)
    pintarFooter()

    //cada vez que pintamos el carrito lo guardamos en el localStorage(carrito)
    localStorage.setItem( 'carrito' , JSON.stringify(carrito) )
    

}

const pintarFooter= () =>{
    footer.innerHTML = ""
    if(Object.keys(carrito).length === 0){ //Con esta logica sabemos si hay o no hay algun objeto en el carrito.
        footer.innerHTML =  `
                            <th scope="row" colspan="5">

                            Carrito vacío - comience a comprar!

                            </th>

                            `
        return
    }

    botonfinalizar.innerHTML = ""
    if(Object.keys(carrito).length > 0){ 
        botonfinalizar.innerHTML =  
        `
    
            <button type="button" class="btn btn-secundary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Finalizar Compra
            </button>

            <!-- Modal -->
            
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">CONFIRMAR TU COMPRA</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">
                            <div class="container-form">
                                <div class="wrapper">

                                    <form id="formConfirmar">
                                        <div class="form-group">
                                            <label for="name">Nombre Completo</label>
                                                <input type="text" name="Name" id="name" placeholder="Juan Perez" required minlength="3" maxlength="25" />
                                                        
                                        </div>
                            
                                        <div class="form-group">
                                            <label for="email">Email</label>
                                            <input type="email" name="Email" id="email" placeholder="E-mail" required />
                                        </div>

                                        <div class="form-group">
                                            <label for="direccion">Direccion</label>
                                            <input type="text" name="Direccion" id="direccion" placeholder="Calle falsa 123" required />
                                        </div>

                                        <div class="form-group">
                                            <button type="submit" id="botonConfirmacion"  data-target="#modalConfirmacion" class="submit">
                                                CONFIRMAR COMPRA
                                            </button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        
    }

    // Le envio el evento Submit a la funcion validarFormulario
    const botonConfirmacion = document.getElementById('formConfirmar')
    botonConfirmacion.addEventListener('submit',(e) => {
        validarFormulario(e)
    })


    // Suma de la cantidad y total
    const nCantidad = Object.values(carrito).reduce( (acc, {cantidad} ) => acc + cantidad, 0 )
    const nPrecio = Object.values(carrito).reduce ((acc,{cantidad,Precio}) => acc + Precio * cantidad, 0 )
    
    // Hago los cambios
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    numeroitem.innerHTML = `${nCantidad}`

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)    
    footer.appendChild(fragment)

    //Evento con el boton Vaciar Carrito + sweetalert 
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => { 
        Swal.fire({
            title: '¿Borrar el carrito de compras?',
            text: "Esta accion no se podra revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si,Eliminar',
            cancelButtonText: 'Cancelar',
            background: 'bisque',
        
            
            
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                  title:'Carrito Vaciado',
                  icon:'success',
                  background: 'bisque',
              })
              carrito = {} 
              pintarCarrito ()
              numeroitem.innerHTML = `${0}`
              botonfinalizar.innerHTML =''
            }
          })

    })

    // console.log(nCantidad)
    // console.log(nPrecio)
}

const btnAccion = (e)=>{

    //Accion de aumentar
    if(e.target.classList.contains('btn-info')){
        // console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        alert()
        pintarCarrito ()
    }
    //Accion de Disminuir
    if(e.target.classList.contains('btn-danger')){
        // console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        // producto.cantidad === 0 && delete carrito[e.target.dataset.id]
        if(producto.cantidad === 0 ){ 
            delete carrito[e.target.dataset.id]
            numeroitem.innerHTML = `${0}`
            botonfinalizar.innerHTML =''
        }
        pintarCarrito ()
        alert2()
    }

    
}

const validarFormulario = (e) =>{
    e.preventDefault ();
    console.log(e.type)

    if(e.type = 'submit'){
        alert3()
    }
    
}


//funciones de alerta Toast
const alert = () =>{
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        color: '#716add',
        icon: 'success',
        title: 'Se añadio al carrito',
        background: 'bisque',
      })
}

const alert2 = () =>{
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        color: 'red',
        icon: 'success',
        title: 'Se elimino del carrito',
        background: 'bisque',
      })

}

const alert3 = ()=>{
    Swal.fire(
        'El Pedido esta en Camino',
        '¡Su compra ha sido realizada con éxito',
        'success',
      )

    carrito = {} 
    pintarCarrito ()
    numeroitem.innerHTML = `${0}`
    botonfinalizar.innerHTML =''
}





