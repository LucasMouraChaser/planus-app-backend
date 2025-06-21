# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## Como Criar e Conectar seu Repositório ao Firebase App Hosting

Para que seu backend (incluindo o webhook do WhatsApp) funcione, ele precisa estar conectado a um repositório do GitHub e ativado no Firebase. Siga estes passos:

### Parte 1: Criando o Repositório no GitHub

1.  **Acesse o GitHub:** Faça login na sua conta em [github.com](https://github.com).
2.  **Novo Repositório:** No canto superior direito, clique no sinal de `+` e selecione **"New repository"**.
3.  **Nomeie seu Repositório:** Dê um nome claro, como `planus-app-backend`.
4.  **Visibilidade:** Escolha se o repositório será **Público** ou **Privado**. Para este projeto, privado é geralmente recomendado.
5.  **Criar:** Clique em **"Create repository"**. Não precisa inicializar com README ou .gitignore, pois você já tem os arquivos do projeto.
6.  **Copie a URL:** Na página do seu novo repositório, copie a URL HTTPS. Ela será algo como `https://github.com/seu-usuario/planus-app-backend.git`.

### Parte 2: Conectando o Repositório ao Firebase

Agora que você tem o repositório, vamos conectar os arquivos locais a ele e, em seguida, ao Firebase.

1.  **Abra o Terminal/Console:** No seu ambiente de desenvolvimento local, navegue até a pasta do projeto.
2.  **Inicialize o Git (se ainda não o fez):**
    ```bash
    git init
    ```
3.  **Adicione o Repositório Remoto:**
    ```bash
    git remote add origin URL_DO_SEU_REPOSITORIO_AQUI
    ```
    *Substitua `URL_DO_SEU_REPOSITORIO_AQUI` pela URL que você copiou no passo 6.*
4.  **Adicione, Comite e Envie os Arquivos:**
    ```bash
    git add .
    git commit -m "Primeiro commit: projeto inicial"
    git branch -M main
    git push -u origin main
    ```
    *Isso enviará todos os seus arquivos para o novo repositório no GitHub.*

### Parte 3: Ativando o Backend no Firebase App Hosting

1.  **Acesse o Firebase Console:** Vá para [console.firebase.google.com](https://console.firebase.google.com) e selecione seu projeto (`energisa-invoice-editor`).
2.  **Navegue até App Hosting:** No menu à esquerda, vá para **Build > App Hosting**.
3.  **Crie o Backend:** Você verá a tela que me mostrou. Clique no botão para **criar um novo backend**.
4.  **Conecte ao GitHub:** O Firebase pedirá para você se conectar e autorizar o acesso à sua conta do GitHub.
5.  **Selecione o Repositório:** Escolha o repositório que você acabou de criar (`planus-app-backend` ou o nome que você usou).
6.  **Configure o Deploy:** Siga as instruções para configurar o deploy automático a partir do branch `main`.

Após completar esses passos, o Firebase irá automaticamente fazer o "deploy" do seu código. Seu backend estará "ao vivo", e o webhook do WhatsApp começará a funcionar.
# planus-app-backend
# planus-app-backend
