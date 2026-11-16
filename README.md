# CobraPro (Cadê Meu Pix): frontend

Painel para controlar clientes, cobranças e pagamentos. Consome a API do repositório [cade-meu-pix](https://github.com/go-lissandro/cade-meu-pix).

**Stack:** React, TypeScript, Vite, Tailwind, shadcn/ui e TanStack Query

## Como rodar

1. Suba a API (veja o README do `cade-meu-pix`) e libere a origem do frontend no CORS: `CORS_ORIGINS=http://localhost:8080`.
2. Configure e inicie o frontend:

```bash
cp .env.example .env    # VITE_API_URL=http://localhost:8000/api/v1
npm install
npm run dev             # http://localhost:8080
```

## Funcionalidades

- Cadastro e login, com renovação automática do token e logout
- **Dashboard:** totais por status, valor a receber e cobranças recentes
- **Clientes:** cadastrar, buscar, inativar e reativar
- **Cobranças:** criar, filtrar por status, ver detalhe, registrar pagamento (parcial ou total) e cancelar
- **Calendário:** vencimentos do mês, com navegação entre meses

## Estrutura

| Caminho | Papel |
|---------|-------|
| `src/lib/api.ts` | Cliente HTTP: tokens, renovação e mensagens de erro da API |
| `src/lib/adapters.ts` | Converte o formato da API (snake_case) para os tipos das telas |
| `src/hooks/useBilling.ts` | Consultas e mutações (React Query) |
| `src/contexts/AuthContext.tsx` | Sessão do usuário |

## Testes

```bash
npm test
```

## Limitações conhecidas

- As listas carregam até 100 itens (o limite por página da API); busca e filtros rodam no navegador.
