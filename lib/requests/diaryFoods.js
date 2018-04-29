var foodsRequests = require('./foods')

const baseURL = require('./qsAPI').baseURL()

const mealsAPIFetch = (id, method, extension) => {
  return fetch(`${baseURL}/api/v1/meals/${id}${extension}`, {
    method: method
  })
}


const getDiaryFoods = () => {
  foodsRequests.foodsAPIFetch('', 'GET')
    .then(response => handleResponse(response))
    .then(foods => getEachDiaryFood(foods))
    .catch(error => console.error({ error }))
}

const getMeals = () => {
  mealsAPIFetch('', 'GET', '')
    .then(response => handleResponse(response))
    .then(meals => {
      meals.forEach(meal => populateMealTable(meal))
    })
    .then(() => calculateTotalCalories())
    .then(() => populateRemainingCalories())
    .then(() => calculateDiaryTotalCaloriesConsumed())
    .then(() => calculateDiaryRemainingCalories())
    .catch(error => console.error({ error })
)}

const updateMealWithFood = (mealName, foodId, method) => {
  const mealInfo = { 'breakfast': '1', 'snack': '2', 'lunch': '3', 'dinner': '4' }
  let mealId = mealInfo[`${mealName}`]
  mealsAPIFetch(mealId, method, `/foods/${foodId}`)
}

const populateMealTable = (meal) => {
  meal.foods.forEach(food => renderFoodToMealTable(meal, food))
}

const renderFoodToMealTable = (meal, food) => {
  var mealName = meal.name ? meal.name.toLowerCase() : meal
  $(`#${mealName}-table-info`).append(
    `<article class="food-item-row food-item-${food.id}" data="food-${food.id}">
      <p class="food-item-name">${food.name}</p>
      <p class="${mealName}-food-item-calories">${food.calories}</p>
      <div class="button-container">
        <button id="food-item-${food.id}" class="food-item-delete-btn" data="${mealName}-meal" aria-label="Delete">-</button>
      </div>
    </article>`
  )
}

const handleResponse = (response) => {
  return response.json()
    .then(json => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusTest: response.statusText,
          json
        }
        return Promise.reject(error)
      }
      return json
    })
}

const getEachDiaryFood = (foods) => {
  return foods.forEach(food => {
    renderDiaryFood(food)
  })
}

const renderDiaryFood = (food) => {
  $('#diary-food-table-info').prepend(
   `<article class="food-item-row food-item-${food.id}" data="food-${food.id}">
     <div class="checkbox-container">
      <input id="food-item-${food.id}" type="checkbox" class="food-item-checkbox">
     </div>
      <p class="food-item-name">${food.name}</p>
      <p class="food-item-calories">${food.calories}</p>
    </article>`
  )
}

const calculateTotalCalories = () => {
  let meals = ["breakfast", "lunch", "dinner", "snack"]
  meals.forEach(meal => mealTotalCalories(meal))
}

const mealTotalCalories = (meal) => {
  var caloriesNodes = $(`.${meal}-food-item-calories`)
  var totalCalories = 0
  caloriesNodes.each(index => {
    totalCalories += parseInt(caloriesNodes[index].innerText)
  })
  renderTotalCalories(meal, totalCalories)
}

const renderTotalCalories = (meal, totalCalories) => {
  $(`#${meal}-total-calories-count`).append(
    `<p class="calories-total-amount"><strong>${totalCalories}</strong></p>`
  )
}

const populateRemainingCalories = () => {
  var mealCalorieLimits = [['breakfast', 400], ['snack', 200], ['lunch', 600], ['dinner', 800]]
  mealCalorieLimits.forEach( meal => getTotalCalorieCounts(meal))
}

const getTotalCalorieCounts = (meal) => {
  var totalCalories = parseInt($(`#${meal[0]}-total-calories-count`).children('p').text())
  calculateRemainingCalories(meal, totalCalories)
}

const calculateRemainingCalories = (meal, totalCalories) => {
  var remainingCalories = meal[1] - totalCalories
  renderRemainingCalories(meal[0], remainingCalories)
}

const renderRemainingCalories = (meal, remainingCalories) => {
  $(`#${meal}-remaining-calories-count`).append(
    `<p class='total-remaining-calories'><strong>${remainingCalories}</strong></p>`
  )
  styleRemainingCalorieCount(meal, remainingCalories)
}

const styleRemainingCalorieCount = (meal, remainingCalories) => {
  if (remainingCalories < 0) {
    $(`#${meal}-remaining-calories-count`).removeClass().addClass('negative-remainder')
  } else {
    $(`#${meal}-remaining-calories-count`).removeClass().addClass('positive-remainder')
  }
}

const calculateDiaryTotalCaloriesConsumed = () => {
  let caloriesConsumed = $('.calories-total-amount')
  let totalConsumed = 0
  caloriesConsumed.each(index => {
    totalConsumed += parseInt(caloriesConsumed[index].innerText)
  })
  renderTotalCaloriesConsumed(totalConsumed)
}

const renderTotalCaloriesConsumed = (total) => {
  $('#diary-calories-consumed-count').append(
    `<p class='diary-total-calories-consumed'><strong>${total}</strong></p>`
  )
}

const calculateDiaryRemainingCalories = () => {
  let remainingCalories = $('p.total-remaining-calories')
  let diaryTotalRemaining = 0
  remainingCalories.each(index => {
    diaryTotalRemaining += parseInt(remainingCalories[index].innerText)
  })
  renderDiaryTotalRemainingCalories(diaryTotalRemaining)
}

const renderDiaryTotalRemainingCalories = (total) => {
  $('#diary-remaining-calories-count').append(
    `<p class='diary-total-remaining-calories'><strong>${total}</strong></p>`
  )
  styleRemainingCalorieCount("diary", total)
}

module.exports = {
  getDiaryFoods,
  getMeals,
  updateMealWithFood,
  renderFoodToMealTable,
  styleRemainingCalorieCount,
}
