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
      notification(".container", res.status, res.message);

      setTimeout(function(){
        window.location.href = "/";
      }, 2000);
      
    }else{
      notification(".container", res.status, res.message);
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