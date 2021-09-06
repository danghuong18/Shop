$('#logon-form').on('submit', () => {
  return false;
});

$(".logon-button").on("click", async () => {
  try {
    let username = $(".username").val();
    let password = $(".password").val();
    let fullName = $(".full-name").val();
    let email = $(".email").val();
    let phone = $(".phone").val();
    let gender = $(".gender").val();
    if(username != "" && username != undefined && password != "" && password != undefined
    && fullName != "" && fullName != undefined && email != "" && email != undefined
    && phone != "" && phone != undefined){
      const res = await $.ajax({
        url: "/user",
        type: "POST",
        data: {
          username: username,
          password: password,
          fullName: fullName,
          email: email,
          phone: phone,
          gender: gender,
        },
      });
  
      if (res.status == 200) {
        notification(".login", res.status, res.message);
  
        setTimeout(function(){
          window.location.href = "/login";
        }, 2000);
        
      }else{
        notification(".login", res.status, res.message);
      }
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
      let notif = `<div class="notification notification-${notif_class}" id="notif-${id}">${action}</div>`;

      $(prepend_class).prepend(notif);
      $("#notif-" + id).delay(delay).fadeOut();

      setTimeout(function(){
          $("#notif-" + id).remove();
      }, delay + 1000);
  }
}