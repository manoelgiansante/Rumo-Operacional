# 📱 Rumo Operacional — Guia Completo de Publicação

> **Data:** 25/02/2026
> **Bundle iOS:** `com.agrorumo.operacional`
> **Package Android:** `com.agrorumo.operacional`
> **Empresa:** MM CAMPO FORTE LTDA | CNPJ: 57.169.838/0001-20
> **Email Suporte:** controledemaquinaagricola@gmail.com

---

## 📋 CHECKLIST RÁPIDO

- [ ] Configurar variáveis no Vercel
- [ ] Criar webhook no Stripe
- [ ] Criar produtos IAP no App Store Connect
- [ ] Criar produtos IAP no Google Play Console
- [ ] Configurar conta review no App Store/Play Store
- [ ] Preencher URLs legais nas lojas
- [ ] Build e submit

---

## 1️⃣ CREDENCIAIS DE REVIEW (Apple/Google)

Conta já criada no Supabase para os reviewers testarem o app:

```
📧 Email: review@agrorumo.com
🔑 Senha: Review@2026!
```

> ⚠️ Esta conta já está ativa e confirmada.
> Use estas credenciais nos formulários de "Review Information" da Apple e Google.

---

## 2️⃣ URLS LEGAIS (Obrigatórias nas Lojas)

Todas as páginas já existem como telas no app e serão acessíveis via web no Vercel:

| Documento                   | URL                                               |
| --------------------------- | ------------------------------------------------- |
| **Política de Privacidade** | `https://operacional.agrorumo.com/privacy-policy` |
| **Termos de Uso**           | `https://operacional.agrorumo.com/terms`          |
| **Exclusão de Dados**       | `https://operacional.agrorumo.com/exclusao-dados` |
| **Suporte**                 | `controledemaquinaagricola@gmail.com`             |
| **Website**                 | `https://operacional.agrorumo.com`                |

### Onde preencher:

**App Store Connect:**

- App Information > Privacy Policy URL: `https://operacional.agrorumo.com/privacy-policy`
- App Information > License Agreement: "Custom" e usar a URL dos termos
- App Privacy > Data practices: Declarar conforme a LGPD (veja seção abaixo)
- Review Information > Notes: "Login com review@agrorumo.com / Review@2026!"
- Review Information > Sign-in Required: ✅ Sim
- Review Information > Demo Account: `review@agrorumo.com` / `Review@2026!`

**Google Play Console:**

- Store Presence > Main Store listing > Privacy Policy: `https://operacional.agrorumo.com/privacy-policy`
- App Content > Data safety: Declarar conforme a LGPD
- App Content > App access: "All or some functionality is restricted" → fornecer credenciais
- Policy > Account deletion: `https://operacional.agrorumo.com/exclusao-dados`

---

## 3️⃣ DEPLOY VERCEL (Website + API)

### 3.1 Criar Projeto no Vercel

1. Acesse https://vercel.com/new
2. Import do GitHub: `manoelgiansante/Rumo-Operacional`
3. Framework Preset: **Other** (não selecionar nenhum framework)
4. O `vercel.json` já configura tudo automaticamente

### 3.2 Configurar Variáveis de Ambiente no Vercel

Vá em **Settings > Environment Variables** e adicione:

| Variável                             | Valor                                        | Nota       |
| ------------------------------------ | -------------------------------------------- | ---------- |
| `EXPO_PUBLIC_SUPABASE_URL`           | `https://jxcnfyeemdltdfqtgbcl.supabase.co`   |            |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`      | `eyJhbG...` (ver .env.example)               |            |
| `SUPABASE_SERVICE_ROLE_KEY`          | Pegue no Supabase Dashboard > Settings > API | ⚠️ SECRETO |
| `STRIPE_SECRET_KEY`                  | `sk_live_...` do Stripe Dashboard            | ⚠️ SECRETO |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_51SPmgmEa6xGSraYx...`               | Pública    |
| `STRIPE_WEBHOOK_SECRET`              | `whsec_...` criado no passo 3.3              | ⚠️ SECRETO |
| `EXPO_PUBLIC_APP_URL`                | `https://operacional.agrorumo.com`           |            |

### 3.3 Configurar Domínio

Em **Settings > Domains**, adicione: `operacional.agrorumo.com`

### 3.4 Criar Webhook no Stripe

1. Acesse https://dashboard.stripe.com/webhooks
2. Clique "Add endpoint"
3. URL: `https://operacional.agrorumo.com/api/stripe/webhook`
4. Eventos a escutar:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o **Signing secret** (`whsec_...`) e coloque no Vercel

---

## 4️⃣ STRIPE — Payment Links e Preços

Os Payment Links já estão configurados em `constants/product-ids.ts`.
São os **mesmos** do ecossistema Rumo Máquinas (conta Stripe compartilhada).

| Plano          | Mensal     | Anual        |
| -------------- | ---------- | ------------ |
| **Básico**     | R$ 79/mês  | R$ 787/ano   |
| **Pro**        | R$ 249/mês | R$ 2.480/ano |
| **Prestador**  | R$ 399/mês | R$ 3.974/ano |
| **Enterprise** | R$ 599/mês | R$ 5.966/ano |

### Stripe Account ID: `acct_1SPmgmEa6xGSraYx`

### Publishable Key: `pk_live_51SPmgmEa6xGSraYxUhsiEmYdJ1nnCcGgMdQanHyIkfQYeJh9wACn11YyPqQvR1gjdfNEjUKC6mbN8nLEHFXxdZNu0001um2OTO`

---

## 5️⃣ APP STORE CONNECT (iOS)

### 5.1 Criar App

- Bundle ID: `com.agrorumo.operacional`
- Nome: **Rumo Operacional**
- SKU: `rumo-operacional`
- Primary Language: Portuguese (Brazil)

### 5.2 App Information

| Campo              | Valor                                             |
| ------------------ | ------------------------------------------------- |
| Name               | Rumo Operacional                                  |
| Subtitle           | Gestão de Custos Operacionais                     |
| Privacy Policy URL | `https://operacional.agrorumo.com/privacy-policy` |
| Category           | Business                                          |
| Secondary Category | Finance                                           |
| Age Rating         | 4+                                                |
| Copyright          | © 2026 MM Campo Forte LTDA                        |

### 5.3 In-App Purchases (Subscriptions)

Criar **Subscription Group**: `Rumo Operacional`

| ID do Produto                  | Nome              | Duração | Preço               |
| ------------------------------ | ----------------- | ------- | ------------------- |
| `ro.rumo.basico.mensal.v1`     | Básico Mensal     | 1 mês   | Tier 6 (~R$ 79)     |
| `ro.rumo.basico.anual.v1`      | Básico Anual      | 1 ano   | Tier 49 (~R$ 790)   |
| `ro.rumo.pro.mensal.v1`        | Pro Mensal        | 1 mês   | Tier 15 (~R$ 249)   |
| `ro.rumo.pro.anual.v1`         | Pro Anual         | 1 ano   | Tier 83 (~R$ 2.490) |
| `ro.rumo.enterprise.mensal.v1` | Enterprise Mensal | 1 mês   | Tier 26 (~R$ 599)   |
| `ro.rumo.enterprise.anual.v1`  | Enterprise Anual  | 1 ano   | Tier 93 (~R$ 5.990) |
| `ro.rumo.prestador.mensal.v1`  | Prestador Mensal  | 1 mês   | Tier 19 (~R$ 399)   |
| `ro.rumo.prestador.anual.v1`   | Prestador Anual   | 1 ano   | Tier 88 (~R$ 3.990) |

> Para cada produto, adicione screenshot da tela de assinatura.
> Todos devem estar no mesmo Subscription Group.

### 5.4 Review Information

```
Sign-in required: YES
Username: review@agrorumo.com
Password: Review@2026!

Notes for Reviewer:
O Rumo Operacional é um app de gestão de custos operacionais para
produtores rurais. Permite cadastrar setores, operações e despesas,
com verificação de valores e relatórios detalhados.

Para testar:
1. Faça login com as credenciais acima
2. A conta já possui dados de exemplo
3. Navegue pelas abas: Início, Despesas, Relatórios, Verificação, Config
4. O chatbot de suporte está em Configurações > Suporte via Chat
5. As assinaturas podem ser testadas via web (Stripe)
```

### 5.5 App Privacy (Data Practices)

Declarar que o app coleta:

- **Contact Info** (email) — Para criação de conta
- **Financial Info** (despesas, valores) — Funcionalidade principal
- **Usage Data** — Analytics
- **Identifiers** (User ID) — Para autenticação

Nenhum dado é compartilhado com terceiros.
Todos os dados podem ser deletados pelo usuário (tela de exclusão).

---

## 6️⃣ GOOGLE PLAY CONSOLE (Android)

### 6.1 Criar App

- Package: `com.agrorumo.operacional`
- Nome: **Rumo Operacional**
- Default language: pt-BR
- App type: App
- Free or paid: Free (with in-app purchases)
- Category: Business

### 6.2 Store Listing

| Campo             | Valor                                             |
| ----------------- | ------------------------------------------------- |
| App name          | Rumo Operacional                                  |
| Short description | Gestão de custos operacionais para o agronegócio  |
| Full description  | (ver abaixo)                                      |
| Privacy Policy    | `https://operacional.agrorumo.com/privacy-policy` |

**Full Description:**

```
Rumo Operacional - Gestão de Custos Operacionais para Produtores Rurais

Controle completo dos custos da sua operação agrícola:

✅ Cadastro de setores e operações
✅ Registro de despesas com verificação
✅ Controle de fornecedores e notas fiscais
✅ Relatórios detalhados com gráficos
✅ Verificação de divergências
✅ Integração com Rumo Finance
✅ Chatbot de suporte 24h
✅ Exportação de dados

Planos disponíveis:
• Gratuito: teste por 7 dias
• Básico: R$ 79/mês
• Pro: R$ 249/mês
• Enterprise: R$ 599/mês

Desenvolvido por MM Campo Forte LTDA
CNPJ: 57.169.838/0001-20
Suporte: controledemaquinaagricola@gmail.com
```

### 6.3 In-App Products (Subscriptions)

Criar as seguintes assinaturas:

| Product ID                         | Nome              | Preço         |
| ---------------------------------- | ----------------- | ------------- |
| `com.agrorumo.op.basic.month`      | Básico Mensal     | R$ 79,90/mês  |
| `com.agrorumo.op.basic.year`       | Básico Anual      | R$ 799,90/ano |
| `com.agrorumo.op.pro.month`        | Pro Mensal        | R$ 249,90/mês |
| `com.agrorumo.op.pro.year`         | Pro Anual         | R$ 2.490/ano  |
| `com.agrorumo.op.enterprise.month` | Enterprise Mensal | R$ 599,90/mês |
| `com.agrorumo.op.provider.month`   | Prestador Mensal  | R$ 399,90/mês |
| `com.agrorumo.op.provider.year`    | Prestador Anual   | R$ 3.990/ano  |

> ⚠️ Enterprise Anual NÃO está disponível no Google Play (limite de ~R$ 5.200/ano)

### 6.4 App Content (Policy)

**Data Safety:**

- Does your app collect or share any user data? **Yes**
- Data collected: Email, Financial info (expenses), App activity
- Is data encrypted in transit? **Yes** (HTTPS + Supabase)
- Can users request data deletion? **Yes** — URL: `https://operacional.agrorumo.com/exclusao-dados`

**App Access:**

- All or some functionality restricted → **Provide login credentials**
- Email: `review@agrorumo.com`
- Password: `Review@2026!`

### 6.5 Content Rating (IARC)

- Violence: No
- Sexuality: No
- Language: No
- Controlled Substances: No
- Gambling: No
- Resultado esperado: **Rated for All / LIVRE**

---

## 7️⃣ SUPABASE — Informações do Projeto

| Item              | Valor                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Project Ref       | `jxcnfyeemdltdfqtgbcl`                                                                                                                                                                                             |
| Região            | West US (Oregon)                                                                                                                                                                                                   |
| URL               | `https://jxcnfyeemdltdfqtgbcl.supabase.co`                                                                                                                                                                         |
| Anon Key          | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y25meWVlbWRsdGRmcXRnYmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQwNTksImV4cCI6MjA4NDA4MDA1OX0.MEqgaUHb0cDVoDrXY6rc1F6YJLxzbpNiks-SFRCg2go` |
| Service Role      | ⚠️ Pegue em Dashboard > Settings > API                                                                                                                                                                             |
| DB Password       | `Getapamanoel95`                                                                                                                                                                                                   |
| Compartilhado com | Rumo Finance, Rumo Pragas                                                                                                                                                                                          |

### Tabelas do Rumo Operacional:

- `sectors` — Setores (com `user_id`)
- `operations` — Operações (com `user_id`)
- `expenses` — Despesas (com `user_id` e colunas extras)
- `profiles` — Perfis dos usuários
- `user_subscriptions` — Assinaturas (compartilhada)

---

## 8️⃣ CONFIGURAÇÃO DO app.json

Já configurado corretamente:

```json
{
  "scheme": "rumo-operacional",
  "bundleIdentifier": "com.agrorumo.operacional",
  "package": "com.agrorumo.operacional"
}
```

### Info.plist (iOS) — Adicionar se necessário:

```json
{
  "ITSAppUsesNonExemptEncryption": false,
  "NSCameraUsageDescription": "Usamos a câmera para anexar fotos de notas fiscais.",
  "NSPhotoLibraryUsageDescription": "Precisamos da galeria para anexar imagens."
}
```

---

## 9️⃣ BUILD E SUBMIT

### Com EAS Build (Expo):

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar
eas build:configure

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production

# Submit iOS
eas submit --platform ios

# Submit Android
eas submit --platform android
```

### Sem EAS (build local):

```bash
# iOS
npx expo prebuild --platform ios
cd ios && pod install && cd ..
# Abrir no Xcode e fazer Archive

# Android
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

---

## 🔟 API ENDPOINTS (Vercel)

Após deploy no Vercel, estes endpoints estarão disponíveis:

| Endpoint                          | Método | Descrição                                   |
| --------------------------------- | ------ | ------------------------------------------- |
| `/api/ping`                       | GET    | Health check                                |
| `/api/stripe/checkout`            | POST   | Criar sessão de checkout Stripe             |
| `/api/stripe/webhook`             | POST   | Webhook do Stripe (chamado automaticamente) |
| `/api/stripe/cancel-subscription` | POST   | Cancelar assinatura                         |

### Teste o API:

```bash
curl https://operacional.agrorumo.com/api/ping
```

---

## 📞 CONTATO E SUPORTE

| Item     | Valor                               |
| -------- | ----------------------------------- |
| Email    | controledemaquinaagricola@gmail.com |
| Empresa  | MM CAMPO FORTE LTDA                 |
| CNPJ     | 57.169.838/0001-20                  |
| WhatsApp | (configurar se necessário)          |
| Chatbot  | GPTMaker — já integrado no app      |

---

## ✅ RESUMO — O QUE JÁ ESTÁ PRONTO

- [x] Conta de review criada no Supabase (`review@agrorumo.com` / `Review@2026!`)
- [x] Política de Privacidade (LGPD completa, 14 seções)
- [x] Termos de Uso
- [x] Tela de Exclusão de Dados/Conta
- [x] Chatbot de Suporte (GPTMaker)
- [x] Stripe Payment Links configurados
- [x] API Stripe (checkout, webhook, cancel)
- [x] Product IDs definidos (iOS + Android + Stripe)
- [x] app.json configurado (scheme, bundle, package)
- [x] vercel.json configurado (API routes + rewrites)
- [x] Migração SQL executada no banco
- [x] RLS Policies configuradas
- [x] Storage keys renomeadas
- [x] Tutorial (OnboardingTutorial) acessível via Settings

## ⏳ O QUE O DEV PRECISA FAZER

- [ ] Deploy no Vercel com variáveis de ambiente
- [ ] Criar webhook no Stripe
- [ ] Criar produtos IAP no App Store Connect
- [ ] Criar produtos IAP no Google Play Console
- [ ] Preencher URLs legais nas lojas
- [ ] Preencher credenciais de review nas lojas
- [ ] Build com EAS e submit para review
