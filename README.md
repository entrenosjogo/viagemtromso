# Tromsø

Organizador de viagem a Tromsø para duas pessoas: roteiro, reservas, documentos e mala. Funciona no celular como app instalado e abre sem internet. Na primeira abertura, o app pergunta os nomes e as datas da viagem: essas informações ficam só no aparelho, nunca no código.

## O que tem na pasta

| Arquivo | Para que serve |
|---|---|
| `index.html` | A página do app (visual e estrutura) |
| `app.js` | Toda a lógica do app |
| `config.js` | Onde você liga a sincronização com o Firebase (opcional) |
| `seed-data.js` | A viagem de exemplo, carregada na primeira vez que o app abre |
| `sw.js` | Faz o app abrir sem internet |
| `manifest.webmanifest`, `icons/` | Nome e ícone quando instalado no celular |
| `firestore.rules` | Regras de segurança do banco, se usarem o Firebase |

## 1. Publicar no GitHub Pages

1. Crie um repositório novo no GitHub, por exemplo `tromso`. Na conta gratuita, o GitHub Pages só funciona com repositório **público**. O código fica visível, mas os dados de vocês não: eles ficam no celular ou no Firebase, protegidos por senha.
2. No repositório, clique em **Add file → Upload files**, arraste **todo o conteúdo desta pasta** (incluindo a pasta `icons`) e clique em **Commit changes**.
3. Vá em **Settings → Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e salve.
4. Depois de um ou dois minutos, o app estará em `https://SEU-USUARIO.github.io/tromso/`.

## 2. Instalar no celular

- **iPhone:** abra o link no Safari → botão Compartilhar → **Adicionar à Tela de Início**.
- **Android:** abra no Chrome → menu ⋮ → **Instalar app**.

Abram o app uma vez com internet. Depois disso, ele abre também sem conexão.

## 3. Sincronizar entre os dois celulares (opcional)

Sem esta etapa, cada celular guarda os próprios dados. Para que as mudanças de um apareçam para o outro em segundos, usem o Firebase, que tem plano gratuito:

1. Entre em <https://console.firebase.google.com> e crie um projeto. O Google Analytics pode ficar desligado.
2. Na página do projeto, clique no ícone **Web (`</>`)**, dê um nome ao app e copie o objeto `firebaseConfig` que aparece.
3. Abra o `config.js` e troque `firebase: null` pelo objeto copiado. Há um exemplo no próprio arquivo.
4. Em **Authentication → Sign-in method**, ative **E-mail/senha**. Em **Users**, clique em **Add user** e crie um usuário para cada um.
5. Em **Firestore Database**, clique em **Create database**, escolha uma região (por exemplo `southamerica-east1`, São Paulo) e o **modo de produção**.
6. Na aba **Rules** do Firestore, cole o conteúdo de `firestore.rules`, troque os dois e-mails de exemplo pelos e-mails que vocês criaram no passo 4 e clique em **Publish**.
7. Em **Authentication → Settings → Authorized domains**, adicione `SEU-USUARIO.github.io` por garantia.
8. Suba o `config.js` atualizado no GitHub. Ao abrir o app, ele vai pedir e-mail e senha. Na primeira vez, o banco estará vazio: escolham **Carregar exemplo** ou **Começar do zero**.

A configuração do `config.js` não é segredo. Quem protege os dados são as regras do passo 6, que só deixam os dois e-mails lerem e escreverem.

## Bom saber

- **Anexos** (PDFs e fotos de passaporte, seguro e vouchers) ficam guardados **só no aparelho em que foram anexados** e abrem sem internet. Eles não vão para a nuvem: cada um anexa os seus no próprio celular. Os títulos, validades e notas dos documentos sincronizam.
- **Backup:** em **Mais → Backup** dá para baixar uma cópia de tudo (sem os anexos) e restaurar depois.
- **Dados de exemplo:** em **Mais → Dados de exemplo** vocês apagam tudo o que ainda é exemplo. O que vocês editaram fica.
- **Atualizar o app:** depois de mudar qualquer arquivo, aumente o número em `sw.js` (`tromsoapp-v1` → `tromsoapp-v2`). A versão nova aparece a partir da segunda vez que o app for aberto.
- **Testar no computador:** o app precisa ser servido por um endereço `http`. Abrir o `index.html` com dois cliques não ativa o modo offline. Para testar localmente, rode `python3 -m http.server` dentro da pasta e acesse `http://localhost:8000`.
