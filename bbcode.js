//jquery version
if (jQuery) {
	//if (jQuery.isFunction($(this).button) == false) {
	//	alert("jQuery UI needed for the BBCode editor to work");
	//}

	(function ($) {
		$.fn.bbCode = function(options) {
			var $bbCodeID, $mainID, $backOptions, $mainObj, $main, settings, $bbCode;
			$backOptions = options;

			settings = $.extend({
				"counter":	false,
				"preview":	false
			}, options);

			$main		= $(this);
			$bbCodeID	= "#" + $main.attr("id") + "bbCode";

			if (!$($bbCodeID).attr("id")) { $.fn.bbCode.makeContainer($main.attr("id"), $backOptions); }

			$mainID		= $(this).attr("id");
			$mainObj	= document.getElementById($mainID);
			$bbCode		= $($bbCodeID);

			$.fn.bbCode.makeButtons($mainID, $.fn.bbCode, $bbCode, settings);

			//Counter for things like twitter
			if (settings.counter) {
				$bbCode.append("<br />");
				$bbCode.append("<div id=\"bbCounter_" + $mainID + "\" class=\"charsLeft\"></div>");
			}

			//make the preview area if its turned on
			if (settings.preview) { $.fn.bbCode.makePreview($mainID); }

			//updater depending on preview or not
			$("#" + $mainID).keyup(function () { $.fn.bbCode.triggerChange($main, $mainID, settings.preview); });
		};

		$.fn.bbCode.makeContainer = function (mainID, $backOptions) {
			var $textArea, $label, $title, $place, $container;
			$textArea	= $("#" + mainID);
			$label		= $("#label" + mainID);

			$title		= $textArea.attr("title");
			$place		= $textArea.attr("placeholder");

			$container	= "<div id=\"bbContainer_" + mainID + "\">";
			$container += "<div id=\"" + mainID + "bbCode\" class=\"bbCode\"></div>";
			$container += "<textarea id=\"" + mainID + "\" title=\"" + $title + "\" placeholder=\"" + $place + "\"></textarea>";
			$container += "</div>";

			$label.after($container);
			$textArea.remove();
			$("#" + mainID).bbCode($backOptions);
		};

		$.fn.bbCode.triggerButton = function (button, $mainID, $main, $preview) {
			switch(button.keyCode) {
				case 2:
					$.fn.bbCode.doTag("b", "b", $mainID);
					break;

				case 9:
					$.fn.bbCode.doTag("i", "i", $mainID);
					break;

				case 21:
					$.fn.bbCode.doTag("u", "u", $mainID);
					break;
			}

			$.fn.bbCode.triggerChange($main, $mainID, $preview);
		};

		$.fn.bbCode.makeButtons = function ($mainID, $main, $bbCode, settings) {
			var $ret, singleLine, $bbCodeID, $parentID;

			//key binds
			$("#" + $mainID).bind('keypress', function(e) { $.fn.bbCode.triggerButton(e, $mainID, $main, settings.preview); });

			//if singleline
			if (settings.singleLine) { singleLine = true; }

			//bold
			$bbCode.append("<span class=\"bbCodeButton sprite_text_bold\" id=\"bold" + $mainID + "\">Bold</span>");
			$("#bold" + $mainID).button({text: false, icons: {primary: "boldBB"}}).click(function () {
				$.fn.bbCode.doTag("b", "b", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//italic
			$bbCode.append("<span class=\"bbCodeButton sprite_text_italic\" id=\"italic" + $mainID + "\">Italic</span>");
			$("#italic" + $mainID).button({text: false, icons: {primary: "italicBB"}}).click(function () {
				$.fn.bbCode.doTag("i", "i", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//underline
			$bbCode.append("<span class=\"bbCodeButton sprite_text_underline\" id=\"underline" + $mainID + "\">Underline</span>");
			$("#underline" + $mainID).button({text: false, icons: {primary: "underlineBB"}}).click(function () {
				$.fn.bbCode.doTag("u", "u", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			$bbCode.append("<span class=\"bbCodeButton sprite_style\" id=\"colorBB" + $mainID + "\">Color</span>");
			$("#colorBB" + $mainID).button({text: false, icons: {primary: "colorBB"}}).click(function () {
				$ret = prompt("Enter Color: ", "CECECE");
				if ($ret) { $.fn.bbCode.doTag("color=#" + $ret, "color", $mainID); }
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//link
			$bbCode.append("<span class=\"bbCodeButton sprite_link\" id=\"linkBB" + $mainID + "\">Link</span>");
			$("#linkBB" + $mainID).button({text: false, icons: {primary: "linkBB"}}).click(function () {
				$ret = prompt("Enter URL:", "http://www.tester.com");
				if ($ret) { $.fn.bbCode.doTag("url=" + $ret, "url", $mainID); }
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//image
			$bbCode.append("<span class=\"bbCodeButton sprite_picture\" id=\"imageBB" + $mainID + "\">Image</span>");
			$("#imageBB" + $mainID).button({text: false, icons: {primary: "imageBB"}}).click(function () {
				$ret = prompt("Enter Image URL:", "http://images.google.com");
				if ($ret) {	$.fn.bbCode.doTag("img=" + $ret, "img", $mainID); }
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//youtube
			$bbCode.append("<span class=\"bbCodeButton sprite_video\" id=\"videoBB" + $mainID + "\">Youtube</span>");
			$("#videoBB" + $mainID).button({text: false, icons: {primary: "videoBB"}}).click(function () {
				$ret = prompt("Enter youtube ID:", "PkypXn5S4Rg");
				$.fn.bbCode.doMiddle("youtube", $ret, $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//List
			$bbCode.append("<span class=\"bbCodeButton sprite_text_list_bullets\" id=\"listBB" + $mainID + "\">List</span>");
			$("#listBB" + $mainID).button({text: false, icons: {primary: "listBB"}}).click(function () {
				$.fn.bbCode.doList($mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//break
			if (!singleLine) { $bbCode.append("<br />"); }

			//hr
			$bbCode.append("<span class=\"bbCodeButton sprite_text_horizontalrule\" id=\"hrBB" + $mainID + "\">HR</span>");
			$("#hrBB" + $mainID).button({text: false, icons: {primary: "hrBB"}}).click(function () {
				$.fn.bbCode.doTag("hr", "hr", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//headings
			$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_1\" id=\"h1BB" + $mainID + "\">H1</span>");
			$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_2\" id=\"h2BB" + $mainID + "\">H2</span>");
			$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_3\" id=\"h3BB" + $mainID + "\">H3</span>");
			$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_4\" id=\"h4BB" + $mainID + "\">H4</span>");
			$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_5\" id=\"h5BB" + $mainID + "\">H5</span>");
			$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_6\" id=\"h6BB" + $mainID + "\">H6</span>");

			$("#h1BB" + $mainID).button({text: false, icons: {primary: "h1BB"}}).click(function () {
				$.fn.bbCode.doTag("h1", "h1", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});
			$("#h2BB" + $mainID).button({text: false, icons: {primary: "h2BB"}}).click(function () {
				$.fn.bbCode.doTag("h2", "h2", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});
			$("#h3BB" + $mainID).button({text: false, icons: {primary: "h3BB"}}).click(function () {
				$.fn.bbCode.doTag("h3", "h3", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});
			$("#h4BB" + $mainID).button({text: false, icons: {primary: "h4BB"}}).click(function () {
				$.fn.bbCode.doTag("h4", "h4", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});
			$("#h5BB" + $mainID).button({text: false, icons: {primary: "h5BB"}}).click(function () {
				$.fn.bbCode.doTag("h5", "h5", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});
			$("#h6BB" + $mainID).button({text: false, icons: {primary: "h6BB"}}).click(function () {
				$.fn.bbCode.doTag("h6", "h6", $mainID);
				$.fn.bbCode.triggerChange($main, $mainID, settings.preview);
			});

			//remove extras that sometimes happen
			$bbCodeID = $bbCode.attr("id");
			$(".bbCodeButton").each(function (i) {
				$parentID = $(this).parent().attr("id");
				if ($bbCodeID == $parentID) {
					$(this).not(".ui-button").unbind().remove();
				}
			});
		},

		$.fn.bbCode.triggerChange = function ($main, mainID, preview) {
			$.fn.bbCode.fixReplication(mainID);

			if (preview) { $.fn.bbCode.updatePreview(mainID, $main); }
		};

		$.fn.bbCode.fixSize = function () {
			//size the buttons that are left
			$("button").css({
				width: "16px",
				height: "16px",
				"min-width": "16px"
			});
		};

		$.fn.bbCode.fixReplication = function (mainID) {
			var $fixVal, $content;
			$content	= $("#" + mainID);

			//get content before fix
			$fixVal		= $content.val();
			if ($fixVal) {
				//fix nulls and duplication
				$fixVal		= $fixVal.replace(/\[(.*)\]null\[\/(.*)\]\[(.*)\](.*)\[\/(.*)\]/g, "[$3]$4[/$5]");
				$fixVal		= $fixVal.replace(/\[hr\]\[\/hr\]\[hr\]\[\/hr\]/g, "[hr][/hr]");

				//replace the content
				$content.val($fixVal);
			}
		};

		$.fn.bbCode.doPreRender = function (mainArea) {
			var preRender, preAttach, randNum;

			randNum 		= Math.floor(Math.random() * 100);
			preRender		= document.createElement("div");
			preRender.id	= "preRender" + randNum;
			preAttach		= document.getElementById(mainArea);
			preAttach.appendChild(preRender);

			return randNum;
		};

		$.fn.bbCode.previewBold = function (mainArea, $preVal, $main) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			$splitter		= $preVal.split(/(.*)\[b\](.*)\[\/b\](.*)/g);
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum 		= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<strong>" + $preElement + "</strong>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[b\](.*)\[\/b\]/g)) { $ret = $.fn.bbCode.previewBold(mainArea, $ret, $main); }

			return $ret;
		};

		$.fn.bbCode.previewItalic = function (mainArea, $preVal, $main) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			$splitter		= $preVal.split(/(.*)\[i\](.*)\[\/i\](.*)/g);
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<em>" + $preElement + "</em>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[i\](.*)\[\/i\]/g)) { $ret = $.fn.bbCode.previewItalic(mainArea, $ret, $main); }

			return $ret;
		};

		$.fn.bbCode.previewUnderline = function (mainArea, $preVal, $main) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			$splitter		= $preVal.split(/(.*)\[u\](.*)\[\/u\](.*)/g);
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<span style=\"border-bottom: 1px dotted\">" + $preElement + "</span>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[u\](.*)\[\/u\]/g)) { $ret = $.fn.bbCode.previewUnderline(mainArea, $ret, $main); }

			return $ret;
		};

		$.fn.bbCode.previewHeader = function (mainArea, $preVal, $main) {
			var $splitter, $preContent, $preElement, $postContent, $ret, $hLevel, randNum;
			$splitter		= $preVal.split(/(.*)\[h([0-9]+)\](.*)\[\/h([0-9]+)\](.*)/g);
			$preContent		= $splitter[1];
			$hLevel			= $splitter[2];
			$preElement		= $splitter[3];
			$postContent	= $splitter[5];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<h" + $hLevel + ">" + $preElement + "</h" + $hLevel + ">" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[h([0-9]+)\](.*)\[\/h([0-9]+)\]/g)) { $ret = $.fn.bbCode.previewHeader(mainArea, $ret, $main); }

			return $ret;
		};

		$.fn.bbCode.previewYouTube = function (mainArea, $preVal, $main) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			$splitter		= $preVal.split(/(.*)\[youtube\]([a-zA-Z0-9]+)\[\/youtube\](.*)/g);
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<iframe width='120' height='120' src='http://www.youtube/com/embed/" + $preElement + "?theme=light&color=red' frameborder='0' allowfullscreen></iframe>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[youtube\]([a-zA-Z0-9]+)\[\/youtube\]/g)) { $ret = $.fn.bbCode.previewYouTube(mainArea, $ret, $main); }

			return $ret;
		};

		$.fn.bbCode.previewImage = function (mainArea, $preVal, $main, noCaption) {
			var $splitter, $preContent, $preElement, $postContent, $ret, $caption, $madeContent, randNum;
			if (noCaption) {
				$splitter	= $preVal.split(/(.*)\[img\](.*)\[\/img\](.*)/g);
			} else {
				$splitter	= $preVal.split(/(.*)\[img=(.*)\](.*)\[\/img\](.*)/g);
			}
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];

			if ($splitter.length == 4) {
				$caption		= $splitter[3];
				$postContent	= $splitter[4];
			} else {
				$postContent = $splitter[3];
			}

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			if ($caption) {
				$madeContent	= $preContent + "<img src='" + $preElement + "' title='" + $caption + "' /><caption>" + $caption + "</caption>" + $postContent;
			} else {
				$madeContent	= $preContent + "<img src='" + $preElement + "' />" + $postContent;
			}
			$("#preRender" + randNum).html($madeContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[img=(.*)\](.*)\[\/img\]/g)) { $ret = $.fn.bbCode.previewImage(mainArea, $ret, $main, false); }
			if ($ret.match(/\[img\](.*)\[\/img\]/g)) { $ret = $.fn.bbCode.previewImage(mainArea, $ret, $main, true); }

			return $ret;
		};

		$.fn.bbCode.previewLink = function (mainArea, $preVal, $main, enclosed) {
			var $splitter, $preContent, $preElement, $postContent, $ret, $content, randNum;
			if (enclosed) {
				$splitter		= $preVal.split(/(.*)\[url=("(.*)")\](.*)\[\/url\](.*)/g);
				$preElement		= $splitter[3];
				$content		= $splitter[4];
				$postContent	= $splitter[5];
			} else {
				$splitter		= $preVal.split(/(.*)\[url=(.*)\](.*)\[\/url\](.*)/g);
				$preElement		= $splitter[2];
				$content		= $splitter[3];
				$postContent	= $splitter[4];
			}
			$preContent			= $splitter[1];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<a href='" + $preElement + "' title='" + $content + "'>" + $content + "</a>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[url=("(.*)")\](.*)\[\/url\]/g)) { $ret = $.fn.bbCode.previewLink(mainArea, $ret, $main, true); }
			if ($ret.match(/\[url=(.*)\](.*)\[\/url\]/g)) { $ret = $.fn.bbCode.previewLink(mainArea, $ret, $main, false); }

			return $ret;
		};

		$.fn.bbCode.previewColor = function (mainArea, $preVal, $main, enclosed) {
			var $splitter, $preContent, $preElement, $postContent, $ret, $content, randNum;
			if (enclosed) {
				$splitter		= $preVal.split(/(.*)\[COLOR=("([a-zA-Z0-9\#]+)")\](.*)\[\/COLOR\](.*)/g);
				$preElement		= $splitter[3];
				$content		= $splitter[4];
				$postContent	= $splitter[5];
			} else {
				$splitter		= $preVal.split(/(.*)\[color=([a-zA-Z0-9\#]+)\](.*)\[\/color\](.*)/g);
				$preElement		= $splitter[2];
				$content		= $splitter[3];
				$postContent	= $splitter[4];
			}
			$preContent			= $splitter[1];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<font color='" + $preElement + "'>" + $content + "</font>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[COLOR=("([a-zA-Z0-9\#]+)")\](.*)\[\/COLOR\]/g)) { $ret = $.fn.bbCode.previewColor(mainArea, $ret, $main, true); }
			if ($ret.match(/\[color=([a-zA-Z0-9\#]+)\](.*)\[\/color\]/g)) { $ret = $.fn.bbCode.previewColor(mainArea, $ret, $main, false); }

			return $ret;
		};

		$.fn.bbCode.previewList = function (mainArea, $preVal, $main) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			$splitter		= $preVal.split(/(.*)\[list\](.*)\[\/list\](.*)/g);
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			//replace breaks within the element
			$preElement		= $preElement.replace(/<br>/g, "--list-item--");
			$preElement		= $preElement.replace(/(\-\-list\-item\-\-\[\*\])/, "[*]");

			if ($preElement.match(/\[\*\]((.*)\-\-list\-item\-\-)/g)) { $preElement = $.fn.bbCode.previewListItem(mainArea, $preElement, $main); }

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<ul>" + $preElement + "</ul>" + $postContent);
			$ret	= $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[list\](.*)\[\/list\]/g)) { $ret = $.fn.bbCode.previewList(mainArea, $ret, $main); }

			return $ret;
		};
		$.fn.bbCode.previewListItem = function (mainArea, $preVal, $main) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			$splitter		= $preVal.split(/(.*)\[\*\](.*)(\-\-list\-item\-\-)(.*)/g);

			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$removeDelimit	= $splitter[3];
			$postContent	= $splitter[4];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<li>" + $preElement + "</li>" + $postContent);
			$ret	= $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[\*\]((.*)\-\-list\-item\-\-)/g)) { $ret = $.fn.bbCode.previewListItem(mainArea, $ret, $main); }

			return $ret;
		};

		$.fn.bbCode.previewQuote = function (mainArea, $preVal, $main, uppercase) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			if (uppercase) {
				$splitter		= $preVal.split(/(.*)\[QUOTE\](.*)\[\/QUOTE\](.*)/g);
			} else {
				$splitter		= $preVal.split(/(.*)\[quote\](.*)\[\/quote\](.*)/g);
			}

			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			$("#preRender" + randNum).html($preContent + "<blockquote>" + $preElement + "</blockquote>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[quote\](.*)\[\/quote\]/g)) { $ret = $.fn.bbCode.previewQuote(previewID, $ret, $main, false); }
			if ($ret.match(/\[QUOTE\](.*)\[\/QUOTE\]/g)) { $ret = $.fn.bbCode.previewQuote(previewID, $ret, $main, true); }

			return $ret;
		};

		$.fn.bbCode.previewTable = function (mainArea, $preVal, $main, uppercase) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			if (uppercase) {
				$splitter 	= $preVal.split(/(.*)\[TABLE\](.*)\[\/TABLE\](.*)/g);
			} else {
				$splitter 	= $preVal.split(/(.*)\[table\](.*)\[\/table\](.*)/g);
			}
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum			= $.fn.bbCode.doPreRender(mainArea);

			//table row
			if ($preElement.match(/\[tr\](.*)\[\/tr\]/g)) { $preElement = $.fn.bbCode.previewTableRow(mainArea, $preElement, $main, false); }
			if ($preElement.match(/\[TR\](.*)\[\/TR\]/g)) { $preElement = $.fn.bbCode.previewTableRow(mainArea, $preElement, $main, true); }

			//table head
			if ($preElement.match(/\[th\](.*)\[\/th\]/g)) { $preElement = $.fn.bbCode.previewTableHead(mainArea, $preElement, $main, false); }
			if ($preElement.match(/\[TH\](.*)\[\/TH\]/g)) { $preElement = $.fn.bbCode.previewTableHead(mainArea, $preElement, $main, true); }

			//table cell
			if ($preElement.match(/\[td\](.*)\[\/td\]/g)) { $preElement = $.fn.bbCode.previewTableCell(mainArea, $preElement, $main, false); }
			if ($preElement.match(/\[TD\](.*)\[\/TD\]/g)) { $preElement = $.fn.bbCode.previewTableCell(mainArea, $preElement, $main, true); }

			$("#preRender" + randNum).html($preContent + "<table>" + $preElement + "</table>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			//loop to do extra ones
			if ($ret.match(/\[table\](.*)\[\/table\]/g)) { $ret = $.fn.bbCode.previewTable(mainArea, $ret, $main, false); }
			if ($ret.match(/\[TABLE\](.*)\[\/TABLE\]/g)) { $ret = $.fn.bbCode.previewTable(mainArea, $ret, $main, true); }

			return $ret;
		};
		$.fn.bbCode.previewTableRow = function (mainArea, $preVal, $main, uppercase) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			if (uppercase) {
				$splitter	= $preVal.split(/(.*)\[TR\](.*)\[\/TR\](.*)/g);
			} else {
				$splitter	= $preVal.split(/(.*)\[tr\](.*)\[\/tr\](.*)/g);
			}
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum			= $.fn.bbCode.doPreRender(mainArea);
			$preElement = $preElement.replace(/<br>/g, "");

			$("#preRender" + randNum).html($preContent + "<tr>" + $preElement + "</tr>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[tr\](.*)\[\/tr\]/g)) { $ret = $.fn.bbCode.previewTableRow(mainArea, $ret, $main, false); }
			if ($ret.match(/\[TR\](.*)\[\/TR\]/g)) { $ret = $.fn.bbCode.previewTableRow(mainArea, $ret, $main, true); }

			return $ret;
		};
		$.fn.bbCode.previewTableHead = function (mainArea, $preVal, $main, uppercase) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			if (uppercase) {
				$splitter	= $preVal.split(/(.*)\[TH\](.*)\[\/TH\](.*)/g);
			} else {
				$splitter	= $preVal.split(/(.*)\[th\](.*)\[\/th\](.*)/g);
			}
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum			= $.fn.bbCode.doPreRender(mainArea);
			$preElement	= $preElement.replace(/<br>/g, "");

			$("#preRender" + randNum).html($preContent + "<th>" + $preElement + "</th>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[th\](.*)\[\/th\]/g)) { $ret = $.fn.bbCode.previewTableHead(mainArea, $ret, $main, false); }
			if ($ret.match(/\[TH\](.*)\[\/TH\]/g)) { $ret = $.fn.bbCode.previewTableHead(mainArea, $ret, $main, true); }

			return $ret;
		};
		$.fn.bbCode.previewTableCell = function (mainArea, $preVal, $main, uppercase) {
			var $splitter, $preContent, $preElement, $postContent, $ret, randNum;
			if (uppercase) {
				$splitter	= $preVal.split(/(.*)\[TD\](.*)\[\/TD\](.*)/g);
			} else {
				$splitter	= $preVal.split(/(.*)\[td\](.*)\[\/td\](.*)/g);
			}
			$preContent		= $splitter[1];
			$preElement		= $splitter[2];
			$postContent	= $splitter[3];

			randNum			= $.fn.bbCode.doPreRender(mainArea);
			$preElement	= $preElement.replace(/<br>/g, "");

			$("#preRender" + randNum).html($preContent + "<td>" + $preElement + "</td>" + $postContent);
			$ret = $("#preRender" + randNum).html();
			$("#preRender" + randNum).remove();

			if ($ret.match(/\[td\](.*)\[\/td\]/g)) { $ret = $.fn.bbCode.previewTableCell(mainArea, $ret, $main, false); }
			if ($ret.match(/\[TD\](.*)\[\/TD\]/g)) { $ret = $.fn.bbCode.previewTableCell(mainArea, $ret, $main, true); }

			return $ret;
		};

		$.fn.bbCode.updatePreview = function (mainID, $main) {
			var $content, $preVal, $preview, $preElement1, $preElement2, $preElement3, previewID;
			$content		= $("#" + mainID);
			$preVal			= $content.val();
			$preview		= $("#preview_" + mainID);
			$preview.html($preVal);
			$preVal			= $preview.html();
			$preElement1	= false;
			$preElement2	= false;
			$preElement3	= false;
			previewID		= "preview_" + mainID;

			//if there is actually content
			if ($preVal) {
				//replace new lines
				$preVal		= $preVal.replace(/\n/g, "<br>");
				$preVal		= $preVal.replace(/\r/g, "");

				//hard line replace
				$preVal		= $preVal.replace(/\[hr\]\[\/hr\]/g, "<hr>");

				//list replacement
				if ($preVal.match(/\[list\](.*)\[\/list\]/g)) { $preVal = $.fn.bbCode.previewList(previewID, $preVal, $main); }

				//bold replace
				if ($preVal.match(/\[b\](.*)\[\/b\]/g)) { $preVal = $.fn.bbCode.previewBold(previewID, $preVal, $main); }

				//replace italics
				if ($preVal.match(/\[i\](.*)\[\/i\]/g)) { $preVal = $.fn.bbCode.previewItalic(previewID, $preVal, $main); }

				//replace underline
				if ($preVal.match(/\[u\](.*)\[\/u\]/g)) { $preVal = $.fn.bbCode.previewUnderline(previewID, $preVal, $main); }

				//replace headers
				if ($preVal.match(/\[h([0-9]+)\](.*)\[\/h([0-9]+)\]/g)) { $preVal = $.fn.bbCode.previewHeader(previewID, $preVal, $main); }

				//replace youtube
				if ($preVal.match(/\[youtube\]([a-zA-Z0-9]+)\[\/youtube\]/g)) { $preVal = $.fn.bbCode.previewYouTube(previewID, $preVal, $main); }

				//image replace
				if ($preVal.match(/\[img=(.*)\](.*)\[\/img\]/g)) { $preVal = $.fn.bbCode.previewImage(previewID, $preVal, $main, false); }
				if ($preVal.match(/\[img\](.*)\[\/img\]/g)) { $preVal = $.fn.bbCode.previewImage(previewID, $preVal, $main, true); }

				//link replace
				if ($preVal.match(/\[url=("(.*)")\](.*)\[\/url\]/g)) { $preVal = $.fn.bbCode.previewLink(previewID, $preVal, $main, true); }
				if ($preVal.match(/\[url=(.*)\](.*)\[\/url\]/g)) { $preVal = $.fn.bbCode.previewLink(previewID, $preVal, $main, false); }

				//color replace
				if ($preVal.match(/\[COLOR=("([a-zA-Z0-9\#]+)")\](.*)\[\/COLOR\]/g)) { $preVal = $.fn.bbCode.previewColor(previewID, $preVal, $main, true); }
				if ($preVal.match(/\[color=([a-zA-Z0-9\#]+)\](.*)\[\/color\]/g)) { $preVal = $.fn.bbCode.previewColor(previewID, $preVal, $main, false); }

				//quote replace
				if ($preVal.match(/\[quote\](.*)\[\/quote\]/g)) { $preVal = $.fn.bbCode.previewQuote(previewID, $preVal, $main, false); }
				if ($preVal.match(/\[QUOTE\](.*)\[\/QUOTE\]/g)) { $preVal = $.fn.bbCode.previewQuote(previewID, $preVal, $main, true); }

				//table replace
				if ($preVal.match(/\[table\](.*)\[\/table\]/g)) { $preVal = $.fn.bbCode.previewTable(previewID, $preVal, $main, false); }
				if ($preVal.match(/\[TABLE\](.*)\[\/TABLE\]/g)) { $preVal = $.fn.bbCode.previewTable(previewID, $preVal, $main, true); }

				//actually insert the new content
				$preview = $("#preview_" + mainID);
				$preview.html($preVal);
			}
		};

		$.fn.bbCode.makePreview = function (mainID) {
			$("#bbContainer_" + mainID).append("<div id=\"preview_" + mainID + "\"></div>");
			$preview = $("#preview_" + mainID);
			$preview.css({
				width: "45%",
				float: "left",
				"margin-left": "1%"
			});
			$("#" + mainID + "bbCode").css("width", "100%");
			$("#" + mainID).css("width", "44%");
		};

		$.fn.bbCode.doTag = function (tag, tag2, mainID) {
			var $len, $sel, $start, $end, $rep, $tag1Len, $tag2Len, $currSend
			var $tag1	= "[" + tag + "]";
			var $tag2	= "[/" + tag2 + "]";

			$mainObj	= document.getElementById(mainID);

			//this only for chrome/firefox, fck ie
			$len 		= $mainObj.value.length;
			$start		= $mainObj.selectionStart;
			$end		= $mainObj.selectionEnd;
			$sel		= $mainObj.value.substring($start, $end);
			$rep		= $tag1 + $sel + $tag2;

			$tag1Len	= $tag1.length;
			$tag2Len	= $tag2.length;
			$currSend	= $tag1Len + $end + $tag2Len;

			//fix for HR
			if (tag == "hr") { $sel = true; }

			//selection needed for buttons to work
			if ($sel) {
				$mainObj.value	= $mainObj.value.substring(0, $start) + $rep + $mainObj.value.substring($end, $len);
				$mainObj.focus();

				$mainObj.selectionStart	= $currSend;
				$mainObj.selectionEnd	= $currSend;
			}
		};

		$.fn.bbCode.doList = function (mainID) {
			var $mainLen;
			$listItems	= new Array();
			$listNum	= 0;

			$.fn.bbCode.doItems();
			$mainObj	= document.getElementById(mainID);

			if ($listItems.length > 0) {
				var $list = '\n[list]\n';
				for (var $i = 0; $i < $listItems.length; $i++) {
					$list += '[*]' + $listItems[$i] + '\n';
				}
				$list += '[/list]\n';

				var $len 	= $mainObj.value.length;
				var $start	= $mainObj.selectionStart;
				var $end 	= $mainObj.selectionEnd;
				var $sel 	= $mainObj.value.substring($start, $end);
				var $rep 	= $list;

				$mainObj.value	= $mainObj.value.substring(0, $start) + $rep + $mainObj.value.substring($end, $len);
				$mainObj.focus();

				$mainLen				= $mainObj.value.length;
				$mainObj.selectionStart	= $mainLen;
				$mainObj.selectionEnd	= $mainLen;
			}
		};
		$.fn.bbCode.doItems = function () {
			var $item = null;
			$item = prompt("List Item, [cancel to stop]");

			if ($item) {
				$listItems[$listNum] = $item;
				$listNum++;
				$.fn.bbCode.doItems();
			}
		};

		$.fn.bbCode.doMiddle = function (tag, content, mainID) {
			if (content) {
				$mainObj	= document.getElementById(mainID);

				var $len	= $mainObj.value.length;
				var $start	= $mainObj.selectionStart;
				var $end	= $mainObj.selectionEnd;
				var $sel	= $mainObj.value.substring($start, $end);

				$cont			= "[" + tag + "]" + content + "[/" + tag + "]";
				$mainObj.value	= $mainObj.value.substring(0, $start) + $cont + $mainObj.value.substring($end, $len);
				$mainObj.focus();

				return false;
			}
		};
	})(jQuery);
}

function textArea(obj, previewOn, counterOn) {
	if (jQuery) {
		$("#" + obj).bbCode({
			preview: previewOn,
			counter: counterOn
		});
	}
}
