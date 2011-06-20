<?php
class framework {
	function root() {
		return dirname(__FILE__);
	}

	function render($file_name, $variables_array = null) {
		if($variables_array) {
			extract($variables_array);  
		}
		require($this->root() . '/../views/' . $file_name . '.php');
	}
	
	function status404() {
		header($_SERVER['SERVER_PROTOCOL'].' 404 Not Found');
		exit();
	}
}
?>