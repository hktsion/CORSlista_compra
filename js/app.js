'use strict';
const tipos = ["VERDURAS", "LACTEOS", "CARNICOS", "DULCES", "BEBIDAS", "LIMPIEZA"];
var listaApp = {};

;(function(d, app){
  let arrayList = new Array();

  function inicialiarApp(){
    (d.getElementById('inp-item')).style.pointerEvents = 'none';
    (d.getElementById('btn-item')).style.pointerEvents = 'none';
    (d.getElementById('btn-item')).style.backgroundColor = '#aaaaaa';
    (d.querySelector('section > ul')).style.display = 'none';
    cargarLista();
  }

  function cargarLista(){
    let input = d.getElementById('inp-lista');

    input.addEventListener('keypress', function(e){
      if(e.keyCode == 13 && 
        (e.target.value.trim().toLowerCase() == 'lista001') ||
        e.target.value.trim().toLowerCase() == 'lista002' ){ getLista(e.target); }
    }, true);
    (d.getElementById('btn-lista')).addEventListener('click', function(){
      if( input.value.trim().toLowerCase() == 'lista001' || input.value.trim().toLowerCase() == 'lista002'  ){ 
        let ul = d.querySelector('section > ul');
        if(ul.childElementCount != 0){
          dom_listarProductos(arrayList);
        }else{
          getLista(input); 
        }
        console.log(arrayList);
      }
    });
    (d.getElementById('btn-item')).addEventListener('click', (e)=>{
      switch(e.target.value){
        case 'Modificar': dom_editarProducto();  break;
        case 'Agregar':  dom_agregarProducto(e.target.value); break; 
        default: break;
      }
    });
  }

  function getLista(target){
    let file = (target.value).trim() + '.lst';
    file = file.substring(0, 1).toUpperCase() + file.substring(1);
    (d.querySelector('header > h3 > span')).innerHTML = file;
    getCORS(file, procesarLista);
  }

  // Crear el objeto XHR y realiza la petición CORS
  function getCORS(archivo, fcallback) {
    let URL = "http://localhost/corslista_compra/datos/";
    let xhr = new XMLHttpRequest();

    if ("withCredentials" in xhr) {
      xhr.open('POST', URL+archivo, true);
    } else if (typeof XDomainRequest != "undefined") {
      xhr = new XDomainRequest();
      xhr.open('POST', URL+archivo);
    } else {
      xhr = null;
    }
    if (!xhr) {alert('no soporta CORS'); return;}
    xhr.send();
    xhr.onload = function() { };
    xhr.onerror = function() { alert('Error de respuesta'); };
    xhr.onloadend = function(){
      fcallback(xhr.responseText);
    }
  }

  function filtarElementos(str){
    let aux = str.split('|');
    if( (aux.length < 4) && (aux.length > 2) && ( aux[2].trim() == 'si' || aux[2].trim() == 'no' )){
      return aux;
    }
    return null;
  }

  function ordenarProductos(array){
    array.sort(function(a,b){ return b['id']-a['id'];});
  }

  function dom_addULListeners(){
    (d.querySelector('ul')).addEventListener('click', function(event){
      let elem = event.target.nodeName.toLowerCase();
      switch (elem) {
        case 'li': alert('editar producto'); break;
        case 'big': 
        if(event.target.textContent == '♻'){
          dom_recogerPropiedadesProducto(event.target);
        }
        if(event.target.textContent == '⛌'){
          dom_eliminarProducto(event.target);
        }
        break;
        default: break;
      }
    }, true);
  }

  function dom_recogerPropiedadesProducto(item){
    (d.getElementById('btn-item')).value = 'Modificar';
    (d.getElementById('inp-item')).value = item.parentNode.parentNode.children[1].textContent + '|' + item.parentNode.parentNode.children[1].dataset.tipo + '|' + 'si';
    alert('Hay que acabar de editar el producto');
  }

  function dom_eliminarProducto(item){
    let li_padre = item.parentNode.parentNode;
    let opacidad = 1;
    let idVal = setInterval(function(){
      li_padre.style.opacity = opacidad;
      opacidad-=0.2
      if(opacidad < 0){
        li_padre.style.display = 'none';
      }
    }, 120);

    refrescarArrayList(1, li_padre.getAttribute('id'));
    dom_listarProductos(arrayList);
  }

  function refrescarArrayList(quehacer, id){
    switch(quehacer){
      case 1 :
      arrayList.forEach(function(item,pos){
        if(item.hasOwnProperty('id')){
          if(item['id'] == id){
            arrayList.splice(pos, 1);
          }
        }
      });
      dom_listarProductos(arrayList);
      break;
      case 2 : dom_editarProducto(); break;
      case 3 :console.log('FALTA >>> Añadir producto'); break;
      default: break;
    }
  }


  function dom_agregarProducto(){
    let input = (d.getElementById('inp-item')).value.trim();
    if( input != ''){

      let producto_validado = validarProducto(input);
      if(tipos.indexOf(producto_validado[1].toUpperCase().trim())!=-1 ){
       let posicion = agregarZerosIzquierda(array_seleccionarPosicionVacia(arrayList));
       array_agregarProducto(producto_validado, posicion);
       ordenarProductos(arrayList);
       dom_listarProductos(arrayList);
       (d.getElementById('inp-item')).value = '';
     }else{
      alert('El formato de inserción no coincide con "producto|tipo|enlista"');
    }
  }
}

function agregarZerosIzquierda(n){
  n = ''+n;
  let zero = '';
  while(n.length < 3){
    zero+='0';
    n+= ' ';
  }
  return (zero + n).trim();
}

function array_agregarProducto(producto, posicion){
  let pos = parseInt(posicion);
  let new_producto = {
    'id': posicion,
    'art': producto[0].toLowerCase(),
    'tipo': producto[1].toLowerCase(),
    'encesta': producto[2].toLowerCase()
  }
  arrayList.splice(pos, 0, new_producto);
}

function array_seleccionarPosicionVacia(array_objetos){
  let pos = 0;
  let narray_objetos = array_objetos.length;
  for(let i in array_objetos){
    if( parseInt(array_objetos['id']) != pos ){ pos++; }
  }
  return agregarZerosIzquierda(pos);
}

function validarProducto(prod){
  let b = filtarElementos(prod);
  if(b.length == 3 && (b[1])){
    return b;
  }
  return 0;
}

function dom_editarProducto(){
  alert('función de edición de producto');
}

function dom_listarProductos(arr_prod){
  let ul = d.querySelector('section > ul');

  if(ul.childElementCount != 0){
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
  }
  arr_prod.forEach(function(index, elem){
    let span = d.createElement('span');
    let li = d.createElement('li');
    let a1 = d.createElement('a');
    let a2 = d.createElement('a');
    let big1 = d.createElement('big');
    let big2 = d.createElement('big');

    li.setAttribute('id',index['id']);
    span.setAttribute('data-tipo', index['tipo']);
    let tipo = d.createTextNode(index['art']);
    span.appendChild(tipo);

    let cd = d.createTextNode('⛌');
    big2.appendChild(cd);
    a2.appendChild(big2);

    let ce = d.createTextNode('♻');
    big1.appendChild(ce);
    a1.appendChild(big1);

    li.appendChild(a1);
    li.appendChild(span);
    li.appendChild(a2);
    ul.appendChild(li);

  });

  (d.querySelector('section > ul')).style.display = 'block';
  (d.getElementById('inp-item')).style.pointerEvents = 'auto';
  (d.getElementById('btn-item')).style.pointerEvents = 'auto';
  (d.getElementById('btn-item')).style.backgroundColor = '#769bf5';

  dom_addULListeners();
  return;
}

function procesarLista(elems){
  let splitStr = elems.split('^');
  let arrkeys = splitStr.shift();
  let keys = arrkeys.split('|');
  let i = 0;

  splitStr.map(function(elem){
    if(filtarElementos(elem) != null){
      i++;
          //let id = (i < 10)?'00'+i :'0'+i;
          let id = agregarZerosIzquierda(i);
          let producto = {};
          producto['id'] = id;
          producto[keys[0]] = filtarElementos(elem)[0];
          producto[keys[1]] = filtarElementos(elem)[1];
          producto[keys[2]] = filtarElementos(elem)[2];
          arrayList.push(producto);
        }
      });

  ordenarProductos(arrayList);
  dom_listarProductos(arrayList);
}

app.iniciar = function(){ inicialiarApp(); };
}(document, listaApp) );