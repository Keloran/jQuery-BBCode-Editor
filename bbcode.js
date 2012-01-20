//jquery version
if (jQuery) {
	//if (jQuery.isFunction($(this).button) == false) {
	//	alert("jQuery UI needed for the BBCode editor to work");
	//}

	(function($) {
		$.fn.extend({
			bbCode: function(options) {
				var main, $bbCode, $html, $bbCodeID, $mainID, $ret, $item, $listNum, $listItems, $bbCounter;
				var $backOptions = options;

				var settings = $.extend({
					"counter":	false,
					"preview":	false
				}, options);

				$main		= $(this);
				$bbCodeID	= "#" + $(this).attr("id") + "bbCode";
				if (!$($bbCodeID).attr("id")) { $main.makeContainer($(this).attr("id"), $backOptions); }

				$mainID		= $(this).attr("id");
				$mainObj	= document.getElementById($mainID);
				$bbCode		= $($bbCodeID);

				$main.makeButtons($mainID, $main, $bbCode);

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
				$("#"+ $mainID).keyup(function() { $main.triggerChange($main, $mainID, settings.preview); });
			},

			makeContainer: function(mainID, $backOptions) {
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

			makeButtons: function(mainID, $main, $bbCode) {
				$mainID = $("#" + mainID);

				//bold
				$bbCode.append("<span class=\"bbCodeButton sprite_text_bold\" id=\"bold" + $mainID + "\">Bold</span>");
				$("#bold" + $mainID).button({text: false, icons: {primary: "boldBB"}}).click(function() {
					$main.doTag("b", "b", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				//italic
				$bbCode.append("<span class=\"bbCodeButton sprite_text_italic\" id=\"italic" + $mainID + "\">Italic</span>");
				$("#italic" + $mainID).button({text: false, icons: {primary: "italicBB"}}).click(function() {
					$main.doTag("i", "i", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				//underline
				$bbCode.append("<span class=\"bbCodeButton sprite_text_underline\" id=\"underline" + $mainID + "\">Underline</span>");
				$("#underline" + $mainID).button({text: false, icons: {primary: "underlineBB"}}).click(function() {
					$main.doTag("u", "u", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				$bbCode.append("<span class=\"bbCodeButton sprite_style\" id=\"colorBB" + $mainID + "\">Color</span>");
				$("#colorBB" + $mainID).button({text: false, icons: {primary: "colorBB"}}).click(function() {
					$ret = prompt("Enter Color: ", "CECECE");
					if ($ret) { $main.doTag("color=#" + $ret, "color", $mainID); }
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				//link
				$bbCode.append("<span class=\"bbCodeButton sprite_link\" id=\"linkBB" + $mainID + "\">Link</span>");
				$("#linkBB" + $mainID).button({text: false, icons: {primary: "linkBB"}}).click(function() {
					$ret = prompt("Enter URL:", "http://www.tester.com");
					if ($ret) { $main.doTag("url=" + $ret, "url", $mainID); }
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				//image
				$bbCode.append("<span class=\"bbCodeButton sprite_picture\" id=\"imageBB" + $mainID + "\">Image</span>");
				$("#imageBB" + $mainID).button({text: false, icons: {primary: "imageBB"}}).click(function() {
					$ret = prompt("Enter Image URL:", "http://images.google.com");
					if ($ret) {	$main.doTag("img=" + $ret, "img", $mainID); }
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				//youtube
				$bbCode.append("<span class=\"bbCodeButton sprite_video\" id=\"videoBB" + $mainID + "\">Youtube</span>");
				$("#videoBB" + $mainID).button({text: false, icons: {primary: "videoBB"}}).click(function() {
					$ret = prompt("Enter youtube ID:", "PkypXn5S4Rg");
					$main.doMiddle("youtube", $ret, $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				//List
				$bbCode.append("<span class=\"bbCodeButton sprite_text_list_bullets\" id=\"listBB" + $mainID + "\">List</span>");
				$("#listBB" + $mainID).button({text: false, icons: {primary: "listBB"}}).click(function() {
					$main.doList($mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				//break
				$bbCode.append("<br />");

				//hr
				$bbCode.append("<span class=\"bbCodeButton sprite_text_horizontalrule\" id=\"hrBB" + $mainID + "\">HR</span>");
				$("#hrBB" + $mainID).button({text: false, icons: {primary: "hrBB"}}).click(function() {
					$main.doTag("hr", "hr", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });

				//headings
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_1\" id=\"h1BB" + $mainID + "\">H1</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_2\" id=\"h2BB" + $mainID + "\">H2</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_3\" id=\"h3BB" + $mainID + "\">H3</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_4\" id=\"h4BB" + $mainID + "\">H4</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_5\" id=\"h5BB" + $mainID + "\">H5</span>");
				$bbCode.append("<span class=\"bbCodeButton sprite_text_heading_6\" id=\"h6BB" + $mainID + "\">H6</span>");

				$("#h1BB" + $mainID).button({text: false, icons: {primary: "h1BB"}}).click(function() {
					$main.doTag("h1", "h1", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h2BB" + $mainID).button({text: false, icons: {primary: "h2BB"}}).click(function() {
					$main.doTag("h2", "h2", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h3BB" + $mainID).button({text: false, icons: {primary: "h3BB"}}).click(function() {
					$main.doTag("h3", "h3", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h4BB" + $mainID).button({text: false, icons: {primary: "h4BB"}}).click(function() {
					$main.doTag("h4", "h4", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h5BB" + $mainID).button({text: false, icons: {primary: "h5BB"}}).click(function() {
					$main.doTag("h5", "h5", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$("#h6BB" + $mainID).button({text: false, icons: {primary: "h6BB"}}).click(function() {
					$main.doTag("h6", "h6", $mainID);
					$main.triggerChange($main, $mainID, settings.preview);
				});
				$(".bbCodeButton").each(function(i) { $(this).not(".ui-button").unbind().remove(); });
			},

			triggerChange: function($main, mainID, preview) {
				$main.fixReplication(mainID);

				if (preview) { $main.updatePreview(mainID); }
			},

			fixReplication: function(mainID) {
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

			previewBold: function(mainArea, preContent, content, postContent) {
				preRender		= document.createElement("div");
    			preRender.id	= "preRender";

    			preAttach 		= document.getElementById(mainArea);
    			preAttach.appendChild(preRender);

   				$("#preRender").html(preContent + "<b>" + content + "</b>" + postContent);
   				$ret = $("#preRender").html();
   				$("#preRender").remove();
   				return $ret;
			},

			updatePreview: function(mainID) {
				$content 		= $("#" + mainID);
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
					$preVal		= $preVal.replace(/\n/g, "<br />");

					//bold replace
					if ($preVal.match(/\[b\](.*)\[\/b\]/g)) {
            			$splitter = $preVal.split(/(.*)\[b\](.*)\[\/b\](.*)/g);
            			$preContent = $splitter[1];
            			$preElement = $splitter[2];
            			$postContent = $splitter[3];
            			$preVal = $main.previewBold("preview_" + mainID, $preContent, $preElement, $postContent);
					}

					//list replacement
					$preVal		= $preVal.replace(/\[list\]/g, "<ul>");
					$preVal		= $preVal.replace(/\[\/list\]/g, "</ul>");
					$preVal		= $preVal.replace(/\[\*\](.*)\n/g, "<li>$1</li>");

					//replace bold
					$preVal		= $preVal.replace(/\[b\](.*)\[\/b\]/g, "<strong>$1</strong>");

					//replace italics
					$preVal		= $preVal.replace(/\[i\](.*)\[\/i\]/g, "<em>$1</em>");

					//replace underline
					$preVal		= $preVal.replace(/\[u\](.*)\[\/u\]/g, "<span style='border-bottom: 1px dotted'>$1</span>");

					//replace headers
					$preVal		= $preVal.replace(/\[h([0-9]+)\](.*)\[\/h([0-9]+)\]/g, "<h$1>$2</h$1>");

					//replace youtube
					$preVal		= $preVal.replace(/\[youtube\]([a-zA-Z0-9]+)\[\/youtube\]/g, "<iframe width='120' height='120' src='http://www.youtube.com/embed/$1?theme=light&color=red' frameborder='0' allowfullscreen></iframe>");

					//image replace
					$preVal		= $preVal.replace(/\[img=(.*)\](.*)\[\/img\]/g, "<img src='$1' title='$2' /><caption>\2</caption>");
					$preVal		= $preVal.replace(/\[img\](.*)\[\/img\]/g, "<img src='$1' title='$2' /><caption>\2</caption>");

					//link replace
					$preVal		= $preVal.replace(/\[url=("([a-zA-Z0-9\:\/\.\?\=\-]+)")\](.*)\[\/url\]/g, "<a href='$2' title='$3'>$3</a>");
					$preVal		= $preVal.replace(/\[url=(.*)\](.*)\[\/url\]/g, "<a href='$1' title='$2'>$2</a>");

					//hard line replace
					$preVal		= $preVal.replace(/\[hr\]\[\/hr\]/g, "<hr />");

					//color replace
					$preVal		= $preVal.replace(/\[COLOR=("([a-zA-Z0-9\#]+)")\](.*)\[\/COLOR\]/g, "<font color='$2'>$3</font>");
					$preVal		= $preVal.replace(/\[color=([a-zA-Z0-9\#]+)\](.*)\[\/color\]/g, "<font color='$1'>$2</font>");

					//actually insert the new content
					$preview = $("#preview_" + mainID);
					$preview.html($preVal);
				}
			},

			makePreview: function(mainID) {
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

			doTag: function(tag, tag2, mainID) {
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

			doList: function(mainID) {
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

			doMiddle: function(tag, content, mainID) {
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

			doItems: function() {
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