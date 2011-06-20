<?
class task extends model {
	var $task_id = 0;
	var $task_title;
	var $task_description;
	var $task_deadline;
	var $task_priority;
	var $task_status = 0;
	var $task_categories = array();

	function __construct($id = 0) {
		if ((int)$id) {
			$this->loadTask($id);
		}
	}

	function loadTask($id) {
		$model = new model();
		$result = $model->getOne(sprintf('SELECT task_title, task_description, task_deadline, task_deadline, task_priority, task_status FROM tasks WHERE task_id = %d LIMIT 1;', $id));
		if ($result) {
			$this->task_id = $id;
			$this->task_title = stripslashes($result->task_title);
			$this->task_description = stripslashes($result->task_description);
			$this->task_deadline = date('Y-m-d\TH:i', strtotime($result->task_deadline));
			$this->task_priority = $result->task_priority;
			$this->task_status = $result->task_status;
			$this->task_categories = $this->loadRelatedCategories($id);
		}
	}

	function loadAllTasks($filter = 'active', $sort = 'deadline', $sort_order = 'asc') {
		$model = new model();
		switch ($filter) {
		case 'deleted':
			$filter = ' WHERE task_status = 1 ';
			break;
		case 'over-deadline':
			$filter = ' WHERE task_status = 0 AND task_deadline < NOW() ';
			break;
		case 'active':
		default:
			$filter = ' WHERE task_status = 0 ';
			break;
		}
		switch ($sort) {
		case 'added':
			$sort = 'task_id';
			break;
		case 'priority':
			$sort = 'task_priority';
			break;
		case 'title':
			$sort = 'task_title';
			break;
		case 'deadline':
		default:
			$sort = 'task_deadline';
			break;
		}
		switch ($sort_order) {
		case 'desc':
			$sort_order = 'DESC';
			break;
		case 'asc':
		default:
			$sort_order = 'ASC';
			break;
		}
		$rows = $model->getMany(sprintf('SELECT task_id, task_title, DATE_FORMAT(task_deadline, "%s") AS task_deadline, task_priority FROM tasks %s ORDER BY %s %s;', '%Y-%m-%d %H:%i', $filter, $sort, $sort_order));
		foreach ($rows as $key => $value) {
			$rows[$key]->task_title = stripslashes($value->task_title);
		}
		return $rows;
	}

	function saveTask() {
		if (!trim($this->task_title)) {
			return false;
		}
		$model = new model();
		$deadline = date('Y-m-d H:i:s', strtotime($this->task_deadline));
		if ($deadline <= date('Y-m-d H:i:s') && !$this->task_status) {
			$deadline = date('Y-m-d H:i:s', strtotime('tomorrow'));
		}
		$model->query('BEGIN;');
		if ($this->task_id) {
			$model->query(sprintf('UPDATE tasks SET task_title = "%s", task_description = "%s", task_deadline = "%s", task_priority = "%s", task_status = %d WHERE task_id = %d;', mysql_real_escape_string($this->task_title), mysql_real_escape_string($this->task_description), $deadline, mysql_real_escape_string($this->task_priority), $this->task_status, $this->task_id));
			$this->saveRelatedCategories($this->task_id);
			$model->query('COMMIT;');
		}
		else {
			$id = $model->query(sprintf('INSERT INTO tasks SET task_title = "%s", task_description = "%s", task_deadline = "%s", task_priority = "%s", task_status = %d;', mysql_real_escape_string($this->task_title), mysql_real_escape_string($this->task_description), $deadline, mysql_real_escape_string($this->task_priority), $this->task_status));
			if ($id) {
				$this->task_id = $id;
				$this->saveRelatedCategories($id);
				$model->query('COMMIT;');
			}
			else {
				$model->query('ROLLBACK;');
				return false;
			}
		}
		usleep(200000);
		return true;
	}

	function loadRelatedCategories($id) {
		$model = new model();
		return $model->getMany(sprintf('SELECT category_id FROM tasks_categories AS tc JOIN tasks_categories_many AS tcm USING(category_id) WHERE tcm.task_id = %d;', $id));
	}

	function deleteRelatedCategories($id) {
		$model = new model();
		$model->query(sprintf('DELETE FROM tasks_categories_many WHERE task_id = %d;', $id));
	}

	function saveRelatedCategories($id) {
		$model = new model();
		$this->deleteRelatedCategories($id);
		foreach ($this->task_categories as $value) {
			$model->query(sprintf('INSERT INTO tasks_categories_many SET task_id = %d, category_id = %d;', $id, $value));
		}
	}
}
?>