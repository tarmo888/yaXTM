<?
class model {
	protected $db;

	function __construct() {
		if ($this->db = mysql_pconnect(db_hostname, db_username, db_password)) {
			mysql_select_db(db_database, $this->db);
		}
		else {
			die('database error');
		}
	}

	function getOne($sql) {
		return mysql_fetch_object(mysql_query($sql, $this->db));
	}

	function getMany($sql) {
		$rows = array();
		$result = mysql_query($sql, $this->db);
		while ($row = mysql_fetch_object($result)) {
			$rows[] = $row;
		}
		return $rows;
	}

	function query($sql) {
		mysql_query($sql, $this->db);
		return mysql_insert_id($this->db);
	}
}
?>