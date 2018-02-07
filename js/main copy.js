const urlResultsList = document.querySelector('.url-results-list');

window.addEventListener('load', fetchBookmarks);
// Listen for form submit
document.getElementById('myForm').addEventListener('submit', saveBookmark);

// Listen for Delete Bookmark btn
urlResultsList.addEventListener('click', deleteBookmark);


// Save Bookmark
function saveBookmark(e) {
	// Get form values
	var siteName = document.getElementById('siteName').value;
	var siteUrl = document.getElementById('siteUrl').value;


	// if(!validateForm(siteName, siteUrl)){
	//   return false;
	// }
	siteUrl = validateForm(siteName, siteUrl);

	var bookmark = {
		name: siteName,
		url: siteUrl
	}

	/*
	  // Local Storage Test
	  localStorage.setItem('test', 'Hello World');
	  console.log(localStorage.getItem('test'));
	  localStorage.removeItem('test');
	  console.log(localStorage.getItem('test'));
	*/

	// Test if bookmarks is null
	if (localStorage.getItem('bookmarks') === null) {
		// Init array
		var bookmarks = [];
		// Add to array
		bookmarks.push(bookmark);
		// Set to localStorage
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	} else {
		// Get bookmarks from localStorage
		var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
		// Add bookmark to array
		bookmarks.push(bookmark);
		// Re-set back to localStorage
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	}

	// Clear form
	document.getElementById('myForm').reset();

	// Re-fetch bookmarks
	fetchBookmarks();

	// Prevent form from submitting
	e.preventDefault();
}

// Delete bookmark
function deleteBookmark(e) {
	// Find url by way of previous sibling of delete button
	const itemUrl = e.target.previousElementSibling.getAttribute('href');

	// Get bookmarks from localStorage
	var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	// Loop through bookmarks
	for (var i = 0; i < bookmarks.length; i++) {
		if (bookmarks[i].url == itemUrl) {
			// Remove from array
			bookmarks.splice(i, 1);
		}
	}
	// Re-set back to localStorage
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

	// Re-fetch bookmarks
	fetchBookmarks();
}

// Fetch bookmarks
function fetchBookmarks() {
	// Get bookmarks from localStorage
	var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	// Get output id
	// var bookmarksResults = document.getElementById('bookmarksResults');
	

	// Build output
	// bookmarksResults.innerHTML = '';
	urlResultsList.innerHTML = '';
	for (var i = 0; i < bookmarks.length; i++) {
		var name = bookmarks[i].name;
		var url = bookmarks[i].url;

		urlResultsList.innerHTML += `
		<li class="list-group-item">
			<h4 class="d-flex">${name} 
				<a href="${url}" class="btn btn-default" target="_blank">Visit</a>
				<a href="#" class="btn btn-danger ml-auto">Delete</a>
			</h4>
		</li>
	`;
	

		// bookmarksResults.innerHTML += '<div class="card">' +
		// 	'<h3>' + name +
		// 	' <a class="btn btn-default" target="_blank" href="' + url + '">Visit</a> ' +
		// 	' <a onclick="deleteBookmark(\'' + url + '\')" class="btn btn-danger" href="#">Delete</a> ' +
		// 	'</h3>' +
		// 	'</div>';
	}
}

// Validate Form
function validateForm(siteName, siteUrl) {
	if (!siteName || !siteUrl) {
		alert('Please fill in the form');
		return false;
	}

	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var regex = new RegExp(expression);

	if (!siteUrl.match(regex)) {
		alert('Please use a valid URL');
		return false;
	}

	console.log(siteUrl);

	if (siteUrl.search(/^http[s]?\:\/\//) == -1) {
		siteUrl = 'http://' + siteUrl;
	}

	console.log(siteUrl);

	return siteUrl;
}