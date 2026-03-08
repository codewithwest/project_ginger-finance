import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/User';
import Asset from '../src/models/Asset';
import Transaction from '../src/models/Transaction';
import { describe } from 'node:test';

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
    await User.deleteMany({});
    await Asset.deleteMany({});
    await Transaction.deleteMany({});
});

describe('Mongoose Models', () => {
    describe('User Model', () => {
        it('should create a valid user', async () => {
            const validUser = new User({
                username: 'testuser',
                email: 'test@farm.com',
                passwordHash: 'hashedPass123'
            });
            const savedUser = await validUser.save();
            expect(savedUser.id).toBeDefined();
            expect(savedUser.role).toBe('USER'); // Default value
        });

        it('should fail if required fields are missing', async () => {
            const invalidUser = new User({ username: 'testuser' });
            await expect(invalidUser.save()).rejects.toThrow();
        });
    });

    describe('Asset Model', () => {
        it('should create an asset with pending status', async () => {
            const user = await new User({ username: 'u', email: 'e@e.com', passwordHash: 'p' }).save();

            const validAsset = new Asset({
                userId: user.id,
                name: 'Tractor',
                type: 'Equipment',
                status: 'Pending',
                cost: 50000
            });

            const savedAsset = await validAsset.save();
            expect(savedAsset.id).toBeDefined();
            expect(savedAsset.status).toBe('Pending');
        });
    });

    describe('Transaction Model', () => {
        it('should default isRecurring to false', async () => {
            const user = await new User({ username: 'u2', email: 'e2@e.com', passwordHash: 'p' }).save();

            const txn = new Transaction({
                userId: user.id,
                type: 'Expense',
                category: 'Feed',
                amount: 500,
                date: new Date()
            });

            const savedTxn = await txn.save();
            expect(savedTxn.isRecurring).toBe(false);
        });
    });
});
