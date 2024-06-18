const {TrendingItems_Model} = require("../models");

export async function getTrendingItemsWithProducts(_Id) {
    try {
      const trendingItems = await TrendingItems_Model.findById(_Id).populate('ListProduct', 'Name Price Img');
      
      console.log(trendingItems);
      return trendingItems;
    } catch (error) {
      console.error('Error fetching trending items with products:', error);
    }
}