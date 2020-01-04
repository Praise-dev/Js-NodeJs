

//Initialize and declare variables
var week1, week2, week3, week4;

week1 = document.querySelector('.week1').querySelectorAll('input');
week2 = document.querySelector('.week2').querySelectorAll('input')
week3 = document.querySelector('.week3').querySelectorAll('input');
week4 = document.querySelector('.week4').querySelectorAll('input');
start = document.querySelector('button');
const month = [week1, week2, week3, week4];


//Get the different products available in store
function getProductNames(){
  let products =[];
  week1.forEach(curr => {
    products.push(curr.name);
  })
  return(products);
}


//Get the sales of each product per week
function getWeeklySale(week) {
  let sales = new Map();
  let totalWeek= 0;
    week.forEach(curr=> {
        sales.set(curr.name, parseInt(curr.value));
    })
return function(){
    sales.forEach(curr =>{
      totalWeek = totalWeek + curr;
    })
    // console.log(`Total sales for`, totalWeek);
    return[totalWeek, sales];
    }
}

//Get average sales of Each Week
function calculateAverageWeeklySale(total){
  const average = Math.floor(total[0]/total[1].size);
  return average;
}

//Get total Monthly Sales
function calculateTotalMonthlySales(arr) {
  let total = 0;
  arr.forEach(curr => {
      total = total + (getWeeklySale(curr)())[0];
  })
    console.log('The total sales of the month is ', total);
    return total;
}

//Get the best product of the month
function BestProductMonthly(arr) {
  let max = {};
  let best;
  let product = document.querySelectorAll('form input');
  //get the total sales of each product for the month
  for(let i=0; i < arr.length; i++){
    product.forEach(curr => {
      if(curr.name == arr[i]){
        if(!max[arr[i]]){
          max[arr[i]] = parseInt(curr.value);
        }
        else {
          max[arr[i]] += parseInt(curr.value);
        }
      }
    })
  }
//get the product with the highest sales
  let bestProduct = max[arr[0]];
  for(let i=0; i <arr.length; i++){
    if(bestProduct <= max[arr[i]]){
      bestProduct = max[arr[i]];
      bestProductName = arr[i];
    }
  }
  console.log(max);
    return[bestProductName, bestProduct, max];
}


//Initialize the Analysis
function init(){
  document.querySelectorAll('form input').forEach(curr => {
    curr.value = 0;
  })

  start.addEventListener('click', ()=>{
    month.forEach((curr, ind) => {
      let weeks = calculateAverageWeeklySale(getWeeklySale(curr)())
      alert(`The Average Weekly sale for Week ${ind+1} is ${weeks}`  );
    });
   let monthSale= calculateTotalMonthlySales(month);
   alert(`The total sales for the month is ${monthSale}`)
   var bestProduct = BestProductMonthly(getProductNames());
   alert(`The best product is ${bestProduct[0]} with a sale of ${bestProduct[1]}`)
   })
};

init()
console.log('app.js connected');
