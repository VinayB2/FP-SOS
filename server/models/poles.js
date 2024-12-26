import mongoose from "mongoose";

const poleSchema = new mongoose.Schema({
    poleId: { type: String, required: true },
    cameraUrl: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    address: { type: String, required: true },
    isAlerted: {type: Boolean, default: false}
});

export default mongoose.model("Pole", poleSchema);