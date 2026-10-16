# Kubbo3D · Landing

Página principal de la marca: presenta los servicios, quiénes somos, y desde aquí se inicia sesión y se entra a cada
servicio. Usa el mismo Supabase que la calculadora, las herramientas y las apps.

| Servicio | Proyecto | Variable con su dirección |
|---|---|---|
| Calculadora (taller) | `kubbo3d/web` → `/app` | `PB_CALCULATOR_URL` |
| Herramientas 3D | `kubbo3d-tools` | `PB_TOOLS_URL` |
| Tienda | por ahora `kubbo3d/web` → `/tienda` | `PB_STORE_URL` |

Un servicio sin dirección aparece como "Muy pronto".

## Textos

Todos los textos y enlaces están en `src/lib/content.ts`. **"Quiénes somos" es un borrador**: cámbialo por la historia
real. El contacto (correo, WhatsApp, redes) solo aparece en el pie cuando lo llenas ahí.

## Una sola sesión para todos los sitios

Con los sitios en subdominios del mismo dominio (`kubbo3d.com`, `calculadora.kubbo3d.com`, `herramientas.kubbo3d.com`)
pon `PB_COOKIE_DOMAIN=.kubbo3d.com` en los tres proyectos: la sesión iniciada en cualquiera vale en los demás. En
dominios distintos o en `localhost` cada sitio pide entrar por separado.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # y rellénalo
npm run dev
```
