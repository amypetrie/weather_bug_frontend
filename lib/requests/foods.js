const baseURL = require('./qsAPI').baseURL()

const foodsAPIFetch = (id, method, body) => {
  return fetch(`${baseURL}/api/v1/foods/${id}`, {
    method: `${method}`,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
}

const getFoods = () => {
  foodsAPIFetch('', 'GET')
  .then(response => handleResponse(response))
  .then(foods => getEachFood(foods))
  .catch(error => console.error({ error }))
}

const deleteFood = (id, event, removeFoodRow) => {
  foodsAPIFetch(id, 'DELETE')
  .then(response => checkSuccessfulDelete(response, event, removeFoodRow) )
}

const checkSuccessfulDelete = (response, event, removeFoodRow) => {
  if (response.ok) {
    removeFoodRow(event)
  } else {
    var foodName = event.target.parentNode.parentNode.firstElementChild.textContent
    alert(`This food is listed on at least one meal. You must remove "${foodName}" from all meals before deleting.`)
  }
}

const addNewFood = () => {
  var foodName = $('#food-name').val()
  var foodCalories = $('#food-calories').val()

  foodsAPIFetch('', 'POST', { food: { name: foodName, calories: foodCalories } })
  .then(response => handleResponse(response))
  .then(newFood => renderFood(newFood))
  .then(() => clearValues())
  .catch(error => console.error({ error }))
}

const clearValues = () => {
  $('#food-name').val('')
  $('#food-calories').val('')
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

const getEachFood = (foods) => {
  return foods.forEach(food => {
    renderFood(food)
  })
}

const renderFood = (food) => {
  $('#food-table-info').prepend(
   `<article class="food-item-row food-item-${food.id}" data="food-${food.id}">
      <p class="food-item-name" contenteditable="true">${food.name}</p>
      <p class="food-item-calories" contenteditable="true">${food.calories}</p>
      <div class="button-container">
        <button id="food-item-${food.id}" class="food-item-delete-btn" aria-label="Delete">-</button>
      </div>
    </article>`
  )
}

const updateFood = (id) => {
  var foodName = $(`.food-item-${id}`).children()[0].innerText
  var foodCalories = $(`.food-item-${id}`).children()[1].innerText
  foodsAPIFetch(id, 'PUT', { food: { name: foodName, calories: foodCalories } })
  .then(response => handleResponse(response))
  .catch(error => console.error({ error }))
}


module.exports = {
  getFoods,
  deleteFood,
  addNewFood,
  updateFood,
  foodsAPIFetch
}
