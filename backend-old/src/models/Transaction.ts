import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'Income' | 'Expense' | 'Savings';
    category: string;
    store?: string;
    amount: number;
    date: Date;
    description?: string;
    isRecurring: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Income', 'Expense', 'Savings'], required: true },
    category: { type: String, required: true },
    store: { type: String },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    isRecurring: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
