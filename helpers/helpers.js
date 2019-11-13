const fs = require('fs');

let keys;
let outData = [];
let salesData = [];
const mlist = { '0':"January", '1':"February", '2':"March", '3':"April", '4':"May", '5':"June",
 '6':"July", '7':"August", '8':"September", '9':"October", '10':"November", '11':"December"};

const readFile = ()=>{
    fs.readFile('data/sales.txt', 'utf8', function(err,data) {
    let index = 0;
    if(err) throw err;
    let splitted = data.toString().split("\n");
     splitted= splitted.map(ln => ln.replace('\r',''));
    for (let line of splitted) {
        if(index == 0) {
            setHeaderRowAsKeys(line);
            index++;
            continue;
        }
        else {
            line = addKeys(line.split(','));
            outData.push(line);
        }
        index++;
    }
    let result = writeFile(outData,'data/sales.json');
    return result;
    });
}

const writeFile = (data, path)=> {
	var jsonOut = fs.createWriteStream(path);
	jsonOut.write(JSON.stringify(data));
    jsonOut.on('error', (err) =>
    { console.log(err); });
	jsonOut.end();
	return "done";
}

const setHeaderRowAsKeys = (line)=> {
    keys = line.split(',').map(key=> key.toLowerCase().replace(' ',''));
}

const addKeys = (line)=> {
    return Object.assign({}, ...keys.map((n, index) => {
        if(n === 'totalprice' || n === 'quantity' || n === 'unitprice')
        return {[n]: Number(line[index])}
        else
        return {[n]: line[index]}
    }
    ));
}

const calculateSales = ()=> {
    parseData();
    totalSales = salesData.reduce((sales, data)=> {
        return sales + data.totalprice;
    },0);
    return totalSales;
}


const salesMonth = (month)=>{
    parseData();
    sales = salesData.filter(sale => {
        return mlist[new Date(sale.date).getMonth().toString()] === month;
    }).reduce((sales, data)=> {
        return sales + Number(data.totalprice);
    },0)
    return sales;
};

const maxQuantitySold = (month)=> {
    parseData();
    let max = { name: '', totalQuantity: 0};
    max.totalQuantity = 0;
    sales = salesData.filter(sale=> {
        return mlist[new Date(sale.date).getMonth().toString()] === month;
    });
    for(s of sales) {
        max.name = s.sku;
        let arr = sales.filter((sale)=> {
            return sale.sku === s.sku;
        });
        let totalQuantity = arr.reduce((prev, next)=>{
            return prev + next.quantity;
        },0);
        if(totalQuantity > max.totalQuantity) {
            max.name = s.sku;
            max.totalQuantity = totalQuantity
        }
    }
    return max;
}


const maxRevenueItems = (month)=> {
    parseData();
    let max = {name: '', totalPrice: 0};
    let maxArr = [];
    max.totalPrice = 0;
    sales = salesData.filter(sale=> {
        return mlist[new Date(sale.date).getMonth().toString()] === month;
    });
    for(s of sales) {
        max.name = s.sku;
        let arr = sales.filter((sale)=> {
            return sale.sku === s.sku;
        });
        let totalPrice = arr.reduce((prev, next)=>{
            return prev + next.totalprice;
        },0);
        if(totalPrice > max.totalPrice) {
            max.name = s.sku;
            max.totalPrice = totalPrice;
        }
        else if(totalPrice === max.totalPrice && max.name !== s.sku) {
            max.name = s.sku;
            max.totalPrice = totalPrice;
            maxArr.push(max);
        }
    }
    return max;
}


const numberOfOrders = (month)=> {
    parseData();
    popularItem = maxQuantitySold(month);
    number = salesData.filter(sale=> {
        return mlist[new Date(sale.date).getMonth().toString()] === month;
    }).filter(data => data.sku === popularItem.name).length;
    return number;
}

const parseData = ()=> {
    let data=fs.readFileSync('data/sales.json', 'utf8');
    salesData = JSON.parse(data);
}

module.exports = {
    numberOfOrders,
    maxRevenueItems,
    maxQuantitySold,
    salesMonth,
    calculateSales,
    addKeys,
    setHeaderRowAsKeys,
    writeFile,
    readFile
}

