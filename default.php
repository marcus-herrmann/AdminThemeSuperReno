<?php

/**
 * Default.php
 * 
 * Main markup file for AdminThemeReno
 * Copyright (C) 2014 by Tom Reno (Renobird)
 * http://www.tomrenodesign.com
 *
 * ProcessWire 2.x
 * Copyright (C) 2011 by Ryan Cramer
 * Licensed under GNU/GPL v2, see LICENSE.TXT
 *
 * http://www.processwire.com
 * http://www.ryancramer.com
 * 
 */

if(!defined("PROCESSWIRE")) die();

if(!isset($content)) $content = '';

$searchForm = $user->hasPermission('page-edit') ? $modules->get('ProcessPageSearch')->renderSearchForm('Type here to search') : '';

$config->styles->prepend($config->urls->adminTemplates . "styles/" . ($adminTheme->colors ? "$adminTheme->colors" : "main") . ".css?v=7"); 
$config->styles->prepend($config->urls->adminTemplates . "styles/superreno.css");
$config->styles->append($config->urls->root . "wire/templates-admin/styles/font-awesome/css/font-awesome.min.css");
$config->scripts->append($config->urls->root . "wire/templates-admin/scripts/inputfields.js?v=5"); 
$config->scripts->append($config->urls->adminTemplates . "scripts/main.js?v=5");

require_once(dirname(__FILE__) . "/AdminThemeSuperRenoHelpers.php");
$helpers = new AdminThemeSuperRenoHelpers();

?>
<!DOCTYPE html>
<html class="<?php echo $helpers->renderBodyClass(); ?>" lang="<?php echo $helpers->_('en'); 
	/* this intentionally on a separate line */ ?>">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="robots" content="noindex, nofollow" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title><?php echo $helpers->renderBrowserTitle(); ?></title>

	<script type="text/javascript"><?php echo $helpers->renderJSConfig(); ?></script>
	<?php foreach($config->styles as $file) echo "\n\t<link type='text/css' href='$file' rel='stylesheet' />"; ?>
	<?php foreach($config->scripts as $file) echo "\n\t<script type='text/javascript' src='$file'></script>"; ?>

</head>

<body class="<?php echo $helpers->renderBodyClass(); ?>">

	<div id="wrap">
		<div id="masthead" class="masthead ui-helper-clearfix">

				<a href="" class='main-nav-toggle'><i class="fa fa-bars"></i></a>
				<a id="logo" href="<?php echo $config->urls->admin?>">

                    <img src="<?php echo $config->urls->adminTemplates?>styles/images/logo.png" alt="ProcessWire" />
					<img src="<?php echo $config->urls->adminTemplates?>styles/images/logo-sm.png" class='sm' alt="ProcessWire" />


				</a>

				<a href="<?php echo $config->urls->admin?>" id="superreno_sitename">
					<?php echo $helpers->renderSiteName(); ?>
				</a>

				<?php echo tabIndent($searchForm, 3); ?>

				<ul id="topnav">
					<?php echo $helpers->renderTopNavItems(); ?>
				</ul>

		</div>

		<div id="sidebar" class="mobile">

			<?php echo $helpers->renderEnvironmentIndicator(); ?>


			<ul id="main-nav">
				<?php echo $helpers->renderSideNavItems($page); ?>

				<?php echo $helpers->renderForumSearch(); ?>

				<?php echo $helpers->renderUsefulLinks(); ?>
			</ul>

		</div>

		<div id="main">

			<?php echo $helpers->renderAdminNotices($notices); ?>
		
			<div id="breadcrumbs">
				<ul class="nav"><?php echo $helpers->renderBreadcrumbs($appendCurrent = false); ?></ul>
			</div>

			<div id="headline">
				<?php if(in_array($page->id, array(2,3,8))) echo $helpers->renderAdminShortcuts(); /* 2,3,8=page-list admin page IDs */ ?>
				<h1 id="title"><?php echo $helpers->getHeadline() ?></h1>
			</div>

			<div id="content" class="content fouc_fix">

				<?php
				if(trim($page->summary)) echo "<h2>{$page->summary}</h2>";
				if($page->body) echo $page->body;
				echo $content;
				?>

			</div>

			<div id="footer" class="footer">
				<p>
					<?php if(!$user->isGuest()): ?>
						<span id="userinfo">
						<?php if($user->hasPermission('profile-edit')): ?> 
							<a class="action" href="<?php echo $config->urls->admin; ?>profile/"><i class="fa fa-user"></i> <?php echo $user->name; ?></a>  
						<?php endif; ?>
							<a class="action" href="<?php echo $config->urls->admin; ?>login/logout/"><i class="fa fa-times"></i> <?php echo __('Logout', __FILE__); ?></a>
						</span>
					<?php endif; ?>
					ProcessWire <?php echo $config->version . ' <!--v' . $config->systemVersion; ?>--> &copy; <?php echo date("Y"); ?> 
				</p>
				
				<?php if($config->debug && $this->user->isSuperuser()) include(dirname(__FILE__) . "/debug.inc"); ?>

			</div><!--/#footer-->
		</div> <!-- /#main -->
	</div> <!-- /#wrap -->
</body>
</html>