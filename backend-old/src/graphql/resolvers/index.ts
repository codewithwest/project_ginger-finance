import User from '../../models/User';
import Asset from '../../models/Asset';
import Transaction from '../../models/Transaction';

export const resolvers = {
    Query: {
        getDashboardStats: async () => {
            // Pending real aggregation logic
            return {
                totalIncome: 0,
                totalExpenses: 0,
                totalSavings: 0,
                currentBalance: 0,
                totalAssetsValue: 0
            };
        },
        getAssets: async (_parent: any, { status }: { status?: string }) => {
            const query = status ? { status } : {};
            
            return await Asset.find(query);
        },
        getTransactions: async (_parent: any, { type, isRecurring }: { type?: string, isRecurring?: boolean }) => {
            const query: any = {};
            if (type) query.type = type;
            if (isRecurring !== undefined) query.isRecurring = isRecurring;
            
            return await Transaction.find(query).sort({ date: -1 });
        },
        searchTransactions: async (_parent: any, { query }: { query: string }) => {
            return await Transaction.find({
                $or: [
                    { category: { $regex: query, $options: 'i' } },
                    { store: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            });
        },
        getProfile: async () => {
            return await User.findOne();
        }
    },

    Mutation: {
        createAsset: async (_parent: any, args: any) => {
            // hardcoding a mock user ID for now until context auth is built
            const asset = new Asset({ ...args, userId: '60d0fe4f5311236168a109ca' });
            
            return await asset.save();
        },
        updateAsset: async (_parent: any, { id, ...updates }: any) => {
            return await Asset.findByIdAndUpdate(id, updates, { new: true });
        },
        deleteAsset: async (_parent: any, { id }: { id: string }) => {
            await Asset.findByIdAndDelete(id);
            
            return true;
        },

        createTransaction: async (_parent: any, args: any) => {
            const transaction = new Transaction({ ...args, userId: '60d0fe4f5311236168a109ca' });
            
            return await transaction.save();
        },
        updateTransaction: async (_parent: any, { id, ...updates }: any) => {
            return await Transaction.findByIdAndUpdate(id, updates, { new: true });
        },
        deleteTransaction: async (_parent: any, { id }: { id: string }) => {
            await Transaction.findByIdAndDelete(id);
            
            return true;
        }
    }
};
