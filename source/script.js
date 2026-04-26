/* global fieldProperties, setAnswer, getPluginParameter, clearAnswer, setMetaData, getMetaData */

var DARK_GREY = '#555555'
var LIGHT_GREY = '#e7e7e7'
var GREEN = '#4caf50'
var BLUE = '#008cba'
var RED = '#fe0000'

var button1 = document.getElementById('button1')
var button2 = document.getElementById('button2')
var bypass = document.getElementById('byPassButton')

var topTextElement = document.getElementById('topText')
var leftTextElement = document.getElementById('leftText')
var rightTextElement = document.getElementById('rightText')
var leftImageElement = document.getElementById('leftImage')
var rightImageElement = document.getElementById('rightImage')

var loadByPass = getPluginParameter('bypass')
var loadedDataFormat = getPluginParameter('data_format')
var loadLabels = getPluginParameter('labels')

var leftImage = getPluginParameter('left_image') || ''
var rightImage = getPluginParameter('right_image') || ''
var topText = getPluginParameter('top_text') || ''
var leftText = getPluginParameter('left_text') || ''
var rightText = getPluginParameter('right_text') || ''

var dataFormat = loadedDataFormat === 'string' ? 0 : 1

var loadedLabels
if (loadLabels === undefined || loadLabels === null || loadLabels === '') {
  loadedLabels = ['Option 1', 'Option 2']
} else {
  loadedLabels = loadLabels.split(',')
  if (loadedLabels.length < 2) {
    loadedLabels = ['Option 1', 'Option 2']
  }
}

button1.innerHTML = loadedLabels[0]
button2.innerHTML = loadedLabels[1]

if (loadByPass == undefined || loadByPass === '') {
  bypass.style.display = 'none'
} else {
  bypass.style.display = 'block'
  bypass.innerText = loadByPass
}

renderLayout()
restoreAnswerIfAvailable()

function renderLayout() {
  topTextElement.textContent = topText
  leftTextElement.textContent = leftText
  rightTextElement.textContent = rightText

  applyImageWithFallback(leftImageElement, leftImage)
  applyImageWithFallback(rightImageElement, rightImage)
}


function getImageCandidates(rawValue) {
  var value = (rawValue || '').trim()
  if (value === '') {
    return []
  }

  // Accept already-resolved paths/URLs as-is.
  if (value.indexOf('jr://') === 0 || value.indexOf('http://') === 0 || value.indexOf('https://') === 0 || value.indexOf('data:') === 0 || value.indexOf('file://') === 0 || value.indexOf('/') === 0) {
    return [value]
  }

  // For SurveyCTO attached media, filename-only values are common.
  // Try direct filename first, then ODK-style jr://images fallback.
  return [value, 'jr://images/' + value]
}

function applyImageWithFallback(imageElement, rawValue) {
  var candidates = getImageCandidates(rawValue)
  if (candidates.length === 0) {
    imageElement.style.display = 'none'
    imageElement.removeAttribute('src')
    return
  }

  imageElement.style.display = 'block'
  var index = 0

  imageElement.onerror = function () {
    index = index + 1
    if (index < candidates.length) {
      imageElement.src = candidates[index]
    }
  }

  imageElement.src = candidates[index]
}

function restoreAnswerIfAvailable() {
  var currentAnswer = fieldProperties.CURRENT_ANSWER
  if (currentAnswer === null || currentAnswer === undefined || currentAnswer === '') {
    return
  }

  var selectedValue = currentAnswer
  if (dataFormat === 0) {
    selectedValue = currentAnswer
  }

  disableButtons()

  if (selectedValue === '1' || selectedValue === 1 || selectedValue === loadedLabels[0]) {
    button1.style.backgroundColor = DARK_GREY
    button1.style.color = LIGHT_GREY
  } else if (selectedValue === '2' || selectedValue === 2 || selectedValue === loadedLabels[1]) {
    button2.style.backgroundColor = DARK_GREY
    button2.style.color = LIGHT_GREY
  } else if (loadByPass !== undefined && selectedValue === loadByPass) {
    bypass.style.backgroundColor = DARK_GREY
    bypass.style.color = LIGHT_GREY
  }
}

function setSelection(selectedCode, selectedLabel) {
  var result = dataFormat === 0 ? selectedLabel : selectedCode
  var meta = [leftImage, rightImage, topText, leftText, rightText].join('|')

  setMetaData(meta)
  setAnswer(result)

  button1.style.backgroundColor = BLUE
  button2.style.backgroundColor = BLUE
  bypass.style.backgroundColor = RED

  if (selectedCode === 1) {
    button1.style.backgroundColor = GREEN
  } else if (selectedCode === 2) {
    button2.style.backgroundColor = GREEN
  } else {
    bypass.style.backgroundColor = GREEN
  }
}

function addResult1() {
  setSelection(1, loadedLabels[0])
}

function addResult2() {
  setSelection(2, loadedLabels[1])
}

function pass() {
  setSelection(0, loadByPass)
}

function disableButtons() {
  button1.disabled = true
  button2.disabled = true
  bypass.disabled = true

  button1.style.backgroundColor = LIGHT_GREY
  button2.style.backgroundColor = LIGHT_GREY
  bypass.style.backgroundColor = LIGHT_GREY
  button1.style.color = DARK_GREY
  button2.style.color = DARK_GREY
  bypass.style.color = DARK_GREY
}
