import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {

    },
    amount:{
        type: Number,
        required: true,
    },
    purchaser:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
    }

});

const TicketModel = new mongoose.model("tickets", TicketSchema);

export default TicketModel;