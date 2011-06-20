<?php
require('lib/config.php');
require('lib/framework.php');
require('lib/model.php');
require('model/category.php');
require('model/task.php');

class api extends framework {
	function __construct() {
		switch ($_GET['action']) {
		case 'category':
			$result = $this->category();
			break;
		case 'category_list':
			$result = $this->category_list();
			break;
		case 'task':
			$result = $this->task();
			break;
		case 'task_list':
			$result = $this->task_list();
			break;
		default:
			$this->status404();
			break;
		}

		$this->render('api', compact('result'));
	}

	function category() {
		if ($_POST) {
			$category = new category();
			$category->category_id = $_POST['category_id'];
			$category->category_name = $_POST['category_name'];
			$category->category_status = $_POST['category_status'];
			return $category->saveCategory();
		}
		else {
			$category = new category($_GET['id']);
			return $category;
		}
	}
	
	function category_list() {
		$category = new category();
		$categories = $category->loadAllCategories();
		return $categories;
	}

	function task() {
		if ($_POST) {
			$task = new task();
			$task->task_id = $_POST['task_id'];
			$task->task_title = $_POST['task_title'];
			$task->task_description = $_POST['task_description'];
			$task->task_deadline = $_POST['task_deadline'];
			$task->task_status = $_POST['task_status'];
			$task->task_priority = $_POST['task_priority'];
			$task->task_categories = $_POST['category'];
			return $task->saveTask();
		}
		else {
			$task = new task($_GET['id']);
			return $task;
		}
	}

	function task_list() {
		$task = new task();
		$tasks = $task->loadAllTasks($_GET['list_filter'], $_GET['list_sort'], $_GET['list_sort_order']);
		if (count($_GET['category'])) {
			foreach ($tasks as $key => $value) {
				$related = $task->loadRelatedCategories($value->task_id);
				foreach ($related as $rel_key => $rel_value) {
					# remove from response if not in any category
					if (!in_array($rel_value->category_id, $_GET['category'])) {
						unset($tasks[$key]);
					}
				}
			}
		}
		return $tasks;
	}
}

$controller = new api();
?>