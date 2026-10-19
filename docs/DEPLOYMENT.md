# Inicialización y despliegue

Stack de despliegue (100 % gratuito): **GitHub** (código) → **Vercel Hobby** (hosting Next.js) →
**Cloudflare** (dominio y DNS).

## 1. Local

Requisitos: Node.js ≥ 20 (recomendado 22 LTS) y pnpm 10 (`corepack enable` activa la versión
fijada en `package.json → packageManager`).

```bash
corepack enable
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm build && pnpm start   # prueba de producción local
```

## 2. GitHub

El repo ya está inicializado en `main`. Crea un repositorio **vacío** en GitHub (sin README ni
.gitignore) y enlázalo:

```bash
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```

Cada push a `main` ejecuta el workflow `.github/workflows/ci.yml` (pnpm install → typecheck →
lint → build).

## 3. Vercel

1. <https://vercel.com/new> → **Import Git Repository** → elige el repo.
2. Framework: **Next.js** (autodetectado). Vercel detecta pnpm por `pnpm-lock.yaml` y el campo
   `packageManager`. Si quieres fijarlo a mano:
   - Install Command: `pnpm install`
   - Build Command: `pnpm build`
   - Output: (por defecto)
3. Settings → General → **Node.js Version: 22.x**.
4. **Deploy**. Cada push a `main` = despliegue a producción; cada PR = preview.

### Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recomendada en producción | URL pública canónica, sin barra final (p. ej. `https://tudominio.com`). Alimenta `metadataBase`, canonical, Open Graph, `robots.txt`, `sitemap.xml` y JSON-LD. |

Se lee **en el build** (las páginas son estáticas): tras cambiarla, vuelve a desplegar. Si no se
define, se usa `VERCEL_PROJECT_PRODUCTION_URL` (o `VERCEL_URL` en previews) y, en local,
`http://localhost:3000`. Define solo el dominio principal (el que no redirige), para que el
canonical no apunte a `www` si `www` redirige al apex.

### SEO tras el primer despliegue

- Comprueba `https://tudominio.com/robots.txt` y `https://tudominio.com/sitemap.xml`.
- Da de alta el dominio en Google Search Console y envía el sitemap.
- Valida los datos estructurados con el [Rich Results Test](https://search.google.com/test/rich-results).
- Solo la landing (`/`) es indexable; `/app/*` lleva `noindex` y está bloqueada en robots.

## 4. Dominio en Cloudflare → Vercel

### 4.1 Añadir el dominio en Vercel

Project → Settings → **Domains** → añade `tudominio.com` y `www.tudominio.com`.
Elige cuál es el principal (recomendado: `tudominio.com`, y `www` redirige con 308).
Vercel te mostrará los registros exactos a crear: **usa siempre los valores que te muestre ese
panel** (Vercel puede asignar valores específicos por proyecto).

### 4.2 Registros DNS en Cloudflare

Cloudflare → tu dominio → **DNS → Records**:

| Tipo | Nombre | Contenido | Proxy | TTL |
| --- | --- | --- | --- | --- |
| `A` | `@` | IP que indique Vercel (p. ej. `216.198.79.1`; la clásica `76.76.21.21` sigue funcionando) | **DNS only** (nube gris) | Auto |
| `CNAME` | `www` | Destino que indique Vercel (p. ej. `xxxx.vercel-dns-017.com` o `cname.vercel-dns.com`) | **DNS only** (nube gris) | Auto |

Borra cualquier `A`/`AAAA`/`CNAME` previo para `@` y `www` (p. ej. de un parking).

### 4.3 Proxy y SSL/TLS (evitar bucles de redirección)

**Recomendado: DNS only (nube gris).** Vercel ya da CDN global, HTTPS automático (Let's Encrypt)
y certificados renovados solos. Con el proxy de Cloudflare activo, la emisión/renovación del
certificado de Vercel puede fallar y se añade una capa de caché que no necesitas.

Si de todas formas quieres el proxy (nube naranja) — por ejemplo, para WAF de Cloudflare:

1. Primero deja los registros en **gris** hasta que Vercel muestre el dominio como *Valid
   Configuration* y el certificado emitido.
2. Cloudflare → **SSL/TLS → Overview → modo `Full (strict)`**.
   - ❌ **Nunca `Flexible`**: Cloudflare hablaría HTTP con Vercel, Vercel redirige a HTTPS, y
     se produce `ERR_TOO_MANY_REDIRECTS` (bucle infinito).
3. SSL/TLS → Edge Certificates: *Always Use HTTPS* puede ir activado; desactiva *Automatic
   HTTPS Rewrites* si ves contenido mixto raro.
4. No crees Page Rules / Redirect Rules de `www` ↔ apex en Cloudflare: deja esa redirección a
   Vercel para no duplicarla.

### 4.4 Verificación

```bash
nslookup tudominio.com
nslookup www.tudominio.com
```

En Vercel → Domains, ambos deben aparecer como **Valid Configuration**. La propagación suele
tardar minutos (hasta 24 h en el peor caso).
