SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE IF NOT EXISTS `tasks` (
  `task_id` bigint(20) NOT NULL auto_increment,
  `task_title` varchar(255) collate utf8_bin NOT NULL,
  `task_description` text collate utf8_bin NOT NULL,
  `task_deadline` timestamp NULL default NULL,
  `task_priority` enum('high','normal','low') character set latin1 collate latin1_bin NOT NULL default 'normal',
  `task_status` tinyint(4) NOT NULL default '0',
  PRIMARY KEY  (`task_id`),
  KEY `task_title` (`task_title`),
  KEY `task_deadline` (`task_deadline`),
  KEY `task_priority` (`task_priority`),
  KEY `task_status` (`task_status`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `tasks_categories`
--

CREATE TABLE IF NOT EXISTS `tasks_categories` (
  `category_id` int(11) NOT NULL auto_increment,
  `category_name` varchar(255) collate utf8_bin NOT NULL,
  `category_status` tinyint(4) NOT NULL default '0',
  PRIMARY KEY  (`category_id`),
  KEY `category_status` (`category_status`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `tasks_categories_many`
--

CREATE TABLE IF NOT EXISTS `tasks_categories_many` (
  `category_id` int(11) NOT NULL,
  `task_id` bigint(20) NOT NULL,
  PRIMARY KEY  (`category_id`,`task_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_bin;
