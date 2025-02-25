export default abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message); // Se rompe la cadena de Prototypes

    //Esto es porque es extends de una clase nativa, al crear una instancia, se pierde la cadena de
    // prototypes, y una forma de evitar y restorar la cadena de prototypes, se usa la expresión abajo, según
    // documentación de TS - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html :
    Object.setPrototypeOf(
      this,
      new.target.prototype /* CustomError.prototype -> Se usó en el aula. Usando
          la opción new.target es la forma mas elegante*/,
    );
  }
  /* The problem is that Javascript's built-in class Error breaks the prototype chain by
  switching the object to be constructed (i.e. this) to a new, different object, when you call 
  super and that new object doesn't have the expected prototype chain, i.e. it's an instance of
  Error not of CustomError. -> StackOverFlow: https://stackoverflow.com/questions/41102060/typescript-extending-error-class*/

  abstract serializeErrors(): { message: string; field?: string }[]; // devuelve array de objetos con esta estructura.
}
