//Preloading animation.
document.onreadystatechange = function (){
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementById('contents').style.visibility="hidden";
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         document.getElementById('contents').style.visibility="visible";
      },1000);
  }
}
$(document).ready(function(){
  $("#sell-tab").on("click",function(){
      $("#sell-tab").css("color","green");
      $("#orders-tab").css("color","black");
      $("#primary-info-tab").css("color","black");
      $("#primary-info").css("display","none");
      $("#orders").css("display","none");
      $("#sell").css("display","inline");
  });

  $("#primary-info-tab").on("click",function(){
      $("#primary-info-tab").css("color","green");
      $("#orders-tab").css("color","black");
      $("#sell-tab").css("color","black");
      $("#orders").css("display","none");
      $("#sell").css("display","none");
      $("#primary-info").css("display","inline");
  });

  $("#orders-tab").on("click",function(){
      $("#orders-tab").css("color","green");
      $("#sell-tab").css("color","black");
      $("#primary-info-tab").css("color","black");
      $("#sell").css("display","none");
      $("#primary-info").css("display","none");
      $("#orders").css("display","inline");
  });
 
});

