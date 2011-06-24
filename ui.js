function openMenu() {
	getCategoryList();
	document.getElementById('menu').style.display = '';
	document.getElementById('menu_bar').style.display = 'none';
}
function clearSelect(element) {
	//document.getElementById(element).options.length = 0;//IE doesn't like it
	document.getElementById(element).innerHTML = '';
	var new_optgroup = document.createElement('optgroup');
	new_optgroup.label = 'Pick One Or Many';
	document.getElementById(element).appendChild(new_optgroup);
}
function hashHandler() {
	var layer = location.hash.substring(1);
	switch (layer) {
	case 'active':
		list_filter = 'active';
		getTaskList();
		openLayer('task_list');
		break;
	case 'over-deadline':
		list_filter = 'over-deadline';
		getTaskList();
		openLayer('task_list');
		break;
	case 'deleted':
		list_filter = 'deleted';
		getTaskList();
		openLayer('task_list');
		break;
	case 'sort-title':
		list_sort = 'title';
		getTaskList();
		openLayer('task_list');
		break;
	case 'sort-deadline':
		list_sort = 'deadline';
		getTaskList();
		openLayer('task_list');
		break;
	case 'sort-priority':
		list_sort = 'priority';
		getTaskList();
		openLayer('task_list');
		break;
	case 'sort-added':
		list_sort = 'added';
		getTaskList();
		openLayer('task_list');
		break;
	case 'sort-order-asc':
		list_sort_order = 'asc';
		getTaskList();
		openLayer('task_list');
		break;
	case 'sort-order-desc':
		list_sort_order = 'desc';
		getTaskList();
		openLayer('task_list');
		break;
	case 'task_list':
		getTaskList();
		openLayer('task_list');
		break;
	case 'task':
		document.getElementById('task_id').value = '';
		document.getElementById('task_title').value = '';
		document.getElementById('task_description').value = '';
		document.getElementById('task_deadline').value = '';
		document.getElementById('priority_normal').checked = true;
		document.getElementById('task_status_0').checked = true;
		getCategoryList();
		openLayer('task');
		break;
	case 'category':
		document.getElementById('category_id').value = '';
		document.getElementById('category_name').value = '';
		document.getElementById('category_status_0').checked = true;
		openLayer('category');
		break;
	case 'category_list':
		getCategoryList();
		openLayer('category_list');
		break;
	default:
		if (layer.substring(0, 5) == 'task=') {
			var layer_parts = layer.split('=');
			loadTask(layer_parts[1]);
		}
		else if (layer.substring(0, 9) == 'category=') {
			var layer_parts = layer.split('=');
			loadCategory(layer_parts[1]);
		}
		else {
			window.location.replace('#task_list');
		}
		break;
	}
}
function openLayer(layer) {
	document.getElementById('task').style.display = 'none';
	document.getElementById('category').style.display = 'none';
	document.getElementById('task_list').style.display = 'none';
	document.getElementById('category_list').style.display = 'none';
	document.getElementById(layer).style.display = '';
}
function jsonParse(data) {
	return (new Function('return ' + data))();
}
function filterCatergories() {
	list_categories = '';
	var select = document.getElementById('filter_categories');
	for (i=0; i<select.options.length; i++) {
		if (select.options[i].selected) {
			list_categories += '&category[]='+ select.options[i].value;
		}
	}
	getTaskList();
}
function postTask() {
	document.getElementById('save_task').disabled = true;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				//console.log(jsonParse(xmlhttp.responseText));
				getTaskList();
				location.hash = 'task_list';
				document.getElementById('save_task').disabled = false;
			}
		}
	}
	var selected = '';
	var select = document.getElementById('task_categories');
	for (i=0; i<select.options.length; i++) {
		if (select.options[i].selected) {
			selected += '&category[]='+ select.options[i].value;
		}
	}
	var status = 0;
	if (document.getElementById('task_status_1').checked) {
		status = 1;
	}
	var priority = 'normal';
	if (document.getElementById('priority_high').checked) {
		priority = 'high';
	}
	else if (document.getElementById('priority_low').checked) {
		priority = 'low';
	}
	var params = 'task_id='+ document.getElementById('task_id').value + '&task_title='+ document.getElementById('task_title').value +'&task_description='+ document.getElementById('task_description').value +'&task_deadline='+ document.getElementById('task_deadline').value +'&task_status='+ status +'&task_priority='+ priority + selected;
	xmlhttp.open('POST', base_url +'api.php?action=task', true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
	xmlhttp.send(params);
}
function postCategory() {
	document.getElementById('save_category').disabled = true;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				//console.log(jsonParse(xmlhttp.responseText));
				getCategoryList();
				location.hash = 'task_list';
				document.getElementById('save_category').disabled = false;
			}
		}
	}
	var status = 0;
	if (document.getElementById('category_status_1').checked) {
		status = 1;
	}
	var params = 'category_id='+ document.getElementById('category_id').value + '&category_name='+ document.getElementById('category_name').value + '&category_status='+ status;
	xmlhttp.open('POST', base_url +'api.php?action=category', true);
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
	xmlhttp.send(params);
}
function loadCategory(id) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				//console.log(jsonParse(xmlhttp.responseText));
				var data = jsonParse(xmlhttp.responseText).result;
				document.getElementById('category_id').value = data.category_id;
				document.getElementById('category_name').value = data.category_name;
				document.getElementById('category_status_'+data.category_status).checked = true;
				openLayer('category');
			}
		}
	}
	var url = base_url +'api.php?action=category&id='+ id;
	xmlhttp.open('GET', url, true);
	xmlhttp.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
	xmlhttp.setRequestHeader('Cache-Control', 'no-cache, must-revalidate');
	xmlhttp.send();
}
function loadTask(id) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				//console.log(jsonParse(xmlhttp.responseText));
				var data = jsonParse(xmlhttp.responseText).result;
				document.getElementById('task_id').value = data.task.task_id;
				document.getElementById('task_title').value = data.task.task_title;
				document.getElementById('task_description').value = data.task.task_description;
				document.getElementById('task_deadline').value = data.task.task_deadline;
				document.getElementById('priority_'+data.task.task_priority).checked = true;
				document.getElementById('task_status_'+data.task.task_status).checked = true;
				clearSelect('task_categories');
				var selected = [];
				for (category in data.task.task_categories) {
					selected[data.task.task_categories[category].category_id] = true;
				}
				for(category in data.categories) {
					var new_option = document.createElement('option');
					new_option.text = data.categories[category].category_name;
					new_option.value = data.categories[category].category_id;
					if (selected[data.categories[category].category_id]) {
						new_option.selected = true;
					}
					try {
						document.getElementById('task_categories').add(new_option, null);
					}
					catch(ex) {
						document.getElementById('task_categories').add(new_option);
					}
				}
				openLayer('task');
			}
		}
	}
	var url = base_url +'api.php?action=task&id='+ id;
	xmlhttp.open('GET', url, true);
	xmlhttp.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
	xmlhttp.setRequestHeader('Cache-Control', 'no-cache, must-revalidate');
	xmlhttp.send();
}
function getTaskList() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				//console.log(jsonParse(xmlhttp.responseText));
				tasks = jsonParse(xmlhttp.responseText).result;
				document.getElementById('task_list_items').innerHTML = '';
				for(task in tasks) {
					var new_task = document.createElement('div');
					new_task.className = 'list_item '+ tasks[task].task_priority;
					new_task.id = '#task='+ tasks[task].task_id;
					new_task.onclick = function(){window.location = this.id};
					var new_title = document.createElement('div');
					new_title.className = 'list_title';
					new_title.innerHTML = tasks[task].task_title;
					new_task.appendChild(new_title);
					var new_deadline = document.createElement('div');
					new_deadline.className = 'list_deadline';
					new_deadline.innerHTML = tasks[task].task_deadline;
					new_task.appendChild(new_deadline);
					document.getElementById('task_list_items').appendChild(new_task);
				}
			}
		}
	}
	var url = base_url +'api.php?action=task_list&list_filter='+ list_filter +'&list_sort='+ list_sort +'&list_sort_order='+ list_sort_order + list_categories;
	xmlhttp.open('GET', url, true);
	xmlhttp.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
	xmlhttp.setRequestHeader('Cache-Control', 'no-cache, must-revalidate');
	xmlhttp.send();
	document.getElementById('task_list_items').innerHTML = 'Loading...';
}
function getCategoryList() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				//console.log(jsonParse(xmlhttp.responseText));
				var categories = jsonParse(xmlhttp.responseText).result;
				clearSelect('filter_categories');
				list_categories = '';
				clearSelect('task_categories');
				document.getElementById('category_list_items').innerHTML = '';
				for(category in categories) {
					var new_option = document.createElement('option');
					new_option.text = categories[category].category_name;
					new_option.value = categories[category].category_id;
					var new_option2 = document.createElement('option');
					new_option2.text = categories[category].category_name;
					new_option2.value = categories[category].category_id;
					try {
						document.getElementById('filter_categories').add(new_option, null);
						document.getElementById('task_categories').add(new_option2, null);
					}
					catch(ex) {
						document.getElementById('filter_categories').add(new_option);
						document.getElementById('task_categories').add(new_option2);
					}
					var new_list_item = document.createElement('div');
					new_list_item.className = 'list_item';
					new_list_item.id = '#category='+ categories[category].category_id;
					new_list_item.onclick = function(){window.location = this.id};
					new_list_item.innerHTML = categories[category].category_name;
					document.getElementById('category_list_items').appendChild(new_list_item);
				}
			}
		}
	}
	var url = base_url +'api.php?action=category_list';
	xmlhttp.open('GET', url, true);
	xmlhttp.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
	xmlhttp.setRequestHeader('Cache-Control', 'no-cache, must-revalidate');
	xmlhttp.send();
	document.getElementById('category_list_items').innerHTML = 'Loading...';
}