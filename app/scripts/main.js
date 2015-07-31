// jshint devel:true
/**
 * Created by paulmakarov on 6/20/15.
 */
(function () {
    "use strict";
    var __site = "food";
    var __limit = 100;
    var __total = 0;
    var __currentPage = 0;
    var __startPage = "";
    var __questions = [];
    var __score = 0;


    $('#startQuizBtn').on("click", function (event) {
        __site = "food";
        $.publish(event, 'start.quiz', [event]);
    });


    $.subscribe('start.quiz', this, function (event, data) {
		beginGame();
    });

    $.subscribe('questions.loaded', this, function (event, data) {
    	console.log("Questions Loaded...");
    	__questions = data;
    	__total = __questions.length;

    	$.each(__questions, function (i, item) {
    		console.log(__questions[i].primary_range + " : " + __questions[i].designation + " : " + __questions[i].street + " : " + __questions[i].crid);
    	});

    });

    $.subscribe('evaluate.question', this, function (event, data) {
    	//console.log(data['answer'] + " ? " + data['question'].crid);
    	if (data['answer'] == data['question'].crid) {
    		
    		__score++;
    		$('.flash').removeClass("alert-danger").addClass("alert-success");
		    $(".flash #message").empty().html("Correct!");
		    $('.flash').fadeIn(500).delay(500).fadeOut(500);
    	}
    	else {
    		$('.flash').removeClass("alert-success").addClass("alert-danger");
		    $(".flash #message").empty().html("Incorrect! Correct answer was: " + data['question'].crid);
		    $('.flash').fadeIn(500).delay(500).fadeOut(500);
    	}

    	data['question']['user_answer'] = data['answer'];
    	console.log(__questions[__currentPage]);
    	__currentPage += 1;
       	$(".jumbotron").html(handleNextStep(__currentPage));
       	initializeQuizEvents();

    });
    //$.publish(event, 'paginator.changed', [num]);

    function beginGame() {
    	console.log("Start the Quiz");
    	__currentPage = 0;
       __startPage = $(".jumbotron").html();
       if(__questions.length > 0) {
       	
       		$(".jumbotron").html(handleNextStep(__currentPage));
       		initializeQuizEvents();
       }
    }

    function handleNextStep(__currentPage) {
    	//TODO if __currentPage >= __total -> return Summary Screen!
    	console.log(__currentPage + " : "  + __total);
    	if(__currentPage >= __total) {
    		var summaryTable  = '<div class="container"><div class=""><div class="pull-right" id="scoreCounter"><h4>Score: ' + ((__score/__total)*100) + '%</h4></div></div></div>';
    		summaryTable += '<div class="table-responsive"><table class="table table-condensed table-bordered table-striped">';
    		summaryTable += '<tr><th></th><th>primary_range</th><th>designation</th><th>street</th><th>crid</th><th>user_answer</th></tr>';
    		$.each(__questions, function (i, item) {
    			summaryTable += (__questions[i].crid  !=  __questions[i].user_answer) ? '<tr class="danger"><td><span class="glyphicon glyphicon-remove"></span></td>' : '<tr class="success"><td><span class="glyphicon glyphicon-ok"></span></td>';
    			summaryTable += '<td>'+__questions[i].primary_range + "</td><td> " + __questions[i].designation + "</td><td>" + __questions[i].street + "</td><td>" + __questions[i].crid + "</td><td>" + __questions[i].user_answer + "</td></tr>";
    		});
			summaryTable += "</table></div>";

    		return summaryTable + '<div class="container"><div class="row" style="margin-top:30px"><button id="startOverBtn" class="btn btn-success" style="width:50%">Play Again?</button></div></div>';
    	}
    	var quizScreen = '<div class="container"><div class=""><div class="pull-left"><h4>Question: '+ (__currentPage+1) + '/' +__total+'</h4></div><div class="pull-right" id="scoreCounter"><h4>Score: ' + __score + '</h4></div></div>';
       		quizScreen += '<hr/><table class="table table-condensed table-bordered table-striped"><tr><th>primary_range</th><th>designation</th><th>street</th></tr>';
       		quizScreen += '<tr><td>'+ __questions[__currentPage].primary_range + '</td><td>' + __questions[__currentPage].designation +
       						'</td><td>'+ __questions[__currentPage].street + '</td></tr></table>';
       		quizScreen += '<div class="row"><input class="text-center" name="crid" id="crid" placeholder="CRID"/></div>';
       		quizScreen += '<div class="row" style="margin-top:30px"><button class="btn btn-success" id="goBtn" style="width:50%">Go</button></div></div>';

       	return quizScreen;
    }
    function initializeQuizEvents() {
    	$("#crid").focus();
    	$('#crid').keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				$("#goBtn").click();
			}
			event.stopPropagation();
		});
    	$('#goBtn').on("click", function (event) {

    		if($("#crid").val() === "") {
    			//TODO: Show Flash Message 
    			$('.flash').removeClass("alert-success").addClass("alert-danger");
		        $(".flash #message").html("You didn't enter a value!");
		        $('.flash').fadeIn(500).delay(2000).fadeOut(500);
    			return;
    		}
	    	var data = {
	    		'question' : __questions[__currentPage],
	    		'answer' : $("#crid").val(),
	    	};

	    	 
	    	$.publish(event, 'evaluate.question', [data]);
	    });

	    $('#startOverBtn').on("click", function (event) {
	    	beginGame();
	    });
    }

})();
