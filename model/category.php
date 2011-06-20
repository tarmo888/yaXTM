<?
class category extends model {
	var $category_id = 0;
	var $category_name;
	var $category_status = 0;

	function __construct($id = 0) {
		if ((int)$id) {
			$this->loadCategory($id);
		}
	}

	function loadCategory($id) {
		$model = new model();
		$result = $model->getOne(sprintf('SELECT category_name, category_status FROM tasks_categories WHERE category_id = %d LIMIT 1;', $id));
		if ($result) {
			$this->category_id = $id;
			$this->category_name = stripslashes($result->category_name);
			$this->category_status = $result->category_status;
		}
	}

	function loadAllCategories() {
		$model = new model();
		$rows = $model->getMany('SELECT category_id, category_name FROM tasks_categories WHERE category_status = 0;');
		foreach ($rows as $key => $value) {
			$rows[$key]->category_name = stripslashes($value->category_name);
		}
		return $rows;
	}

	function saveCategory() {
		if (!trim($this->category_name)) {
			return false;
		}
		$model = new model();
		if ($this->category_id) {
			$model->query(sprintf('UPDATE tasks_categories SET category_name = "%s", category_status = %d WHERE category_id = %d;', mysql_real_escape_string($this->category_name), $this->category_status, $this->category_id));
		}
		else {
			$id = $model->query(sprintf('INSERT INTO tasks_categories SET category_name = "%s", category_status = %d;', mysql_real_escape_string($this->category_name), $this->category_status));
			if (!$id) {
				return false;
			}
		}
		usleep(200000);
		return true;
	}
}
?>