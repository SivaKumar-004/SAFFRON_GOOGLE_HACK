import { calculateOptimalRepairRoute } from '../services/routingEngine.js';
import db from '../db/database.js';

export default async function repairRoutes(fastify, options) {
    fastify.post('/api/assets/report-failure', async (request, reply) => {
        try {
            const { assetId } = request.body;

            if (!assetId) {
                return reply.code(400).send({
                    error: "Bad Request",
                    message: "assetId is required."
                });
            }

            const dispatchPayload = await calculateOptimalRepairRoute(assetId);

            return reply.code(200).send(dispatchPayload);
        } catch (error) {
            fastify.log.error(error);
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({
                error: statusCode === 500 ? "Internal Server Error" : "Client Error",
                message: error.message
            });
        }
    });

    fastify.get('/api/assets', async (request, reply) => {
        try {
            // Join Assets with their Facilities to provide location context
            const assets = db.prepare(`
                SELECT a.id, a.type, a.status, a.usage_pattern_factor, 
                       f.name as facility_name
                FROM Assets a
                JOIN Facilities f ON a.facility_id = f.id
            `).all();
            return reply.code(200).send(assets);
        } catch (error) {
            fastify.log.error(error);
            return reply.code(500).send({ error: "Failed to fetch assets" });
        }
    });

    fastify.get('/health', async (request, reply) => {
        return { status: 'healthy', service: 'CLEAR-3 Orchestration Core' };
    });

    fastify.get('/api/telemetry/routing', async (request, reply) => {
        return reply.code(200).send(global.routingLogs || []);
    });

    fastify.get('/api/telemetry/database', async (request, reply) => {
        try {
            const facilities = db.prepare('SELECT count(*) as total FROM Facilities').get().total;
            const assets = db.prepare('SELECT count(*) as total FROM Assets').get().total;
            const vendors = db.prepare('SELECT count(*) as total FROM Vendors').get().total;

            return reply.code(200).send({ facilities, assets, vendors });
        } catch (error) {
            return reply.code(500).send({ error: "Failed to poll SQLite." });
        }
    });
}
