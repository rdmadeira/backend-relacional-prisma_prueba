export interface Order {
  iat: number;
  userId: string;
  carrito: Carrito[];
  headerForm: HeaderForm;
}

export interface HeaderForm {
  numerocliente: string;
  cliente: string;
  condicion: string;
  obs: string;
}

export interface Carrito {
  productoId: string;
  cantidad: number;
  headerFormId: string;
}
