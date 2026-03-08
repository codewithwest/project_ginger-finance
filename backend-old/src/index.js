"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const initializeServer = async () => {
    await (0, database_1.default)();
    const app = (0, express_1.default)();
    // Dummy typeDefs and resolvers for initial setup
    const typeDefs = `#graphql
    type Query {
      hello: String
    }
  `;
    const resolvers = {
        Query: {
            hello: () => 'Welcome to Ginger Finance API',
        },
    };
    const server = new server_1.ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    app.use('/graphql', (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(server));
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}/graphql`);
    });
};
initializeServer().catch((error) => {
    console.error('Failed to start server:', error);
});
//# sourceMappingURL=index.js.map