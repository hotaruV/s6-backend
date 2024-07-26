import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const clarificationMeetingsSchema = Schema(
  {
    id: { type: String, require}, 
    ocid: { type: String, require},
    
    
    date: { type: Date, require },
   
    attendees: 
        {
          type: Schema.Types.ObjectId,
          require,
          ref: "tender.attendees",
          autopopulate: true,
        },

   officials: 
        {
          type: Schema.Types.ObjectId,
          require,
          ref: "tender.officials",
          autopopulate: true,
        },
    
   
  },
  {
    collection: "tender.clarificationMeetings",
    versionKey: false, //here
  }
);

clarificationMeetingsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("tender.clarificationMeetings", clarificationMeetingsSchema);