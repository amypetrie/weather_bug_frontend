/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var foodsRequests = __webpack_require__(1);
	var foodsDiary = __webpack_require__(2);
	var events = __webpack_require__(3);
	var fileName = location.pathname.split('/').slice(-1)[0];
	__webpack_require__(4);
	__webpack_require__(8);

	$(document).ready(function () {
	  renderData(fileName);
	  addFoodMealListener();
	  addFoodMealListener();
	  addFoodListener();
	  editFoodListener(fileName, originalFood);
	  filterFoodListener();
	  deleteFoodMealListener();
	  calorieSorter();
	  events.deleteFoodListener(foodsRequests);
	  events.setOriginalFoodListener(originalFood);
	});

	var originalFood = {};

	var renderData = function renderData(fileName) {
	  if (fileName === 'foods.html' || fileName === 'foods') {
	    foodsRequests.getFoods();
	  } else {
	    foodsDiary.getDiaryFoods();
	    foodsDiary.getMeals();
	  }
	};

	var addFoodMealListener = function addFoodMealListener() {
	  $('.meal-add-buttons').on('click', addNewFoodsToMeal);
	};

	var addFoodListener = function addFoodListener() {
	  $('#submit-food').on('click', function (event) {
	    event.preventDefault();
	    newFoodSequence();
	  });
	};

	var editFoodListener = function editFoodListener(fileName, originalFood) {
	  $('#food-table-info').on('focusout', function (event) {
	    var fileName = location.pathname.split('/').slice(-1)[0];
	    if (fileName === 'foods.html' && event.target.nodeName != 'BUTTON') {
	      var foodId = event.target.parentElement.attributes.data.value.split('-')[1];
	      var foodName = $('.food-item-' + foodId).children()[0].innerText;
	      var foodCalories = $('.food-item-' + foodId).children()[1].innerText;
	      if (originalFood.name != foodName || originalFood.calories != foodCalories) {
	        foodsRequests.updateFood(foodId, foodName, foodCalories);
	      }
	    }
	  });
	};

	var filterFoodListener = function filterFoodListener() {
	  $('#food-filter-input').on('keyup', function (event) {
	    filterFoods();
	  });
	};

	var deleteFoodMealListener = function deleteFoodMealListener() {
	  $('.meal-table').on('click', function (event) {
	    if (event.target.nodeName == 'BUTTON') {
	      var foodId = event.target.id.split('-')[2];
	      var mealName = $(event.target).attr('data').split('-')[0];
	      foodsDiary.updateMealWithFood(mealName, foodId, 'DELETE');
	      events.removeFoodRow(event);
	      updateMealCalories(setFoodData(event.target), mealName, 'decreaseMeal');
	    }
	  });
	};

	var updateMealCalories = function updateMealCalories(food, meal, method) {
	  updateMealTable(food, meal, method);
	  updateTotalsTable(food, method);
	};

	var updateMealTable = function updateMealTable(food, meal, method) {
	  var currentCaloriesNode = $('#' + meal + '-total-calories-count').find('p');
	  var totalCaloriesNode = getRemainingCaloriesValue(meal);
	  updateTotalCaloriesValue(food, currentCaloriesNode, method);
	  updateRemainingCaloriesValue(food, meal, totalCaloriesNode, method);
	};

	var updateTotalsTable = function updateTotalsTable(food, method) {
	  var totalDiaryConsumedNode = $('.diary-total-calories-consumed');
	  var currentDiaryRemainingCaloriesNode = getRemainingCaloriesValue('diary');
	  updateTotalCaloriesValue(food, totalDiaryConsumedNode, method);
	  updateRemainingCaloriesValue(food, 'diary', currentDiaryRemainingCaloriesNode, method);
	};

	var updateRemainingCaloriesValue = function updateRemainingCaloriesValue(food, meal, currentCaloriesNode, method) {
	  if (method == 'decreaseMeal') {
	    var operator = '+';
	  } else {
	    var operator = '-';
	  }
	  var totalCalories = parseInt(currentCaloriesNode.text());
	  var foodCalories = parseInt(food.calories);
	  var updatedRemainingCalories = calculateTotals(operator, totalCalories, foodCalories);
	  updateNodeValue(currentCaloriesNode, updatedRemainingCalories);
	  foodsDiary.styleRemainingCalorieCount(meal, updatedRemainingCalories);
	};

	var updateTotalCaloriesValue = function updateTotalCaloriesValue(food, totalCaloriesNode, method) {
	  if (method == 'decreaseMeal') {
	    var operator = '-';
	  } else {
	    var operator = '+';
	  }
	  var totalCalories = parseInt($(totalCaloriesNode).text());
	  var foodCalories = parseInt(food.calories);
	  var updatedTotalCalories = calculateTotals(operator, totalCalories, foodCalories);
	  updateNodeValue(totalCaloriesNode, updatedTotalCalories);
	};

	var calculateTotals = function calculateTotals(operator, digit1, digit2) {
	  var formulate = {
	    '+': function _(digit1, digit2) {
	      return digit1 + digit2;
	    },
	    '-': function _(digit1, digit2) {
	      return digit1 - digit2;
	    }
	  };
	  return formulate[operator](digit1, digit2);
	};

	var getRemainingCaloriesValue = function getRemainingCaloriesValue(meal) {
	  return $('#' + meal + '-remaining-calories-count').find('p');
	};

	var updateNodeValue = function updateNodeValue(node, value) {
	  $(node.find('strong')[0]).text(value);
	};

	var addNewFoodsToMeal = function addNewFoodsToMeal() {
	  var checkedFoods = $('.food-item-checkbox:checkbox:checked');
	  checkedFoods.each(function (index) {
	    var food = setFoodData(checkedFoods[index]);
	    var meal = $(event.target).attr('data');
	    foodsDiary.renderFoodToMealTable(meal, food);
	    updateMealCalories(food, meal, 'increaseMeal');
	    foodsDiary.updateMealWithFood(meal, food.id, 'POST');
	  });
	  clearChecked();
	};

	var setFoodData = function setFoodData(food) {
	  var foodNode = $(food).parents('article')[0];
	  return {
	    id: $(foodNode).attr('data').split('-')[1],
	    name: $($(foodNode).find('p')[0]).text(),
	    calories: $($(foodNode).find('p')[1]).text()
	  };
	};

	var filterFoods = function filterFoods() {
	  var filter = $('#food-filter-input').val().toUpperCase();

	  var foodNameNodes = findNodesForFilter();

	  for (var i = 0; i < foodNameNodes.length; i++) {
	    var name = $(foodNameNodes[i]);
	    if (name.text().toUpperCase().indexOf(filter) > -1) {
	      $(name.parent()[0]).css('display', '');
	    } else {
	      $(name.parent()[0]).css('display', 'none');
	    }
	  }
	};

	var newFoodSequence = function newFoodSequence() {
	  var nameInput = $('#food-name').val();
	  var caloriesInput = $('#food-calories').val();
	  clearAlerts();
	  if (nameInput != '' && caloriesInput != '') {
	    foodsRequests.addNewFood();
	  } else if (nameInput == '' && caloriesInput == '') {
	    validateNameAlert();
	    validateCaloriesAlert();
	  } else if (caloriesInput == '') {
	    validateCaloriesAlert();
	  } else {
	    validateNameAlert();
	  }
	};

	var validateNameAlert = function validateNameAlert() {
	  $('#name-notice').css('display', 'block');
	};

	var validateCaloriesAlert = function validateCaloriesAlert() {
	  $('#calories-notice').css('display', 'block');
	};

	var clearAlerts = function clearAlerts() {
	  $('#name-notice').css('display', 'none');
	  $('#calories-notice').css('display', 'none');
	};

	var clearChecked = function clearChecked() {
	  $('.food-item-checkbox:checkbox:checked').prop('checked', false);
	};

	var findNodesForFilter = function findNodesForFilter() {
	  var fileName = location.pathname.split('/').slice(-1)[0];
	  if (fileName === 'foods.html' || fileName === 'foods') {
	    var foodNameNodes = $('.food-item-name');
	  } else {
	    var foodNameNodes = $('div.foods-diary-container .food-item-name');
	  }
	  return foodNameNodes;
	};

	var calorieSorter = function calorieSorter() {
	  var originalOrder = [];
	  var count = 0;

	  $('strong.calorie-sort').on('click', function (event) {
	    if (originalOrder.length === 0) {
	      var order = $('div.all-foods-list article.food-item-row');
	      order.each(function (index) {
	        originalOrder.push(order[index]);
	      });
	    }
	    count += 1;
	    var calorieNodes = $('div.all-foods-list article.food-item-row');
	    sortBy(calorieNodes, count, originalOrder);
	  });
	};

	var sortBy = function sortBy(calorieNodes, clickCount, originalOrder) {
	  if (clickCount === 1 || clickCount % 3 === 1) {
	    var sorted = calorieNodes.sort(function (a, b) {
	      return findCalorieCount(a) - findCalorieCount(b);
	    });
	    $('div.all-foods-list').append(sorted);
	  } else if (clickCount === 2 || clickCount % 3 === 2) {
	    var sorted = calorieNodes.sort(function (a, b) {
	      return findCalorieCount(b) - findCalorieCount(a);
	    });
	    $('div.all-foods-list').append(sorted);
	  } else {
	    $('div.all-foods-list').append(originalOrder);
	  }
	};

	var findCalorieCount = function findCalorieCount(node) {
	  return $(node).children('.food-item-calories')[0].innerText;
	};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var baseURL = `http://localhost:3000`

	var foodsAPIFetch = function foodsAPIFetch(id, method, body) {
	  return fetch(baseURL + '/api/v1/foods/' + id, {
	    method: '' + method,
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(body)
	  });
	};

	var getFoods = function getFoods() {
	  foodsAPIFetch('', 'GET').then(function (response) {
	    return handleResponse(response);
	  }).then(function (foods) {
	    return getEachFood(foods);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var deleteFood = function deleteFood(id, event, removeFoodRow) {
	  foodsAPIFetch(id, 'DELETE').then(function (response) {
	    return checkSuccessfulDelete(response, event, removeFoodRow);
	  });
	};

	var checkSuccessfulDelete = function checkSuccessfulDelete(response, event, removeFoodRow) {
	  if (response.ok) {
	    removeFoodRow(event);
	  } else {
	    var foodName = event.target.parentNode.parentNode.firstElementChild.textContent;
	    alert('This food is listed on at least one meal. You must remove "' + foodName + '" from all meals before deleting.');
	  }
	};

	var addNewFood = function addNewFood() {
	  var foodName = $('#food-name').val();
	  var foodCalories = $('#food-calories').val();

	  foodsAPIFetch('', 'POST', { food: { name: foodName, calories: foodCalories } }).then(function (response) {
	    return handleResponse(response);
	  }).then(function (newFood) {
	    return renderFood(newFood);
	  }).then(function () {
	    return clearValues();
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var clearValues = function clearValues() {
	  $('#food-name').val('');
	  $('#food-calories').val('');
	};

	var handleResponse = function handleResponse(response) {
	  return response.json().then(function (json) {
	    if (!response.ok) {
	      var error = {
	        status: response.status,
	        statusTest: response.statusText,
	        json: json
	      };
	      return Promise.reject(error);
	    }
	    return json;
	  });
	};

	var getEachFood = function getEachFood(foods) {
	  return foods.forEach(function (food) {
	    renderFood(food);
	  });
	};

	var renderFood = function renderFood(food) {
	  $('#food-table-info').prepend('<article class="food-item-row food-item-' + food.id + '" data="food-' + food.id + '">\n      <p class="food-item-name" contenteditable="true">' + food.name + '</p>\n      <p class="food-item-calories" contenteditable="true">' + food.calories + '</p>\n      <div class="button-container">\n        <button id="food-item-' + food.id + '" class="food-item-delete-btn" aria-label="Delete">-</button>\n      </div>\n    </article>');
	};

	var updateFood = function updateFood(id) {
	  var foodName = $('.food-item-' + id).children()[0].innerText;
	  var foodCalories = $('.food-item-' + id).children()[1].innerText;
	  foodsAPIFetch(id, 'PUT', { food: { name: foodName, calories: foodCalories } }).then(function (response) {
	    return handleResponse(response);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	module.exports = {
	  getFoods: getFoods,
	  deleteFood: deleteFood,
	  addNewFood: addNewFood,
	  updateFood: updateFood,
	  foodsAPIFetch: foodsAPIFetch
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var foodsRequests = __webpack_require__(1);

	var baseURL = `http://localhost:3000`

	var mealsAPIFetch = function mealsAPIFetch(id, method, extension) {
	  return fetch(baseURL + '/api/v1/meals/' + id + extension, {
	    method: method
	  });
	};

	var getDiaryFoods = function getDiaryFoods() {
	  foodsRequests.foodsAPIFetch('', 'GET').then(function (response) {
	    return handleResponse(response);
	  }).then(function (foods) {
	    return getEachDiaryFood(foods);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var getMeals = function getMeals() {
	  mealsAPIFetch('', 'GET', '').then(function (response) {
	    return handleResponse(response);
	  }).then(function (meals) {
	    meals.forEach(function (meal) {
	      return populateMealTable(meal);
	    });
	  }).then(function () {
	    return calculateTotalCalories();
	  }).then(function () {
	    return populateRemainingCalories();
	  }).then(function () {
	    return calculateDiaryTotalCaloriesConsumed();
	  }).then(function () {
	    return calculateDiaryRemainingCalories();
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var updateMealWithFood = function updateMealWithFood(mealName, foodId, method) {
	  var mealInfo = { 'breakfast': '1', 'snack': '2', 'lunch': '3', 'dinner': '4' };
	  var mealId = mealInfo['' + mealName];
	  mealsAPIFetch(mealId, method, '/foods/' + foodId);
	};

	var populateMealTable = function populateMealTable(meal) {
	  meal.foods.forEach(function (food) {
	    return renderFoodToMealTable(meal, food);
	  });
	};

	var renderFoodToMealTable = function renderFoodToMealTable(meal, food) {
	  var mealName = meal.name ? meal.name.toLowerCase() : meal;
	  $('#' + mealName + '-table-info').append('<article class="food-item-row food-item-' + food.id + '" data="food-' + food.id + '">\n      <p class="food-item-name">' + food.name + '</p>\n      <p class="' + mealName + '-food-item-calories">' + food.calories + '</p>\n      <div class="button-container">\n        <button id="food-item-' + food.id + '" class="food-item-delete-btn" data="' + mealName + '-meal" aria-label="Delete">-</button>\n      </div>\n    </article>');
	};

	var handleResponse = function handleResponse(response) {
	  return response.json().then(function (json) {
	    if (!response.ok) {
	      var error = {
	        status: response.status,
	        statusTest: response.statusText,
	        json: json
	      };
	      return Promise.reject(error);
	    }
	    return json;
	  });
	};

	var getEachDiaryFood = function getEachDiaryFood(foods) {
	  return foods.forEach(function (food) {
	    renderDiaryFood(food);
	  });
	};

	var renderDiaryFood = function renderDiaryFood(food) {
	  $('#diary-food-table-info').prepend('<article class="food-item-row food-item-' + food.id + '" data="food-' + food.id + '">\n     <div class="checkbox-container">\n      <input id="food-item-' + food.id + '" type="checkbox" class="food-item-checkbox">\n     </div>\n      <p class="food-item-name">' + food.name + '</p>\n      <p class="food-item-calories">' + food.calories + '</p>\n    </article>');
	};

	var calculateTotalCalories = function calculateTotalCalories() {
	  var meals = ["breakfast", "lunch", "dinner", "snack"];
	  meals.forEach(function (meal) {
	    return mealTotalCalories(meal);
	  });
	};

	var mealTotalCalories = function mealTotalCalories(meal) {
	  var caloriesNodes = $('.' + meal + '-food-item-calories');
	  var totalCalories = 0;
	  caloriesNodes.each(function (index) {
	    totalCalories += parseInt(caloriesNodes[index].innerText);
	  });
	  renderTotalCalories(meal, totalCalories);
	};

	var renderTotalCalories = function renderTotalCalories(meal, totalCalories) {
	  $('#' + meal + '-total-calories-count').append('<p class="calories-total-amount"><strong>' + totalCalories + '</strong></p>');
	};

	var populateRemainingCalories = function populateRemainingCalories() {
	  var mealCalorieLimits = [['breakfast', 400], ['snack', 200], ['lunch', 600], ['dinner', 800]];
	  mealCalorieLimits.forEach(function (meal) {
	    return getTotalCalorieCounts(meal);
	  });
	};

	var getTotalCalorieCounts = function getTotalCalorieCounts(meal) {
	  var totalCalories = parseInt($('#' + meal[0] + '-total-calories-count').children('p').text());
	  calculateRemainingCalories(meal, totalCalories);
	};

	var calculateRemainingCalories = function calculateRemainingCalories(meal, totalCalories) {
	  var remainingCalories = meal[1] - totalCalories;
	  renderRemainingCalories(meal[0], remainingCalories);
	};

	var renderRemainingCalories = function renderRemainingCalories(meal, remainingCalories) {
	  $('#' + meal + '-remaining-calories-count').append('<p class=\'total-remaining-calories\'><strong>' + remainingCalories + '</strong></p>');
	  styleRemainingCalorieCount(meal, remainingCalories);
	};

	var styleRemainingCalorieCount = function styleRemainingCalorieCount(meal, remainingCalories) {
	  if (remainingCalories < 0) {
	    $('#' + meal + '-remaining-calories-count').removeClass().addClass('negative-remainder');
	  } else {
	    $('#' + meal + '-remaining-calories-count').removeClass().addClass('positive-remainder');
	  }
	};

	var calculateDiaryTotalCaloriesConsumed = function calculateDiaryTotalCaloriesConsumed() {
	  var caloriesConsumed = $('.calories-total-amount');
	  var totalConsumed = 0;
	  caloriesConsumed.each(function (index) {
	    totalConsumed += parseInt(caloriesConsumed[index].innerText);
	  });
	  renderTotalCaloriesConsumed(totalConsumed);
	};

	var renderTotalCaloriesConsumed = function renderTotalCaloriesConsumed(total) {
	  $('#diary-calories-consumed-count').append('<p class=\'diary-total-calories-consumed\'><strong>' + total + '</strong></p>');
	};

	var calculateDiaryRemainingCalories = function calculateDiaryRemainingCalories() {
	  var remainingCalories = $('p.total-remaining-calories');
	  var diaryTotalRemaining = 0;
	  remainingCalories.each(function (index) {
	    diaryTotalRemaining += parseInt(remainingCalories[index].innerText);
	  });
	  renderDiaryTotalRemainingCalories(diaryTotalRemaining);
	};

	var renderDiaryTotalRemainingCalories = function renderDiaryTotalRemainingCalories(total) {
	  $('#diary-remaining-calories-count').append('<p class=\'diary-total-remaining-calories\'><strong>' + total + '</strong></p>');
	  styleRemainingCalorieCount("diary", total);
	};

	module.exports = {
	  getDiaryFoods: getDiaryFoods,
	  getMeals: getMeals,
	  updateMealWithFood: updateMealWithFood,
	  renderFoodToMealTable: renderFoodToMealTable,
	  styleRemainingCalorieCount: styleRemainingCalorieCount
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	var deleteFoodListener = function deleteFoodListener(foodsRequests) {
	  $('#food-table-info').on('click', function (event) {
	    if (event.target.nodeName == 'BUTTON') {
	      var id = event.target.id.split('-')[2];
	      foodsRequests.deleteFood(id, event, removeFoodRow);
	    }
	  });
	};

	var removeFoodRow = function removeFoodRow(event) {
	  event.target.closest('article').remove();
	};

	var setOriginalFoodListener = function setOriginalFoodListener(originalFood) {
	  $('#food-table-info').focusin(function (event) {
	    if (event.target.nodeName != 'BUTTON') {
	      return setOriginalFood(originalFood);
	    }
	  });
	};

	var setOriginalFood = function setOriginalFood(originalFood) {
	  var foodId = event.target.parentElement.attributes.data.value.split('-')[1];
	  var originalFoodName = $('.food-item-' + foodId).children()[0].innerText;
	  var originalFoodCalories = $('.food-item-' + foodId).children()[1].innerText;
	  originalFood.name = originalFoodName;
	  originalFood.calories = originalFoodCalories;
	  return originalFood;
	};

	module.exports = {
	  deleteFoodListener: deleteFoodListener,
	  removeFoodRow: removeFoodRow,
	  setOriginalFoodListener: setOriginalFoodListener
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./foods.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./foods.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, ".food-headers, .food-item-row {\n  width: 300px;\n  display: flex;\n  justify-content: space-between; }\n\n.food-headers, .food-item-row {\n  height: 25px;\n  margin: 0px;\n  display: flex;\n  align-items: center; }\n\n.food-headers .name-header, .food-headers .calorie-header {\n  border: 1px solid black;\n  background-color: lightgrey;\n  padding-left: 5px; }\n\n.food-headers .name-header {\n  width: 200px; }\n\n.food-headers .calorie-header {\n  width: 60px;\n  padding-right: 5px;\n  border-left: 0px; }\n\n.food-headers .hidden {\n  width: 50px; }\n\n.food-item-row .food-item-name {\n  width: 200px; }\n\n.food-item-row .food-item-calories {\n  width: 50px; }\n\n.food-item-row .button-container {\n  width: 25px; }\n  .food-item-row .button-container .food-item-delete-btn {\n    color: white;\n    height: 20px;\n    width: 20px;\n    border: 1px solid tomato;\n    border-radius: 30px;\n    background-color: tomato;\n    text-align: center; }\n\n#name-notice {\n  display: none;\n  color: tomato; }\n\n#calories-notice {\n  display: none;\n  color: tomato; }\n\n#food-filter-input {\n  width: 243px;\n  display: flex;\n  flex-direction: column; }\n\n.food-name-container input {\n  width: 243px;\n  display: flex;\n  flex-direction: column; }\n\n.food-calories-container input {\n  width: 243px;\n  display: flex;\n  flex-direction: column; }\n\nbody {\n  display: flex;\n  justify-content: center; }\n", ""]);

	// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./diary.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./diary.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Montserrat);", ""]);

	// module
	exports.push([module.id, "body {\n  font-family: 'Montserrat', sans-serif; }\n\nh3, h4 {\n  margin-top: 10px;\n  margin-bottom: 10px;\n  font-weight: 100; }\n\ninput {\n  padding-left: 10px; }\n\n.breakfast-table {\n  width: 300px; }\n\n.meals-container {\n  display: flex; }\n  .meals-container .meal-table {\n    padding: 20px; }\n\n.total-calories, .remaining-calories .remaining-calories-header, .remaining-calories .total-remaining-calories, .remaining-calories .diary-total-remaining-calories {\n  border: 1px solid black;\n  background-color: lightgrey;\n  padding-left: 5px; }\n\n.remaining-calories {\n  height: 25px;\n  margin: 0px;\n  display: flex;\n  align-items: center; }\n\n.remaining-calories .remaining-calories-header, .remaining-calories .total-remaining-calories, .remaining-calories .diary-total-remaining-calories, .calories-goal, .diary-total-calories-consumed {\n  display: flex;\n  justify-content: flex-end;\n  padding-right: 5px; }\n\n.total-calories {\n  display: flex;\n  height: 25px;\n  align-items: center;\n  justify-content: space-between;\n  width: 248px; }\n\n.calories-total-amount {\n  padding-right: 5px; }\n\n.positive-remainder {\n  color: #009600; }\n\n.negative-remainder {\n  color: tomato; }\n\n.remaining-calories .remaining-calories-header, .remaining-calories .total-remaining-calories, .remaining-calories .diary-total-remaining-calories {\n  height: 11px;\n  padding-top: 4px;\n  padding-bottom: 9px; }\n\n.remaining-calories {\n  width: 255px; }\n  .remaining-calories .remaining-calories-header {\n    width: 100%;\n    border-top: 0; }\n  .remaining-calories .total-remaining-calories, .remaining-calories .diary-total-remaining-calories {\n    width: 50px;\n    border-left: 0;\n    border-top: 0; }\n\n.calories-consumed {\n  border-top: none; }\n\n.default-button {\n  background-color: #56ccf2;\n  height: 30px;\n  width: 110px;\n  border: 1px solid black;\n  border-radius: 30px;\n  font-weight: bold;\n  margin-top: 5px;\n  margin-bottom: 5px; }\n\n.food-diary-controls {\n  width: 254px;\n  padding-left: 20px; }\n  .food-diary-controls .meal-add-buttons {\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    margin-top: 10px;\n    margin-bottom: 10px; }\n  .food-diary-controls .button-row-1, .food-diary-controls .button-row-2 {\n    width: 100%;\n    display: flex;\n    justify-content: space-between; }\n\n.diary-total-calories-container {\n  padding-left: 20px; }\n\n#food-name-filter input, .food-name-container input, .food-calories-container input {\n  height: 20px;\n  border-radius: 20px;\n  border: 1px solid black;\n  margin-top: 5px;\n  margin-bottom: 5px; }\n", ""]);

	// exports


/***/ })
/******/ ]);
