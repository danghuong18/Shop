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
        }
      });
  
      if (res.status == 200) {
        notification(".container__login", res.status, res.message);
  
        setTimeout(function(){
          window.location.href = "/login";
        }, 2000);
        
      }else{
        notification(".container__login", res.status, res.message);
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