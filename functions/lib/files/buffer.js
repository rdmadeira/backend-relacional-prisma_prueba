/* Artículo de Buffer en Node - referencia: https://www.digitalocean.com/community/tutorials/using-buffers-in-node-js-es */
/* El buffer es un espacio temporal de dimensión limitada para almacenar datos, de los cuales tenemos intención de mover de un lugar a otro. */
/* Los Buffers si puede ser creados vacíos o a partir de datos preexistentes.
Si va a almacenar datos que aún no recibió en la memoria, es conveniente crear un búfer nuevo.
En Node.js, usamos la función alloc() de la clase Buffer para hacerlo. */
const buffer1024bytes0 = Buffer.alloc(1024); // por defecto el buffer creado tiene varios ceros binarios.
// Paracambiar por 1s, añadimos al segundo parametro:
const buffer1024bytes1 = Buffer.alloc(1024, 1);
console.log("buffer1024bytes0", buffer1024bytes0); // <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 974 more bytes>
console.log("buffer1024bytes1", buffer1024bytes1); // <Buffer 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 ... 974 more bytes>
/* En Node.js, los búferes utilizan el esquema de codificación UTF-8 por defecto si se inicializan con datos de cadena.
En UTF-8, un byte representa un número, una letra (en inglés y en otros idiomas) o un símbolo.
UTF-8 es un superconjunto de ASCII, el Código Estadounidense Estándar para el Intercambio de Información (American Standard Code for Information Interchange).
ASCII puede codificar bytes con mayúsculas y minúsculas en letras en inglés, los números 0 a 9 y algunos símbolos, como el de exclamación (!) o el de “y” comercial (&). */
/* Para cambiar el formato de cadenas distinto, usamos el tercero parametro de la función de la clase Buffer:*/
const asciiBuf = Buffer.alloc(5, "a", "ascii"); // El búfer se inicializa con cinco bytes del carácter a, utilizando la representación ASCII.
console.log("buffer1", asciiBuf); // <Buffer 61 61 61 61 61> - a en ascii y en UTF-8 es representado por 61
/* De manera predeterminada, Node.js admite las siguientes codificaciones de caracteres:
ASCII, representado como ascii
UTF-8, representado como utf-8 o utf8
UTF-16, representado como utf-16le o utf16le
UCS-2, representado como ucs-2 o ucs2
Base64, representado como base64
Hexadecimal, representado en hex
ISO/IEC 8859-1, representado como latin1 o binary
Todos estos valores se pueden utilizar en funciones de clase Buffer que acepten un parámetro encoding.
Por lo tanto, todos estos valores son válidos para el método alloc(). */
/* Para crear un buffer con datos preexistentes, usamos el metodo from() de Buffer: */
const stringBuf = Buffer.from("My name is Paul");
console.log("stringBuf", stringBuf); // <Buffer 4d 79 20 6e 61 6d 65 20 69 73 20 50 61 75 6c> - 20 representa espacio
// Se puede crear un buffer de otro buffer:
const asciiCopy = Buffer.from(asciiBuf); // Creamos un búfer nuevo asciiCopy que contiene los mismos datos que asciiBuf.
console.log("stringBuf", asciiCopy);
/* Leer de un Buffer - Se puede extraer un byte específico o todo su contenido.
Para acceder a un byte específico, pasamos igual a las matrices, con el indice especificado.
El indice empieza en 0. */
console.log(stringBuf[0]); // 4d - que representa en decimal el caracter M.
console.log(stringBuf[3]); // 110 - que representa en decimal el caracter n.
/* Para obtener el valor del byte especificado, hay varias formas,
para sacar todo el valor del Buffer,
1) una de las opciones es toString(): */
console.log("stringBuf.toString()", stringBuf.toString()); // My name is Paul
/* 2) Con opción toJSON: */
console.log("jsonBuf", stringBuf.toJSON());
//  {
//    type: 'Buffer',
//    data: [
//       77, 121, 32, 110,  97,
//      109, 101, 32, 105, 115,
//       32,  80, 97, 117, 108
//    ]
//  }                  devuelve un object con la data
// La propiedad data contiene una matriz de la representación en enteros de los bytes
/* Para cambiar valores de Buffers, si puede hacer de distintas formas:
    1) Con el indice, similar a los arrays:
*/
stringBuf[11] = 82; // La letra R en decimal entero
console.log("stringBuf", stringBuf); // My name is Raul
// Si aplicamos un indice mayor o igual al length del buffer, no se agrega el dato, y se mantiene el valor inicial.
/* 2) Con el metodo write, sustituye toda la data, y devuelve en length del buffer: */
stringBuf.write("My complete name is Rodrigo Nascimento");
console.log("stringBuf", stringBuf); // My complete nam - eso porqueel buffer tiene cantidad de bytes fija, y solo lee hasta su length 15
// Si el write contiene menos bytes que el total del buffer, solo se reemplaza los que pusiste en write.
/* 3) Metodo copy: */
// El copy() admite 4 parametros,
// target - obligatório - es el buffer que sufrirá la modificación
// targetStart - indice de inicio del buffer de destino que comienza a copiar, default 0
// sourceStart - indice de inicio del buffer de origen, default 0
// sourceEnd - indice que deja de copiar en el buffer de origen, default length del buffer
// Se puede hacer un array de buffers:
const arrayOfBuffer = [stringBuf, asciiBuf, asciiCopy];
console.log("arrayOfBuffer", arrayOfBuffer);
const object2 = ["Rodrigo", -5, 43.7, true];
const view = Uint8Array.from(object2);
const view2 = Int32Array.from(object2);
const bufferString = Buffer.from(JSON.stringify(object2));
console.log("view", view); // Uint8Array(4) [ 10, 251, 43, 79 ]
console.log("view2", view2); // Int32Array(4) [ 10, -5, 43, 79 ] los ceros es cuando reciben un no numero
console.log("bufferString", bufferString); // Int32Array(4) [ 10, -5, 43, 79 ] los ceros es cuando reciben un no numero
console.log("buffer", view2.buffer);
// ArrayBuffer {
//      [Uint8Contents]: <0a 00 00 00 fb ff ff ff 2b 00 00 00 4f 00 00 00>,
//      byteLength: 16
// }
console.log("buffer", view.buffer);
export {};
// ArrayBuffer {
//      [Uint8Contents]: <0a fb 2b 4f>,
//      byteLength: 4
// }
