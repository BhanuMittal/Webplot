function ScriptUi() {
	this.currInput = 0;
	this.lineColors = {"#FF0000" : -1, "#0000FF" : -1, "#00FF00" : -1, "#FF00FF" : -1, "#00FFFF" : -1,
		"#000000" : -1, "#990000" : -1, "#000099" : -1, "#009900" : -1, "#999900" : -1, "#990099" : -1, "#009999" : -1};
	this.lineSettings = {0 : {color : "#FF0000"}};
	this.currtool = "pointer";
	this.currEq = 0;
	this.gridlines = "normal";
	this.settings = {};
	
	this.setGraphQuality = function(q) {
		$("#quality_select a").removeClass("option_selected");
		q2 = String(q).replace(".", "");
		$("#quality_select_"+q2).addClass("option_selected");

		script_calc.quality = q;
		script_calc.draw();
	}

	this.setGraphAngles = function(q) {
		$("#angle_select a").removeClass("option_selected");
		$("#angle_select_"+q).addClass("option_selected");

		ScriptCalc.angles = q;
		script_calc.draw();
	}

	this.selectGraphEquation = function(x) {
		this.currEq = x;
		$("#graph_inputs div.graph_input_wrapper").removeClass("active_equation");
		$("#graph_input_wrapper_"+x).addClass("active_equation");
		script_calc.draw();
	}

	this.setGraphTool = function(t) {
		$("#toolkit_select a").removeClass("toolbar_selected");
		$("#toolkit_select_"+t).addClass("toolbar_selected");
		
		//Toolbox
		$(".gr_toolkit").hide();
		$("#gr_toolkit_"+t).show();
		$("#gr_toolkit_"+t).css("top", $("#toolkit_select_"+t).offset().top - 23);
		$("#gr_toolkit_"+t).css("right", $(document).width() - $("#toolkit_select_"+t).offset().left + 5);
		
		this.currtool = t;
		script_calc.draw();
	}
	
	this.doTrace = function(xval) {
		script_calc.draw();
		script_calc.drawGraphTrace(script_calc.getGraphEquation(this.currEq), "#000000", xval);
	}

	this.setGraphGridlines = function(t) {
		$("#gridlines_select a").removeClass("option_selected");
		$("#gridlines_select_"+t).addClass("option_selected");

		this.gridlines = t;
		script_calc.draw();
	}

	this.hideGraphSidebar = function() {
		$("#sidewrapper").hide();
		$("#hideSidebar").hide();
		$("#showSidebar").show();
		$("#toolbar").css("right", "0px");
		script_calc.resizeGraph($("#wrapper").width() - widthPlusPadding("#toolbar"), $("#wrapper").height());
		
		this.setGraphTool(this.currtool);
	}

	this.showGraphSidebar = function() {
		$("#sidewrapper").show();
		$("#hideSidebar").show();
		$("#showSidebar").hide();
		$("#toolbar").css("right", "252px");
		script_calc.resizeGraph($("#wrapper").width() - $("#sidewrapper").width() - widthPlusPadding("#toolbar"), $("#wrapper").height());
		
		this.setGraphTool(this.currtool);
	}
	
	this.updateInputData = function() {
		script_calc.lines = [];
		$("#graph_inputs div.graph_input_wrapper").each(function() {
			script_calc.lines.push({equation : $("input", this).val(), color : $(".graph_color_indicator", this).css('backgroundColor')});
		});
	}

	this.evaluate = function() {
		this.updateInputData();
		script_calc.draw();
		this.refreshGraphInputs();
	}

	this.findAvailableColor = function() {
		for(var color in this.lineColors) {
			if(this.lineColors[color] == -1)
				return color;
		}
	}
	
	//Update gui values
	this.updateGraphValues = function() {
		$("input.script_calc_xmin").val(Math.round(script_calc.currCoord.x1 * 1000) / 1000);
		$("input.script_calc_xmax").val(Math.round(script_calc.currCoord.x2 * 1000) / 1000);
		$("input.script_calc_ymin").val(Math.round(script_calc.currCoord.y1 * 1000) / 1000);
		$("input.script_calc_ymax").val(Math.round(script_calc.currCoord.y2 * 1000) / 1000);
	}

	this.addGraphInput = function() {
		this.updateInputData();
		var newcolor = this.findAvailableColor();
		this.lineColors[newcolor] = this.currInput;
		script_calc.lines.push({
			equation: "",
			color: newcolor
		});
		this.currInput++;
		this.refreshGraphInputs();
	}
	
	this.refreshGraphInputs = function() {
		var equations = script_calc.lines;
		
		$("#graph_inputs").html("");
		for(i in equations) {
			$("#graph_inputs").append("<div id=\"graph_input_wrapper_"+i+"\" class=\"graph_input_wrapper\">"+
				"<div class=\"graph_color_indicator\" id=\"graph_color_indicator_"+i+"\"></div>"+
				"<div class=\"graph_equation_display\"><span>y =</span><input id=\"graph_input_"+i+"\" size=\"20\" value=\""+equations[i].equation+"\"/></div></div>");
			$("#graph_color_indicator_"+i).css("backgroundColor", equations[i].color);
			this.lineColors[equations[i].color] = i;
		}
		
		$("#graph_inputs div.graph_input_wrapper").each(function() {
			$(this).bind("click", function() {
				var id = $(this).attr("id");
				var num = String(id).replace("graph_input_wrapper_", "");
				script_ui.selectGraphEquation(num);
			});
		});
		
		this.currInput = i + 1;
		
		$("#graph_input_wrapper_"+this.currEq).addClass("active_equation");
	}
	

}

script_ui = new ScriptUi;

$(document).ready(function() {
	script_ui.addGraphInput();
	$(".gr_toolkit_close a").click(function() {
		$(".gr_toolkit").hide();
	})
	
	document.body.onselectstart = function () { return false; }
});
