const Helpers = require('../helpers/helpers');

exports.convertFile = (req,res,next)=> {
   const result = Helpers.readFile();
   if(result)
   res.json({message: result});
   else
   res.json({message: 'Error: Cannot Convert File'})
}

exports.totalSales = (req,res,next)=> {
    const sales = Helpers.calculateSales();
    res.json({ totalSales:sales });
}

exports.monthWiseSales = (req,res,next)=> {
    let params = req.params.month;
    const sales = Helpers.salesMonth(params);
    res.json({ monthlySales:sales });
}


exports.mostPopularItem = (req, res, next)=> {
    let params = req.params.month;
    const item = Helpers.maxQuantitySold(params);
    res.json({item: item});
}

exports.mostRevenueItem = (req, res, next)=> {
    let params = req.params.month;
    const item = Helpers.maxRevenueItems(params);
    res.json({item: item});
}

exports.numberOrders = (req, res, next)=> {
    let params = req.params.month;
    const orders = Helpers.numberOfOrders(params);
    res.json({orders: orders});
}

exports.minMaxAverageOrders = (req, res, next)=> {
    const num = Helpers.minMaxAverageOrders();
    res.json(num);
}

exports.getItems = (req, res, next)=> {
    const items = Helpers.getItems();
    res.json(items);
}