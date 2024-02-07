const mongoose=require('mongoose')
const {Schema} = mongoose

const activitySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    // Define other fields for activity
    // For example:
    description: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const ActivityModel = mongoose.model('Activity', activitySchema);

module.exports = ActivityModel;