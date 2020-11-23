const MESES = [{"nombre": "ENERO", "numero": 1},
               {"nombre": "FEBRERO", "numero": 2},
               {"nombre": "MARZO", "numero": 3},
               {"nombre": "ABRIL", "numero": 4},
               {"nombre": "MAYO", "numero": 5},
               {"nombre": "JUNIO", "numero": 6},
               {"nombre": "JULIO", "numero": 7},
               {"nombre": "AGOSTO", "numero": 8},
               {"nombre": "SEPTIEMBRE", "numero": 9},
               {"nombre": "OCTUBRE", "numero": 10},
               {"nombre": "NOVIEMBRE", "numero": 11},
               {"nombre": "DICIEMBRE", "numero": 12}]

const nombre_to_numero = function(_mes){    
    return MESES.find(mes => mes.nombre == _mes.toUpperCase()).numero
}
const numero_to_nombre = function(_numero){
    return MESES.find(mes => mes.numero == _numero).nombre
}

export default {
    nombre_to_numero,
    numero_to_nombre
}