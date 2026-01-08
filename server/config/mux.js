const Mux = require('@mux/mux-node');
require('dotenv').config();

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID,
    process.env.MUX_TOKEN_SECRET
);

module.exports = Video;
