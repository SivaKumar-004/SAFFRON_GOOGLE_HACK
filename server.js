import Fastify from 'fastify';
import { initializeDB } from './src/db/database.js';
import repairRoutes from './src/routes/repairRoutes.js';

// Initialize Fastify
const fastify = Fastify({
    logger: true // Fastify's high-performance logger
});

// Register Routes
fastify.register(repairRoutes);

const start = async () => {
    try {
        // Run database schemas initialization
        initializeDB();

        // Start server on PORT 3001
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
        
        console.log(`✅ CLEAR-3 Orchestration Core listening on 3001`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
