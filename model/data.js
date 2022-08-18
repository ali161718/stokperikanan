const SteinStore = require("stein-js-client");
require('dotenv').config();

const storeList = new SteinStore(process.env.resource);

const resource = {

    searchResource: async (sheet, options) => {
        
        let rawData = await storeList.read(sheet, options);

        return rawData;
    },

    addResource: async (sheet, options) => {

        let rawData = await storeList.append(sheet, options);

        return rawData;
    },

    updateResource:async (sheet, options) => {

        let rawData = await storeList.edit(sheet, options);

        return rawData;
    },

    deleteResource: async (sheet, options) => {

        let rawData = await storeList.delete(sheet, options);

        return rawData;
    }

}

module.exports = resource