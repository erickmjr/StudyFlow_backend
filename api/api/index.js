// Este arquivo será a única serverless function na Vercel (reduz contagem de functions).
const appModule = require("../dist/app");
const app = appModule && appModule.default ? appModule.default : appModule;

module.exports = (req, res) => {
    // delega a requisição para o app Express compilado
    return app(req, res);
};
