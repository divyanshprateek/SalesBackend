const fs = require("fs");
let keys;
let salesData = [];
const mlist = {
  "0": "January",
  "1": "February",
  "2": "March",
  "3": "April",
  "4": "May",
  "5": "June",
  "6": "July",
  "7": "August",
  "8": "September",
  "9": "October",
  "10": "November",
  "11": "December"
};

// Reading Data From The Text File And Producing An Array Of Objects
const readFile = () => {
  const dataArr = fs.readFileSync("data/sales.txt", "utf8");
  let index = 0;
  let splitted = dataArr.toString().split("\n");
  splitted = splitted.map(ln => ln.replace("\r", ""));
  for (let line of splitted) {
    if (index == 0) {
      setHeaderRowAsKeys(line);
      index++;
      continue;
    } else {
      line = addKeys(line.split(","));
      salesData.push(line);
    }
    index++;
  }
};

const setHeaderRowAsKeys = line => {
  keys = line.split(",").map(key => key.toLowerCase().replace(" ", ""));
};

const addKeys = line => {
  return Object.assign(
    {},
    ...keys.map((n, index) => {
      if (n === "totalprice" || n === "quantity" || n === "unitprice")
        return { [n]: Number(line[index]) };
      else return { [n]: line[index] };
    })
  );
};

//Calculating Total Sales
const calculateSales = () => {
  totalSales = salesData.reduce((sales, data) => {
    return sales + data.totalprice;
  }, 0);
  return totalSales;
};

//Calculating sales per month
const salesMonth = month => {
  let sales = salesData
    .filter(sale => {
      return mlist[new Date(sale.date).getMonth().toString()] === month;
    })
    .reduce((sales, data) => {
      return sales + Number(data.totalprice);
    }, 0);
  return sales;
};

//Most popular item per month
const maxQuantitySold = month => {
  let max = { name: "", totalQuantity: 0 };
  max.totalQuantity = 0;
  sales = salesData.filter(sale => {
    return mlist[new Date(sale.date).getMonth().toString()] === month;
  });
  for (let s of sales) {
    max.name = s.sku;
    let arr = sales.filter(sale => {
      return sale.sku === s.sku;
    });
    let totalQuantity = arr.reduce((prev, next) => {
      return prev + next.quantity;
    }, 0);
    if (totalQuantity > max.totalQuantity) {
      max.name = s.sku;
      max.totalQuantity = totalQuantity;
    }
  }
  return max;
};

//Most Revenue per month
const maxRevenueItems = month => {
  let max = { name: "", totalPrice: 0 };
  let maxArr = [];
  max.totalPrice = 0;
  sales = salesData.filter(sale => {
    return mlist[new Date(sale.date).getMonth().toString()] === month;
  });
  for (s of sales) {
    max.name = s.sku;
    let arr = sales.filter(sale => {
      return sale.sku === s.sku;
    });
    let totalPrice = arr.reduce((prev, next) => {
      return prev + next.totalprice;
    }, 0);
    if (totalPrice > max.totalPrice) {
      max.name = s.sku;
      max.totalPrice = totalPrice;
    } else if (totalPrice === max.totalPrice && max.name !== s.sku) {
      max.name = s.sku;
      max.totalPrice = totalPrice;
      maxArr.push(max);
    }
  }
  return max;
};

//Number Of Orders Of Most Popular Item In a Month
const numberOfOrders = month => {
  let popularItem = maxQuantitySold(month);
  let name = popularItem.name;
  let number = salesData
    .filter(sale => {
      return mlist[new Date(sale.date).getMonth().toString()] === month;
    })
    .filter(data => data.sku === popularItem.name).length;
  return {name,number};
};

//Retrieve 10 Items From DataSet To Display
const getItems = () => {
  const newItem = [];
  for (let i = 0; i < 10; i++) {
    newItem.push(salesData[i]);
  }
  return newItem;
};

//Returns Quantity Of Items Sold In The DataSet
const quantityOfItems = name => {
  let quantity = salesData
    .filter(data => data.sku === name)
    .reduce((a, b) => {
      return a + b.quantity;
    }, 0);
  return quantity;
};

//Returns Most Popular Item In the Dataset
const mostPopularItem = () => {
  let set,
    arr = [];
  for (sales of salesData) {
    arr.push(sales.sku);
  }
  set = new Set(arr);
  let allItems = [...set];
  let max = 0,
    maxItem = "";
  for (let name of allItems) {
    let quantity = quantityOfItems(name);
    if (quantity > max) {
      max = quantity;
      maxItem = name;
    }
  }
  return maxItem;
};

//Returns Min, Max And Average of most popular item in the dataset
const minMaxAverage = () => {
  let name = mostPopularItem();
  let monthlySold = [];
  let allMonthsDataSet = [];
  let uniqueMonth;
  for (let sales of salesData) {
    allMonthsDataSet.push(mlist[new Date(sales.date).getMonth().toString()]);
  }
  uniqueMonth = new Set(allMonthsDataSet);
  allMonthsDataSet = [...uniqueMonth];
  for (month in allMonthsDataSet) {
    const quantity = salesData
      .filter(data => {
        return (
          name === data.sku &&
          mlist[new Date(data.date).getMonth().toString()] === mlist[month]
        );
      })
      .reduce((a, b) => {
        return a + b.quantity;
      }, 0);
    monthlySold.push(quantity);
  }
  let min = Math.min(...monthlySold);
  let max = Math.max(...monthlySold);
  let sum = monthlySold.reduce((a, b) => {
    return a + b;
  }, 0);
  let average = sum / allMonthsDataSet.length;
  return { name:name, min:min, max:max, average:average };
};

readFile();

module.exports = {
  numberOfOrders,
  maxRevenueItems,
  maxQuantitySold,
  salesMonth,
  calculateSales,
  minMaxAverage,
  getItems
};
