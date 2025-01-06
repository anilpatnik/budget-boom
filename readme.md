#### Install Tools and Packages

- Install [Git](https://git-scm.com/downloads)
  - Verify `git -V`
  - Configure [Posh Git](https://git-scm.com/book/en/v2/Appendix-A:-Git-in-Other-Environments-Git-in-PowerShell) in **PowerShell**
- Install [Node](https://nodejs.org/en/download)
  - Verify `node -v`
  - Verify `npm -v`
- Install [VS Code](https://code.visualstudio.com)
- Install VS Code Extensions

  - [TypeScript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [VS Code Icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
  - [Tailwind](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
  - [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)

#### Download and Open App

- Download App `git clone https://github.com/anilpatnik/budget-boom.git`
- Open `budget-boom` folder in VS Code

#### Build and Run API (Node)

- Open VS Code `TERMINAL`
- Go to `server` folder
- Create file `firebase.config.json`
- Create file `.env`
- Copy and Paste env variables from `.env.dev`
- Install npm packages `npm install`
- Start dev server `npm run dev`

#### Build and Run Web (React)

- Open VS Code `TERMINAL`
- Go to `client` folder
- Create file `.env`
- Copy and Paste env variables from `.env.dev`
- Install npm packages `npm install`
- Start dev server `npm run dev`
