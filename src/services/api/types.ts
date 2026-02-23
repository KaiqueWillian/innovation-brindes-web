export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  name?: string;
  username?: string;
}

export interface LoginResponse {
  status: number | null;
  message: string;
  accessToken: string;
  user: AuthUser | null;
  raw: Record<string, unknown>;
}

export interface ProductListFilters {
  productName?: string;
  productCode?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  reference: string;
  categoryCode: string;
  description: string;
  price: number;
  image: string;
  isExclusive: boolean;
  raw: Record<string, unknown>;
}

type ProductsContainer =
  | Record<string, unknown>
  | Record<string, unknown>[]
  | null
  | undefined;

function parseMoneyValue(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const cleaned = value
      .replace(/[R$\s]/g, '')
      .replace(/\.(?=\d{3}(\D|$))/g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, '');

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
}

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'sim', 's', 'yes', 'exclusive', 'exclusivo'].includes(normalized);
  }

  return false;
}

export function normalizeProductsPayload(payload: ProductsContainer): Product[] {
  let rows: Record<string, unknown>[] = [];

  if (Array.isArray(payload)) {
    rows = payload;
  } else if (payload && typeof payload === 'object') {
    const source = payload as Record<string, unknown>;
    const nestedCandidates = [
      source.data,
      source.items,
      source.products,
      source['produtos'],
      source['itens'],
      source['resultado']
    ];
    const firstArray = nestedCandidates.find((item) => Array.isArray(item));
    rows = Array.isArray(firstArray) ? (firstArray as Record<string, unknown>[]) : [];
  }

  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((row, index) => {
    const code =
      asString(row.code) ||
      asString(row['codigo']) ||
      asString(row['codigo_produto']) ||
      asString(row['cod_produto']) ||
      `CODE-${index + 1}`;

    const name =
      asString(row.name) ||
      asString(row['nome']) ||
      asString(row['nome_produto']) ||
      asString(row['titulo']) ||
      'Unnamed product';

    const reference =
      asString(row.reference) || asString(row['referencia']) || asString(row['codigo_referencia']) || code;
    const categoryCode =
      asString(row.category_code) || asString(row['codigo_categoria']) || asString(row['categoria_codigo']);

    const description =
      asString(row.description) ||
      asString(row['descricao']) ||
      asString(row['descricao_produto']) ||
      asString(row['descricao_curta']) ||
      'No description available.';

    const price =
      parseMoneyValue(row.price) ||
      parseMoneyValue(row['preco']) ||
      parseMoneyValue(row['valor']) ||
      parseMoneyValue(row['valor_produto']) ||
      parseMoneyValue(row['preco_venda']);

    const image =
      asString(row.image) ||
      asString(row['imagem']) ||
      asString(row['imagem_produto']) ||
      asString(row['url_imagem']) ||
      asString(row['foto']) ||
      '/images/placeholders/product-placeholder.svg';

    const exclusiveSource = row.isExclusive ?? row['exclusivo'] ?? row['selo_exclusivo'] ?? row['destaque'];
    const isExclusive =
      exclusiveSource === undefined || exclusiveSource === null
        ? true
        : asBoolean(exclusiveSource);

    return {
      id: asString(row.id) || code,
      code,
      name,
      reference,
      categoryCode,
      description,
      price,
      image,
      isExclusive,
      raw: row
    };
  });
}
