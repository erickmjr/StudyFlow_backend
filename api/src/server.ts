import 'dotenv/config';
import createApp from './app';

const app = createApp();

const PORT = process.env.PORT || 3333;

// Em Vercel (ou produção serverless) não chamar listen — a plataforma executa o handler.
// Só starta o servidor em desenvolvimento/local.
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;