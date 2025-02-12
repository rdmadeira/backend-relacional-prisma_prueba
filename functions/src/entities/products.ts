export interface Product {
  id: string;
  marca: string;
  descripcion: string;
  precio_usd: number;
  precio_arg: number;
  tasa_iva: number;
  costo_repo_usd: number;
  mkup: number;
  stock_disp: number;
  stock_larp: number;
  sku: string | null;
  is_current: boolean;
  rubro: string;
  tipoId: string;
  ConceptoId: string;
}

export interface CodigoReducido {
  id?: string;
  codigo: string;
  codigo_largo: string;
  stock_dis: number;
  stock_lar: number;
  productoId: string;
  marcaId: string;
}

export interface ProductExcelTotal {
  codigo_reducido: string;
  tipo_de_producto: string;
  codigo_de_producto: string;
  concepto: string;
  marca: string;
  descripcion: string;
  precio_usd: number;
  precio_arg: number;
  tasa_iva: number;
  costo_repo_usd: number;
  mkup: number;
  stock_disp: number;
  stock_larp: number;
  sku: string;
  rubro: string | undefined;
  is_current: boolean;
}

export interface Marca {
  id?: string;
  marca: string;
  empresaId: number;
}

export interface iFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}
