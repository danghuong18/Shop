$("#login").on("click", async () => {
  try {
    const username = $("#username").val();
    const password = $("#password").val();
    const res = await $.ajax({
      type: "POST",
      url: "/user/login",
      data: { username, password },
    });
    if (res.status === 200) {
      setCookie("cookie", res.token, 30);
      window.location.href = "/";
    } else {
      $(".noti").html(res.mess);
    }
  } catch (error) {
    console.log(error);
  }
});

$.ajax({
  url: "/user/checkLogin",
  type: "POST",
})
  .then((data) => {
    if (data.status === 200) {
      window.location.href = "/";
    }
  })
  .catch((err) => {
    console.log(err);
  });

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
