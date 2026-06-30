# Contexto Antigravity: Regras Nuxt 4
# Objetivo: Restrições e orientações para economizar tokens

## Sobre o projeto
- Informações: Painel administrativo integrado a uma API PHP com requisições post, get, delete e update.
- Framework Front End: É usado o Nuxt.UI com Tailwind como Framework Front end e Nuxt Icons. Bootstrap está proibido nesse projeto.
- Segurança: 
    - Todas as rotas com excesão da homepage(/app/pages/index.vue) devem passar pelo auth afim de verificar se o usuário está logado.
    - Utiliza-se autenticação via API com retorno do JWT BEARER TOKEN que será exigido no header das requisições.
    - Somente será aceito o uso de v-html se estiver usando o sanitize.
    - Sanitização: Toda resposta de erro de API repassada ao cliente deve ocultar stack traces reais do servidor.
    - Preferência de uso por try, fetch e useFetch. Axios e bibliotecas similares externas estão proibidas.

## Arquitetura Nuxt 4
- Estrutura: Código vive na pasta `app/`.
- Auto imports: NÃO mude/adicione imports para `ref`, `useState`, `useFetch`.
- Estado: Usar `useState()`, Pinia ou Pinia Persisted data. Proibido Vuex. Evite o uso de localStorage, somente quando ele for essencial.

## Comportamento do Agente (Economia de Tokens)
- Respostas: Diretas. Sem introduções e sempre informando o caminho exato do arquivo a ser alterado. Nunca altere arquivos ou utilize o modo AGENTE, a menos que seja solicitado. Crie tutoriais respondendo o que for questionado, com códigos para serem copiados e colados pelo usuário e sempre orientado o caminho a ser colado e ou alterado.
- Código: Forneça apenas o trecho alterado, nunca o arquivo inteiro a menos que seja solicitado.
- Explicações: Máximo de 3 linhas por alteração, apenas em formato de tópicos.
- Tipagem: Typescript. Evitar `any`.
- Jamais altere arquivos sem autorização prévia.

## documentação dos frameworks usados
- NuxtUI: https://ui.nuxt.com/docs
- Nuxt: https://nuxt.com/