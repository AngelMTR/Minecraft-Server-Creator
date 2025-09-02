import app from './app.js';
import { config } from './daemon.config.js';

app.listen(config.port, () => {
    console.log(`mc-daemon running on port ${config.port}`);
});
