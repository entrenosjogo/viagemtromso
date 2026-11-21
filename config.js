// Configuração do app Tromsø
//
// Sem Firebase (firebase: null), o app salva tudo só no aparelho em que estiver aberto.
// Para sincronizar entre os dois celulares, crie um projeto no Firebase
// (passo a passo no README.md) e cole aqui o objeto firebaseConfig, assim:
//
// window.TROMSO_CONFIG = {
//   firebase: {
//     apiKey: "AIza...",
//     authDomain: "seu-projeto.firebaseapp.com",
//     projectId: "seu-projeto",
//     appId: "1:123:web:abc"
//   }
// };
//
// Esses valores não são segredo: quem protege os dados são as regras em firestore.rules.

window.TROMSO_CONFIG = {
  firebase: null
};
