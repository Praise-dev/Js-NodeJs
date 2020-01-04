//BUDGET CONTROLLER
const budgetController = (function(){
    var Expense = function(id, description, value){
      this.id= id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
          if (totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome) * 100);
          }
          else {
            this.percentage = -1;
          }
    };

      Expense.prototype.getPercentage = function () {
        return this.percentage;
      }


    var Income = function(id, description, value){
      this.id= id;
      this.description = description;
      this.value = value;
    };



    var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(curr){
        sum = sum + curr.value;
      })
      data.totals[type] = sum;
    };

    var data = {
      allItems : {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc:0
      },
      budget:0,
      percentage: -1
    };

      return {
        addItem: function(type, des, val){
          var newItem, ID;
          //create new ID
          if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length-1].id + 1;
          }else{
            ID =0;
          }

          // create new exp item
          if (type === 'exp'){
            newItem = new Expense(ID, des, val);
          }// create new inc item
          else if (type === 'inc'){
            newItem = new Income(ID, des, val);
          }

          data.allItems[type].push(newItem);
          return newItem;
        },

        deleteItem: function functionName(type, id) {
          var ids, index;
          ids  = data.allItems[type].map(function(current){
               return current.id;
          });

          index = ids.indexOf(id);
          if (index !== -1){
            data.allItems[type].splice(index, 1);
          }

        },

        calculateBudget: function(){
          //calculate total income and expenses;
          calculateTotal('exp');
          calculateTotal('inc');
          //Calculate the budget: income - expenses
          data.budget = data.totals.inc - data.totals.exp;

          //calculate the percentage  of income that we spent
          if(data.totals.inc > 0){
              data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
          } else {
            data.percentage = -1;
          }
        },

        calculatePercentages : function() {
            data.allItems.exp.forEach(function (curr) {
              curr.calcPercentage(data.totals.inc);
            })
        },

          getPercentages: function(){
              var allPerc = data.allItems.exp.map(function(curr) {
                return curr.getPercentage();
              })
              return allPerc;
          },

        getBudget: function(){
            return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
            }
        },

        testing: function(){
          console.log(data);
        }

      }

})();

//UI CONTROLLER
var uiController = (function(){

    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputButton: '.add__btn',
      incomeContainer: '.income__list',
      expenseContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel : '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage',
      dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){
      var numSplit, int, dec;
      num = Math.abs(num);
      num = num.toFixed(2);
      numSplit = num.split('.');
      int = numSplit[0];
      if (int.length > 3){
        int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
      }
      dec = numSplit[1];

      return  (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };

    var nodeListforEach = function(list, callback) {
        for(var i = 0; i< list.length; i++){
          callback(list[i], i);
        }
    }


  return {
    getInput: function(){
      return{
        type: document.querySelector(DOMstrings.inputType).value,//either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },

    addListItem: function(obj, type){
        var html, newhtml;
        //create HTML
        if (type === 'inc'){
          element = DOMstrings.incomeContainer;
          html =   '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }else if (type === 'exp'){
          element = DOMstrings.expenseContainer;
             html = ' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        //Replace placeholder with real text
        newhtml = html.replace('%id%', obj.id);
        newhtml = newhtml.replace('%description%', obj.description);
        newhtml = newhtml.replace('%value%', formatNumber(obj.value, type));

        //Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newhtml)

    },

    deleteListItem: function(selectorID){
      var el =document.getElementByID(selectorID)
      el.parentNode.removeChild(el);
    },

    clearFields: function(){
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },



    displayBudget: function(obj){
      obj.budget ? type = 'inc' : type = 'exp';
        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

        if(obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        }else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '----' ;
        }
    },



    displayPercentages: function(percentages){
        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

        nodeListforEach(fields, function(curr, index) {
            if(percentages[index] > 0){
              curr.textContent = percentages[index] + '%';
            }
            else {
              curr.textContent = '---';
            }
        });

    },

    displayMonth: function () {
      var now, year, month, months;
      now = new Date();
      year = now.getFullYear();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemmber', 'December']
      month = now.getMonth();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ', ' + ' '  + year;
    },

    changedType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue);

        nodeListforEach(fields, function (curr) {
          curr.classList.toggle('red-focus');
        })

        document.querySelector(DOMstrings.inputButton).classList.toggle('red');

    },

    getDOMstrings: function(){
      return DOMstrings;
    }
  }
})()


//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var setUpEventListeners = function(){
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)
    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
  });

  document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
};

  var DOM = UICtrl.getDOMstrings()
  var ctrlAddItem  = function(){
    var input, newItem, budget
  // 1. Get the field input data
   input = UICtrl.getInput();


   var updateBudget = function(){
     //1. calculate the budget
     budgetCtrl.calculateBudget();

     //2. Return the budget
     budget = budgetCtrl.getBudget();
     console.log(budget);
   }

   var updatePercentages = function(){
      //1. calculate percentages
      budgetCtrl.calculatePercentages();

      //2. Read percentages from budget controller
      var percentages = budgetCtrl.getPercentages();

      //3. Update UI with new percentages
      UICtrl.displayPercentages(percentages);

   };


   if(input.description !== " " && !isNaN(input.value) && input.value > 0){
     // 2. Add item to budget controller
     newItem = budgetCtrl.addItem(input.type, input.description, input.value)
     // 3. Add new item to UI
     UICtrl.addListItem(newItem, input.type);
     //4. Clear he input fields
     UICtrl.clearFields()
     // 5.Calculate and update budget
     updateBudget();

     //6. Calculate and update percentages
     updatePercentages();
   }

}

 var ctrlDeleteItem = function(event){
   var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
      splitID = itemID.split('-')
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. DELETE ITEM FROM DS
      budgetCtrl.deleteItem(type, ID);

      //2.DELETE ITEM FROM UI
      UICtrl.deleteListItem(itemID);

      //3. UPDATE AND SHOW NEW BUDGET
      updateBudget();

      //4. Calculate and update percentages
      updatePercentages();
    }
 }

  return{
    init: function(){
      console.log('application has started');
    UICtrl.displayMonth();
    UICtrl.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: -1
    });
    setUpEventListeners();
    }
  };
})(budgetController, uiController);


controller.init();
