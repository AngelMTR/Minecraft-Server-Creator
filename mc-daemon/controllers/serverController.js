import * as serverService from '../services/serverService.js';

export async function createServer(req, res, next) {
    try {
        const { userId, version } = req.body;
        const result = await serverService.createServer(userId, version);
        res.json(result);
    } catch (err) { next(err); }
}
