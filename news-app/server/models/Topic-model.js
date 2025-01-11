const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    email : {
        type : String,
        require:true,
    },
    topic_name : {
        type : String,
        require:true,
    }
});

const Topic = mongoose.model('Fav_topic',topicSchema);
module.exports = Topic;