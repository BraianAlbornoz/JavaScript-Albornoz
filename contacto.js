let enviarFormularioContacto = document.getElementById('enviarFormularioContacto');

enviarFormularioContacto.addEventListener('submit',(e) =>{
    validarFormulario(e)
})


const validarFormulario = (e) =>{
    e.preventDefault ();
    console.log(e.type)

    if(e.type = 'submit'){
        alert()
        enviarFormularioContacto.reset();
    }
    
}

const alert = ()=>{
    Swal.fire(
        'Mensaje Enviado',
        '¡Su Mensaje a sido realizada con éxito',
        'success',
      )   
}