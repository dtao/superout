function pollForUpdates() {
  var request = new XMLHttpRequest();
  request.open('GET', '/updates');

  request.addEventListener('load', function() {
    var updates = JSON.parse(request.responseText);
    addUpdatesToDOM(updates);
  });

  request.send();
}

function addUpdatesToDOM(updates) {
  updates.forEach(addUpdateToDOM);
}

function addUpdateToDOM(update) {
  var row = document.createElement('TR');
  
  var idCell = document.createElement('TD');
  idCell.className = 'id';
  idCell.textContent = update.id;

  var messageCell = document.createElement('TD');
  messageCell.className = 'message';
  messageCell.textContent = update.message;

  var timestampCell = document.createElement('TD');
  timestampCell.className = 'timestamp';
  timestampCell.textContent = new Date(update.timestamp).toLocaleString();

  row.appendChild(idCell);
  row.appendChild(messageCell);
  row.appendChild(timestampCell);
  document.getElementById('table').appendChild(row);
}

setInterval(pollForUpdates, 1000);

function forEach(collection, callback) {
  Array.prototype.forEach.call(collection, callback);
}

function escapeRegex(pattern) {
  return pattern.replace(/([\\\/\^\$\[\]\(\)\{\}\-])/g, '\\$1');
}

function createMatcher(query) {
  return new RegExp(escapeRegex(query), 'i');
}

function rowMatches(row, matcher) {
  var message = row.querySelector('td.message');
  return matcher.test(message.textContent);
}

function displayRow(row) {
  row.style.display = null;
}

function hideRow(row) {
  row.style.display = 'none';
}

function debounce(fn, delay) {
  var timeout;
  
  return function() {
    if (timeout) { clearTimeout(timeout); }
    timeout = setTimeout(fn, delay);
  };
}

function filterRows() {
  var query   = filterInput.value,
      matcher = createMatcher(query),
      rows    = document.querySelectorAll('#table tr');

  if (!query) {
    forEach(rows, displayRow);
    return;
  }

  forEach(rows, function(row) {
    if (rowMatches(row, matcher)) {
      displayRow(row);
    } else {
      hideRow(row);
    }
  });
}

filterRows = debounce(filterRows);

function hasClass(element, className) {
  var matcher = new RegExp('\\b' + escapeRegex(className) + '\\b');
  return matcher.test(element.className);
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

function toggleClass(element, className) {
  if (!hasClass(element, className)) {
    addClass(element, className);
  } else {
    removeClass(element, className);
  }
}

var filterInput = document.querySelector('input[name="filter"]');
filterInput.addEventListener('keyup', filterRows);
filterInput.addEventListener('change', filterRows);

var table = document.getElementById('table');
table.addEventListener('click', function(e) {
  var target = e.target;

  if (target.nodeName === 'TD' && /message/.test(target.className)) {
    toggleClass(target.parentNode, 'expanded');
  }
});
