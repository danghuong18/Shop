$('#login-form').on('submit', () => {
  return false;
});

$(".login-button").on("click", async () => {
  try {
    const username = $("#username").val();
    const password = $("#password").val();
    const res = await $.ajax({
      type: "POST",
      url: "/user/login",
      data: { username, password }
    });

    if (res.status == 200) {
      setCookie("cookie", res.token, 30);
      notification(".container__login", res.status, res.message);

      setTimeout(function(){
        window.location.href = "/";
      }, 2000);
      
    }else{
      notification(".container__login", res.status, res.message);
    }
  } catch (error) {
    console.log(error);
  }
});

$.ajax({
  url: "/user/checkLogin",
  type: "POST",
}).then((data) => {
  if (data.status == 200) {
    window.location.href = "/";
  }
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function notification(prepend_class=null, status=200, action=null, delay=5000){
  if(prepend_class!=null && status!=null && action!=null ){
      let notif_class = "";
      if(status == 200) {
          notif_class = "success";
      }else if(status == 500){
          notif_class = "error";
      }else {
          notif_class = "warning";
      }

      let id = Date.now();
      let notif = `<div class="notification notification--${notif_class}" id="notif-${id}">${action}</div>`;

      $(prepend_class).prepend(notif);
      $("#notif-" + id).delay(delay).fadeOut();

      setTimeout(function(){
          $("#notif-" + id).remove();
      }, delay + 1000);
  }
}