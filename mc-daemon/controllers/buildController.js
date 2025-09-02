import { buildService } from '../services/buildService.js';

export const buildController = {
    listBuilds: async (req, res, next) => {
        try {
            const builds = await buildService.listBuilds();
            res.json(builds);
        } catch (err) { next(err); }
    },

    getBuild: async (req, res, next) => {
        try {
            const version = req.params.version;
            const build = await buildService.getBuild(version);
            res.json(build);
        } catch (err) { next(err); }
    },

    downloadBuild: async (req, res, next) => {
        try {
            const version = req.params.version;
            const result = await buildService.downloadBuild(version);
            res.json(result);
        } catch (err) { next(err); }
    }
};
