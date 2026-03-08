import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

dotenv.config();

const initializeServer = async (): Promise<void> => {
    await connectDB();

    const app = express();



    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        bodyParser.json() as express.RequestHandler,
        expressMiddleware(server) as express.RequestHandler
    );

    app.get('/', (req, res) => {
        res.json({
            message: 'Welcome to the Ginger Finance API',
            status: '200'
        });
    });

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}/graphql`);
    });
};

initializeServer().catch((error) => {
    console.error('Failed to start server:', error);
});
