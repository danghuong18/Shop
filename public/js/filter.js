$('.brand').on('click', async (event)=>{
  let currentUrl = window.location.href
  if(event.target.checked){
    if(currentUrl.indexOf('brand') === -1){
      window.location.href = 'http://localhost:3000/filter?brand='+event.target.value
    }else{
      let listBrand = currentUrl.split('brand=')
      listBrand[1] = event.target.value+',' + listBrand[1] 
      window.location.href = listBrand.join('brand=')
    }
  }else{
    if(currentUrl.indexOf(event.target.value+',') === -1){
      let removedURL = currentUrl.replace(event.target.value,'')
      window.location.href = removedURL
    }else{
      let removedURL = currentUrl.replace(event.target.value+',','')
      window.location.href = removedURL
    }
    
  }


})