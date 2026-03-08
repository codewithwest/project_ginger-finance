import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { resolvers } from '../src/graphql/resolvers';
import Asset from '../src/models/Asset';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Asset.deleteMany({});
});

describe('GraphQL Resolvers', () => {
    describe('Queries', () => {
        it('getAssets should return an empty array if none exist', async () => {
            const result = await resolvers.Query.getAssets(null, {});
            expect(result).toEqual([]);
        });

        it('getAssets should return filtered arrays by status', async () => {
            const mockUserId = new mongoose.Types.ObjectId();
            await new Asset({ userId: mockUserId, name: 'A1', type: 'T', status: 'Pending', cost: 100 }).save();
            await new Asset({ userId: mockUserId, name: 'A2', type: 'T', status: 'Owned', cost: 200 }).save();

            const pendingOnly = await resolvers.Query.getAssets(null, { status: 'Pending' });
            
            expect(pendingOnly.length).toBe(1);
            expect(pendingOnly[0].name).toBe('A1');
        });
    });

    describe('Mutations', () => {
        it('createAsset should persist a new asset', async () => {
            const args = {
                name: 'Barn',
                type: 'Real Estate',
                status: 'Owned',
                cost: 150000
            };

            const result = await resolvers.Mutation.createAsset(null, args);
           
            expect(result.id).toBeDefined();
            expect(result.name).toBe('Barn');

            const dbCheck = await Asset.findById(result.id);
            
            expect(dbCheck).not.toBeNull();
        });
    });
});
