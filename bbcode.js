//jquery version
if (jQuery) {
	//if (jQuery.isFunction($(this).button) == false) {
	//	alert("jQuery UI needed for the BBCode editor to work");
	//}

	(function ($) {
		$.fn.extend({
			bbCode: function (options) {
				var $bbCodeID, $mainID, $backOptions, $mainObj, $main, settings, $bbCode;
				$backOptions = options;

				settings = $.extend({
					"counter":	false,
					"preview":	false
				}, options);

				$main		= $(this);
				$bbCodeID	= "#" + $(this).attr("id") + "bbCode";
				if (!$($bbCodeID).attr("id")) { $main.makeContainer($(this).attr("id"), $backOptions); }

				$mainID		= $(this).attr("id");
				$mainObj	= document.getElementById($mainID);
				$bbCode		= $($bbCodeID);

				$main.makeButtons($mainID, $main, $bbCode, settings);

				//Counter for things like twitter
				if (settings.counter) {
					$bbCode.append("<br />");
					$bbCode.append("<div id=\"bbCounter_" + $mainID + "\" class=\"charsLeft\"></div>");
				}

				//size the buttons that are left
				$("button").css({
					width: "16px",
					height: "16px",
					"min-width": "16px"
				});

				//make the preview area if its turned on
				if (settings.preview) { $main.makePreview($mainID); }

				//updater depending on preview or not
				$("#" + $mainID).keyup(function () { $main.triggerChange($main, $mainID, settings.preview); });
			},

			makeContainer: function (mainID, $backOptions) {
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
			},

			makeButtons: function (mainID, $main, $bbCode, settings) {
				var $mainID, $ret;
				$mainID = $("#" + mainID);

				//bold
				$bbCode.append("<span class=\"bbCodeButton sprite_text_bold\" id=\"bold" + $mainID + "\">Bold</span>");
				$("#bold" + $mainID).button({text: false, icons: {primary: "boldBB"}}).click(function () {
					$main.doTag("b", "b", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				//italic
				$bbCode.append("<span class=\"bbCodeButton sprite_text_italic\" id=\"italic" + $mainID + "\">Italic</span>");
				$("#italic" + $mainID).button({text: false, icons: {primary: "italicBB"}}).click(function () {
					$main.doTag("i", "i", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				//underline
				$bbCode.append("<span class=\"bbCodeButton sprite_text_underline\" id=\"underline" + $mainID + "\">Underline</span>");
				$("#underline" + $mainID).button({text: false, icons: {primary: "underlineBB"}}).click(function () {
					$main.doTag("u", "u", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				$bbCode.append("<span class=\"bbCodeButton sprite_style\" id=\"colorBB" + $mainID + "\">Color</span>");
				$("#colorBB" + $mainID).button({text: false, icons: {primary: "colorBB"}}).click(function () {
					$ret = prompt("Enter Color: ", "CECECE");
					if ($ret) { $main.doTag("color=#" + $ret, "color", $mainID); }
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				//link
				$bbCode.append("<span class=\"bbCodeButton sprite_link\" id=\"linkBB" + $mainID + "\">Link</span>");
				$("#linkBB" + $mainID).button({text: false, icons: {primary: "linkBB"}}).click(function () {
					$ret = prompt("Enter URL:", "http://www.tester.com");
					if ($ret) { $main.doTag("url=" + $ret, "url", $mainID); }
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				//image
				$bbCode.append("<span class=\"bbCodeButton sprite_picture\" id=\"imageBB" + $mainID + "\">Image</span>");
				$("#imageBB" + $mainID).button({text: false, icons: {primary: "imageBB"}}).click(function () {
					$ret = prompt("Enter Image URL:", "http://images.google.com");
					if ($ret) {	$main.doTag("img=" + $ret, "img", $mainID); }
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				//youtube
				$bbCode.append("<span class=\"bbCodeButton sprite_video\" id=\"videoBB" + $mainID + "\">Youtube</span>");
				$("#videoBB" + $mainID).button({text: false, icons: {primary: "videoBB"}}).click(function () {
					$ret = prompt("Enter youtube ID:", "PkypXn5S4Rg");
					$main.doMiddle("youtube", $ret, $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				//List
				$bbCode.append("<span class=\"bbCodeButton sprite_text_list_bullets\" id=\"listBB" + $mainID + "\">List</span>");
				$("#listBB" + $mainID).button({text: false, icons: {primary: "listBB"}}).click(function () {
					$main.doList($mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				//break
				$bbCode.append("<br />");

				//hr
				$bbCode.append("<span class=\"bbCodeButton sprite_text_horizontalrule\" id=\"hrBB" + $mainID + "\">HR</span>");
				$("#hrBB" + $mainID).button({text: false, icons: {primary: "hrBB"}}).click(function () {
					$main.doTag("hr", "hr", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });

				//headings
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_1\" id=\"h1BB" + $mainID + "\">H1</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_2\" id=\"h2BB" + $mainID + "\">H2</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_3\" id=\"h3BB" + $mainID + "\">H3</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_4\" id=\"h4BB" + $mainID + "\">H4</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_5\" id=\"h5BB" + $mainID + "\">H5</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_6\" id=\"h6BB" + $mainID + "\">H6</span>");

				$("#h1BB" + $mainID).button({text: false, icons: {primary: "h1BB"}}).click(function () {
					$main.doTag("h1", "h1", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h2BB" + $mainID).button({text: false, icons: {primary: "h2BB"}}).click(function () {
					$main.doTag("h2", "h2", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h3BB" + $mainID).button({text: false, icons: {primary: "h3BB"}}).click(function () {
					$main.doTag("h3", "h3", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h4BB" + $mainID).button({text: false, icons: {primary: "h4BB"}}).click(function () {
					$main.doTag("h4", "h4", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h5BB" + $mainID).button({text: false, icons: {primary: "h5BB"}}).click(function () {
					$main.doTag("h5", "h5", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h6BB" + $mainID).button({text: false, icons: {primary: "h6BB"}}).click(function () {
					$main.doTag("h6", "h6", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function (i) { $(this).not(".ui-button").unbind().remove(); });
			},

			triggerChange: function ($main, mainID, preview) {
				$main.fixReplication(mainID);

				if (preview) { $main.updatePreview(mainID, $main); }
			},

			fixReplication: function (mainID) {
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
			},

			previewBold: function (mainArea, $preVal, $main) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach;
				$splitter		= $preVal.split(/(.*)\[b\](.*)\[\/b\](.*)/g);
				$preContent		= $splitter[1];
				$preElement		= $splitter[2];
				$postContent	= $splitter[3];

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				$("#preRender").html($preContent + "<strong>" + $preElement + "</strong>" + $postContent);
				$ret = $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[b\](.*)\[\/b\]/g)) { $ret = $main.previewBold(mainArea, $ret, $main); }

				return $ret;
			},

			previewItalic: function (mainArea, $preVal, $main) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach;
				$splitter		= $preVal.split(/(.*)\[i\](.*)\[\/i\](.*)/g);
				$preContent		= $splitter[1];
				$preElement		= $splitter[2];
				$postContent	= $splitter[3];

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				$("#preRender").html($preContent + "<em>" + $preElement + "</em>" + $postContent);
				$ret = $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[i\](.*)\[\/i\]/g)) { $ret = $main.previewItalic(mainArea, $ret, $main); }

				return $ret;
			},

			previewUnderline: function (mainArea, $preVal, $main) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach;
				$splitter		= $preVal.split(/(.*)\[u\](.*)\[\/u\](.*)/g);
				$preContent		= $splitter[1];
				$preElement		= $splitter[2];
				$postContent	= $splitter[3];

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				$("#preRender").html($preContent + "<span style=\"border-bottom: 1px dotted\">" + $preElement + "</span>" + $postContent);
				$ret = $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[u\](.*)\[\/u\]/g)) { $ret = $main.previewUnderline(mainArea, $ret, $main); }

				return $ret;
			},

			previewHeader: function (mainArea, $preVal, $main) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach, $hLevel;
				$splitter		= $preVal.split(/(.*)\[h([0-9]+)\](.*)\[\/h([0-9]+)\](.*)/g);
				$preContent		= $splitter[1];
				$hLevel			= $splitter[2];
				$preElement		= $splitter[3];
				$postContent	= $splitter[4];

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);
				$("#preRender").html($preContent + "<h" + $hLevel + ">" + $preElement + "</h" + $hLevel + ">" + $postContent);
				$ret			= $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[h([0-9]+)\](.*)\[\/h([0-9]+)\]/g)) { $ret = $main.previewHeader(mainArea, $ret, $main); }

				return $ret;
			},

			previewYouTube: function (mainArea, $preVal, $main) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach;
				$splitter		= $preVal.split(/(.*)\[youtube\]([a-zA-Z0-9]+)\[\/youtube\](.*)/g);
				$preContent		= $splitter[1];
				$preElement		= $splitter[2];
				$postContent	= $splitter[3];

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				$("#preRender").html($preContent + "<iframe width='120' height='120' src='http://www.youtube/com/embed/" + $preElement + "?theme=light&color=red' frameborder='0' allowfullscreen></iframe>" + $postContent);
				$ret = $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[youtube\]([a-zA-Z0-9]+)\[\/youtube\]/g)) { $ret = $main.previewYouTube(mainArea, $ret, $main); }

				return $ret;
			},

			previewImage: function (mainArea, $preVal, $main, noCaption) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach, $caption, $madeContent;
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

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				if ($caption) {
					$madeContent	= $preContent + "<img src='" + $preElement + "' title='" + $caption + "' /><caption>" + $caption + "</caption>" + $postContent;
				} else {
					$madeContent	= $preContent + "<img src='" + $preElement + "' />" + $postContent;
				}
				$("#preRender").html($madeContent);
				$ret = $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[img=(.*)\](.*)\[\/img\]/g)) { $ret = $main.previewImage(mainArea, $ret, $main, false); }
				if ($ret.match(/\[img\](.*)\[\/img\]/g)) { $ret = $main.previewImage(mainArea, $ret, $main, true); }

				return $ret;
			},

			previewLink: function (mainArea, $preVal, $main, enclosed) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach, $content;
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

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				$("#preRender").html($preContent + "<a href='" + $preElement + "' title='" + $content + "'>" + $content + "</a>" + $postContent);
				$ret = $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[url=("(.*)")\](.*)\[\/url\]/g)) { $ret = $main.previewLink(mainArea, $ret, $main, true); }
				if ($ret.match(/\[url=(.*)\](.*)\[\/url\]/g)) { $ret = $main.previewLink(mainArea, $ret, $main, false); }

				return $ret;
			},

			previewColor: function (mainArea, $preVal, $main, enclosed) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach, $content;
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

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				$("#preRender").html($preContent + "<font color='" + $preElement + "'>" + $content + "</font>" + $postContent);
				$ret = $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[COLOR=("([a-zA-Z0-9\#]+)")\](.*)\[\/COLOR\]/g)) { $ret = $main.previewColor(mainArea, $ret, $main, true); }
				if ($ret.match(/\[color=([a-zA-Z0-9\#]+)\](.*)\[\/color\]/g)) { $ret = $main.previewColor(mainArea, $ret, $main, false); }

				return $ret;
			},

			previewList: function (mainArea, $preVal, $main) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach;
				$splitter		= $preVal.split(/(.*)\[list\](.*)\[\/list\](.*)/g);
				$preContent		= $splitter[1];
				$preElement		= $splitter[2];
				$postContent	= $splitter[3];

				if ($preElement.match(/\[\*\](.*)/g)) { $preElement = $main.previewListItem(mainArea, $preElement, $main); }

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				$("#preRender").html($preContent + "<ul>" + $preElement + "</ul>" + $postContent);
				$ret	= $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[list\](.*)\[\/list\]/g)) { $ret = $main.previewList(mainArea, $ret, $main); }

				return $ret;
			},

			previewListItem: function (mainArea, $preVal, $main) {
				var preRender, $splitter, $preContent, $preElement, $postContent, $ret, preAttach;
				$splitter		= $preVal.split(/(.*)\[\*\](.*)<br>(.*)/g);
				$preContent		= $splitter[1];
				$preElement		= $splitter[2];
				$postContent	= $splitter[3];

				preRender		= document.createElement("div");
				preRender.id	= "preRender";
				preAttach		= document.getElementById(mainArea);
				preAttach.appendChild(preRender);

				//remove extra breaks
				$preElement = $preElement.replace(/<br>/g, "");
				$preContent = $preContent.replace(/<br>/g, "");

				$("#preRender").html($preContent + "<li>" + $preElement + "</li>" + $postContent);
				$ret	= $("#preRender").html();
				$("#preRender").remove();

				if ($ret.match(/\[\*\](.*)<br>/g)) { $ret = $main.previewListItem(mainArea, $ret, $main); }

				return $ret;
			},

			updatePreview: function (mainID, $main) {
				var $content, $preVal, $preview, $preElement1, $preElement2, $preElement3;
				$content		= $("#" + mainID);
				$preVal			= $content.val();
				$preview		= $("#preview_" + mainID);
				$preview.html($preVal);
				$preVal			= $preview.html();
				$preElement1	= false;
				$preElement2	= false;
				$preElement3	= false;

				//if there is actually content
				if ($preVal) {
					//replace new lines
					$preVal		= $preVal.replace(/\n/g, "<br>");
					$preVal		= $preVal.replace(/\r/g, "");

					//hard line replace
					$preVal		= $preVal.replace(/\[hr\]\[\/hr\]/g, "<hr>");

					//list replacement
					if ($preVal.match(/\[list\](.*)\[\/list\]/g)) { $preVal = $main.previewList("preview_" + mainID, $preVal, $main); }

					//bold replace
					if ($preVal.match(/\[b\](.*)\[\/b\]/g)) { $preVal = $main.previewBold("preview_" + mainID, $preVal, $main); }

					//replace italics
					if ($preVal.match(/\[i\](.*)\[\/i\]/g)) { $preVal = $main.previewItalic("preview_" + mainID, $preVal, $main); }

					//replace underline
					if ($preVal.match(/\[u\](.*)\[\/u\]/g)) { $preVal = $main.previewUnderline("preview_" + mainID, $preVal, $main); }

					//replace headers
					if ($preVal.match(/\[h([0-9]+)\](.*)\[\/h([0-9]+)\]/g)) { $preVal = $main.previewHeader("preview_" + mainID, $preVal, $main); }

					//replace youtube
					if ($preVal.match(/\[youtube\]([a-zA-Z0-9]+)\[\/youtube\]/g)) { $preVal = $main.previewYouTube("preview_" + mainID, $preVal, $main); }

					//image replace
					if ($preVal.match(/\[img=(.*)\](.*)\[\/img\]/g)) { $preVal = $main.previewImage("preview_" + mainID, $preVal, $main, false); }
					if ($preVal.match(/\[img\](.*)\[\/img\]/g)) { $preVal = $main.previewImage("preview_" + mainID, $preVal, $main, true); }

					//link replace
					if ($preVal.match(/\[url=("(.*)")\](.*)\[\/url\]/g)) { $preVal = $main.previewLink("preview_" + mainID, $preVal, $main, true); }
					if ($preVal.match(/\[url=(.*)\](.*)\[\/url\]/g)) { $preVal = $main.previewLink("preview_" + mainID, $preVal, $main, false); }

					//color replace
					if ($preVal.match(/\[COLOR=("([a-zA-Z0-9\#]+)")\](.*)\[\/COLOR\]/g)) { $preVal = $main.previewColor("preview_" + mainID, $preVal, $main, true); }
					if ($preVal.match(/\[color=([a-zA-Z0-9\#]+)\](.*)\[\/color\]/g)) { $preVal = $main.previewColor("preview_" + mainID, $preVal, $main, false); }

					//actually insert the new content
					$preview = $("#preview_" + mainID);
					$preview.html($preVal);
				}
			},

			makePreview: function (mainID) {
				$("#bbContainer_" + mainID).append("<div id=\"preview_" + mainID + "\"></div>");
				$preview = $("#preview_" + mainID);
				$preview.css({
					width: "45%",
					float: "left",
					"margin-left": "1%"
				});
				$("#" + mainID + "bbCode").css("width", "100%");
				$("#" + mainID).css("width", "44%");
			},

			doTag: function (tag, tag2, mainID) {
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
			},

			doList: function (mainID) {
				var $mainLen;
				$listItems	= new Array();
				$listNum	= 0;

				$main.doItems();
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
			},

			doMiddle: function (tag, content, mainID) {
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
			},

			doItems: function () {
				var $item = null;
				$item = prompt("List Item, [cancel to stop]");

				if ($item) {
					$listItems[$listNum] = $item;
					$listNum++;
					$main.doItems();
				}
			}
		});
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