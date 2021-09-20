$("#logout").on("click", async () => {
  try {
    const res = await $.ajax({
      url: "/user/logout",
      type: "POST",
    });
    if (res.status === 200) {
      delete_cookie("cookie");
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
  }
});

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function delete_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

async function search() {
  try {
    const search = $("#search").val();
    const res = await $.ajax({
      type: "GET",
      url: "/productCode/search?search=" + search,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
function notification(
  prepend_class = null,
  status = 200,
  action = null,
  delay = 5000
) {
  if (prepend_class != null && status != null && action != null) {
    let notif_class = "";
    if (status == 200) {
      notif_class = "success";
    } else if (status == 500) {
      notif_class = "error";
    } else {
      notif_class = "warning";
    }

    let id = Date.now();
    let notif = `<div class="notification notification--${notif_class}" id="notif-${id}">${action}</div>`;

    $(prepend_class).prepend(notif);
    $("#notif-" + id)
      .delay(delay)
      .fadeOut();

    setTimeout(function () {
      $("#notif-" + id).remove();
    }, delay + 1000);
  }
}
