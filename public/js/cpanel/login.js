$(".button").on("click", async () => {
    try {
        const username = $(".username").val();
        const password = $(".password").val();
        const res = await $.ajax({
          type: "POST",
          url: "/user/loginCpanel",
          data: { username, password },
        });

        if (res.status == 200) {
          setCookie("cookie", res.data.token, 30);
          setCookie("cpanel", res.data.cpanel, 30);

          notification("#login-form", res.status, res.message);

          setTimeout(function(){
            location.reload();
          }, 4000);

        } else {
            notification("#login-form", res.status, res.message);
        }
    } catch (error) {
        console.log(error);
    }
});

$("#access-cpanel").on("click", function(){
    $.ajax({
        url: "/user/accessCpanel",
        type: "POST"
    }).then((data)=>{
        if (data.status == 200) {
            setCookie("cpanel", data.cpanel, 30);
            location.reload();
        } else {
            console.log(data);
        }
    });
});
  
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}