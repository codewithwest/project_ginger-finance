import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    type: string;
    status: 'Pending' | 'Owned';
    store?: string;
    plannedDate?: Date;
    boughtDate?: Date;
    cost: number;
    createdAt: Date;
    updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Owned'], required: true },
    store: { type: String },
    plannedDate: { type: Date },
    boughtDate: { type: Date },
    cost: { type: Number, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IAsset>('Asset', AssetSchema);
