/**
 * ------------------------------------------
 * Simple Bookmarker using Module Pattern 
 * ------------------------------------------
 */

// Storage Controller


// Item Controller
const ItemCtrl = (function() {
	// Item Constructor
	const Item = function(site, url) {
		this.site = site;
		this.url = url;
	}

	// Data structure
	const data = {
		items: [
			// {site: 'Facebook', url: 'http://www.facebook.com'},
			// {site: 'Twitter', url: 'http://www.twitter.com'}
		]
	}

	// Public Methods
	return {
		getItems: function() {
			return data.items;
		},
		addItem: function(site, url) {
			let newItem = new Item(site, url);
			
			// Add to items array
			data.items.push(newItem);

			return newItem;
		},
		deleteItem: function(url) {
			// Store all urls from data structure into array
			const urls = data.items.map(item => item.url);

			// Get index
			const index = urls.indexOf(url);
			// Remove item
			data.items.splice(index, 1);
		}
	}
})();

// UI Controller
const UICtrl = (function() {
	const UISelectors = {
		bookmarkForm: '#myForm',
		siteInput: '#siteName',
		urlInput: '#siteUrl',
		addBtn: '.add-item-btn',
		bookmarkResultsUL: '.url-results-list'
	}

	// Public Methods
	return {
		getItemInput: function() {
			return {
				site: document.querySelector(UISelectors.siteInput).value,
				url: document.querySelector(UISelectors.urlInput).value
			}
		},
		getSelectors: function() {
			return UISelectors;
		},
		addListItem: function(item) {
			// const li = document.createElement('li');
			// li.className = 'list-group-item';
			const bookmarkResultsUL = document.querySelector(UISelectors.bookmarkResultsUL);
			bookmarkResultsUL.innerHTML += `
			<li class="list-group-item">
				<h4 class="">${item.site} 
					<a href="${item.url}" class="btn btn-default" target="_blank">Visit</a>
					<a href="#" class="btn btn-danger delete-btn">Delete</a>
				</h4>
			</li>
			`;	
		},
		deleteListItem: function(target) {
			if(target.classList.contains('delete-btn')) {
				target.parentElement.parentElement.remove();
			}
		}
	}
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
	// Load event listeners
	const loadEventListeners = function() {
		// Get UI Selectors
		const UISelectors = UICtrl.getSelectors();

		// Add item event
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

		// Add delete event
		document.querySelector(UISelectors.bookmarkResultsUL).addEventListener('click', itemDeleteSubmit);
		
	}

	// Add item submit
	const itemAddSubmit = function(e) {
		e.preventDefault();
		// Get form input from UI Controller
		let input = UICtrl.getItemInput();

		// Pass url variable to check if is proper url format
		let checkedUrl = validateFormInput(input.site, input.url);

		if(!checkedUrl) {
			return false;
		} else {
			input = checkedUrl;
		}

		// Add item data structure
		const newItem = new ItemCtrl.addItem(input.site, input.url);

		// Add item to UI
		UICtrl.addListItem(newItem);
	}

	// Delete item submit
	const itemDeleteSubmit = function(e) {
		// Find url by way of previous sibling of delete button
		const itemUrl = e.target.previousElementSibling.getAttribute('href');

		// Delete from data structure
		ItemCtrl.deleteItem(itemUrl);

		// +++++++ need to add unique Ids to items. Problem is that if we have repeated urls throughout the data structure, the indexOf will delete the first one that it finds (so not necessarily the correct one)
		// +++++++
		
		// Delete list from UI
		UICtrl.deleteListItem(e.target);
		
		
	}

	// Validate form data
	const validateFormInput = function(site, url) {
		// check if fields are empty
		if(!site || !url) {
			alert('Please fill in the form');
			return false;
		} 

		// check url format
		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);

		if (!url.match(regex)) {
			alert('Please use a valid URL');
			return false;
		}

		// Check if url has http:// protocol. If not, prepend it
		if (url.search(/^http[s]?\:\/\//) == -1) {
			url = 'http://' + url;
		}

		return {site, url}
	}

	// Public Methods
	return {
		init: function() {
			console.log("I'm Running!");

			// Load Event Listeners
			loadEventListeners();
		}
	}
})(ItemCtrl, UICtrl);

App.init();