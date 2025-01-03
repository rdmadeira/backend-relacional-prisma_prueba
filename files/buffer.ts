/* Artículo de Buffer en Node - referencia: https://www.digitalocean.com/community/tutorials/using-buffers-in-node-js-es */

/* Los Buffers si puede ser creados vacíos o a partir de datos preexistentes.
Si va a almacenar datos que aún no recibió en la memoria, es conveniente crear un búfer nuevo.
En Node.js, usamos la función alloc() de la clase Buffer para hacerlo. */

const buffer1024bytes0 = Buffer.alloc(1024); // por defecto el buffer creado tiene varios ceros binarios.
// Paracambiar por 1s, añadimos al segundo parametro:

const buffer1024bytes1 = Buffer.alloc(1024, 1);

console.log('buffer1024bytes0', buffer1024bytes0); // <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 974 more bytes>
console.log('buffer1024bytes1', buffer1024bytes1); // <Buffer 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 ... 974 more bytes>

/* En Node.js, los búferes utilizan el esquema de codificación UTF-8 por defecto si se inicializan con datos de cadena.
En UTF-8, un byte representa un número, una letra (en inglés y en otros idiomas) o un símbolo.
UTF-8 es un superconjunto de ASCII, el Código Estadounidense Estándar para el Intercambio de Información (American Standard Code for Information Interchange).
ASCII puede codificar bytes con mayúsculas y minúsculas en letras en inglés, los números 0 a 9 y algunos símbolos, como el de exclamación (!) o el de “y” comercial (&). */
/* Para cambiar el formato de cadenas distinto, usamos el tercero parametro de la función de la clase Buffer:*/

const asciiBuf = Buffer.alloc(5, 'a', 'ascii'); // El búfer se inicializa con cinco bytes del carácter a, utilizando la representación ASCII.

console.log('buffer1', asciiBuf); // <Buffer 61 61 61 61 61> - a en ascii y en UTF-8 es representado por 61

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
const stringBuf = Buffer.from('My name is Paul');
console.log('stringBuf', stringBuf); // <Buffer 4d 79 20 6e 61 6d 65 20 69 73 20 50 61 75 6c> - 20 representa espacio

// Se puede crear un buffer de otro buffer:

const asciiCopy = Buffer.from(asciiBuf); // Creamos un búfer nuevo asciiCopy que contiene los mismos datos que asciiBuf.
console.log('stringBuf', asciiCopy);
