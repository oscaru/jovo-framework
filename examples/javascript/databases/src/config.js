module.exports = {
   logging: true,
   // v1: {
   //    logging: true,
   // },
   //
   // intentMap: {
   //    'AMAZON.StopIntent': 'END',
   // },
   //
    db: {
        default: 'DynamoDb',
        FileDb: {
            pathToFile: './db/db.json'
        }
    },

};
