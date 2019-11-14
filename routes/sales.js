const path = require('path');
const express = require('express');
const Router = express.Router();
const salesController = require('../controller/sales');

Router.get('/total-sales',salesController.totalSales);
Router.get('/monthly-sales/:month',salesController.monthWiseSales);
Router.get('/most-popular/:month',salesController.mostPopularItem);
Router.get('/most-revenue/:month',salesController.mostRevenueItem);
Router.get('/number-orders/:month',salesController.numberOrders);
Router.get('/min-max-average',salesController.minMaxAverageOrders);
Router.get('/get-items',salesController.getItems);

module.exports = Router;
