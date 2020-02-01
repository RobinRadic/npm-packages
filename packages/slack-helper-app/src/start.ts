import { Application, DeployExtension } from './';


Application.loadDotEnv();

const app = new Application({
    port      : parseInt(process.env.PORT) || 4391,
    extensions: [
        DeployExtension,
    ],
});

app.start();
