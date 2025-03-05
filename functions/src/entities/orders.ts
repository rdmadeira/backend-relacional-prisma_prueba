export interface Order {
  iat: number;
  userId: string;
  carrito: Carrito[];
  headerForm: HeaderForm;
  subtotal: number;
}

export interface HeaderForm {
  numerocliente: string;
  cliente: string;
  condicion: string;
  obs: string;
}

export interface Carrito {
  id: string;
  cant: number;
  headerFormId: string;
  precio_arg: number;
}
