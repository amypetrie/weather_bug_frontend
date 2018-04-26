const deleteFoodListener = (foodsRequests) => {
  $('#food-table-info').on('click', event => {
    if (event.target.nodeName == 'BUTTON') {
      var id = event.target.id.split('-')[2]
      foodsRequests.deleteFood(id, event, removeFoodRow)
    }
  })
}

const removeFoodRow = (event) => {
  event.target.closest('article').remove()
}

const setOriginalFoodListener = (originalFood) => {
  $('#food-table-info').focusin(event => {
    if (event.target.nodeName != 'BUTTON') {
      return setOriginalFood(originalFood)
    }
  })
}

const setOriginalFood = (originalFood) => {
  var foodId = event.target.parentElement.attributes.data.value.split('-')[1]
  var originalFoodName = $(`.food-item-${foodId}`).children()[0].innerText
  var originalFoodCalories = $(`.food-item-${foodId}`).children()[1].innerText
  originalFood.name = originalFoodName
  originalFood.calories = originalFoodCalories
  return originalFood
}

module.exports = {
  deleteFoodListener,
  removeFoodRow,
  setOriginalFoodListener,
}
