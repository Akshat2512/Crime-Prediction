
function Elem_id(e)
{
    return document.getElementById(e);
}
var g;
var k;
function popupWarning(s)
{  
   var e = Elem_id('popup-warning')
   e.style.display = 'flex';
   setTimeout(()=>{e.style.top = '30px';
                   e.style.opacity = '1';}, 20)
   
   e.innerText = s;

   clearTimeout(g)
   clearTimeout(k)

   g = setTimeout(()=>{
    
    e.style.top = '-100px';
    e.style.opacity = '0';
    k = setTimeout(()=>{
      e.innerText = '';
      e.style.display = 'none';}, 1000)
    
   },3000)
}


function fill_account_details(){
    
var x = Elem_id('acc_info').querySelector('select');

country_codes = {
    "Afghanistan": ["+93", 9],
    "Albania": ["+355",10],
    "Bahrain": ["+213", 8],
    "Czech republic": ["+420",9],
    "Ghana": ["+233",9],
    "India": ["+91", 10],
    "Kazakhstan": ["+7",10],
    "Netherlands": ["+31",9],
    "Antigua and Barbuda": ["+1-268",10],
    "Argentina": ["+54",10]
}


codes = Object.entries(country_codes);

codes.forEach(e => { 
    
    if(e[1][0] == Elem_id('ctr_c').innerHTML)
    { 
      x.innerHTML = x.innerHTML+`<option value=["${e[1][0]}","${e[1][1]}"] selected>${e[0]}</option>`;
      Elem_id('ph_no').maxLength = `${e[1][1]}`;
    }
    else
      x.innerHTML = x.innerHTML+`<option value=["${e[1][0]}","${e[1][1]}"]>${e[0]}</option>`;
});


Elem_id('ctr').onchange = ()=>{
    ctr_c = Elem_id('ctr').value;

    ctr_c = JSON.parse(ctr_c)

    Elem_id('ctr_c').innerText = ctr_c[0];

    Elem_id('ph_no').maxLength = `${ctr_c[1]}`;
    Elem_id('ph_no').value = '';
}

}


fill_account_details()


function check_phonenumber(){
  var x = Elem_id('ph_no');

  var ctr_c = Elem_id('ctr').value;
    ctr_c = JSON.parse(ctr_c);

  var pattern = new RegExp(`^(|[0-9]{${ctr_c[1]},})$`);

 var isValid = pattern.test(x.value);

 if(!isValid)
 { 
   return "not valid"
 }
}
function check_ph_no_on_input(){
  var x = Elem_id('ph_no');
  var ctr_c = Elem_id('ctr').value;
    ctr_c = JSON.parse(ctr_c);

  var pattern = new RegExp(`^([0-9]{0,${ctr_c[1]}})$`);

 var isValid = pattern.test(x.value);

 if(!isValid)
 { 
   return "not valid"
 }
}
function check_email(){
  var x = Elem_id('mail_in');
  var pattern = new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})*$');
  var isValid = pattern.test(x.value);
  if(!isValid)
    {
      return "not valid"
    }
 
 }


function edit_account()
{
     
    var x = Elem_id('edit_acc');
    var b = Elem_id('acc_info').querySelectorAll('.grid-container button');
    var i = Elem_id('acc_info').querySelectorAll('.grid-items');
    
    b[0].style.display = 'none';
    b[1].style.display = 'none';
    b[2].style.display = 'block';
    
    var name, f_name, m_name, l_name, age, u_name, email, country, ctr_c, ph_no;
    name = i[1].querySelector('input').value.split(" ");
    f_name = name[0];
    m_name = name[1];
    l_name = name[2];
    age  = i[3].querySelector('input').value
    u_name  = i[5].querySelector('input').value
    email  = i[7].querySelector('input').value
    country =  i[9].querySelector('select').value
    ctr_c = Elem_id('ctr_c').innerText;
    ph_no = i[11].querySelector('input').value

    setTimeout(()=>{
      Elem_id('acc_info').querySelectorAll('input').forEach(e=>{
        e.oninput = ()=>{
          b[0].disabled = false;
        }
      })
      Elem_id('ph_no').oninput = ()=>{
        if(check_ph_no_on_input()=="not valid")
          Elem_id('ph_no').value = Elem_id('ph_no').value.slice(0,-1);
           b[0].disabled = false;
      }
      
    },1000)
    
    Elem_id('mail_in').onblur = ()=>{
      if(check_email() == 'not valid')
        popupWarning('Email not valid!!')
    }
    Elem_id('ph_no').onblur = ()=>{
      if(check_phonenumber() == 'not valid')
        popupWarning('Phone Number not valid!!')
    }
    
  

    x.onclick = ()=>{
       
        var k = i[1].querySelectorAll('input');
        k[0].value = f_name;
        k[1].value = m_name;
        k[2].value = l_name;
        Elem_id('acc_info').querySelectorAll('input, select').forEach(e=>{
            e.disabled = false;
            e.style.cssText=  `background-color: #454545;`
        })

        i[1].style.cssText = 'height: 60px;';
        Elem_id('account').style.cssText='height:450px;width:400px;';
      
          k[0].focus();
       
          k[1].style.cssText = 'opacity:1;background-color: #454545;';
          k[2].style.cssText = 'opacity:1;background-color: #454545;';

        x.style.cssText = 'display:none';
        b[0].style.display = 'block';
        b[1].style.display = 'block';
        b[2].style.display = 'none';

        b[0].onclick = async ()=>{
            
            var mail = check_email()
            var phno  = check_phonenumber()

            if(k[0].value == '')
            {
              popupWarning("First name can't be empty!!");
              return false;
            }
            if(mail == "not valid")
            {popupWarning('Email not valid');
                 return false;}
            if(phno == "not valid")
            {popupWarning('Phone number not valid');
                 return false;}
     
             fetch('/update',{
                  method: "POST",
                  headers:{"Content-Type" :"application/json"},
                  body: JSON.stringify(account_set())
                }).then(response=>response.text()).then(data=>{
                  if(data == "Success")
                    { 
                      popupWarning('Data successfully Updated!!!')
                      disable_acc_page()
                      acc_page_user_update(k[0])
                      cancel() 
                    }

                  else if(data = "uname exists")
                      popupWarning('failed !!! Username already exists')
                      b[0].disabled = false;

                }).catch(error=>popupWarning(error));
        }

        b[1].onclick = ()=>{
          b[0].disabled = true;
           cancel()
           disable_acc_page()
        }
  }

    function cancel()
    {
       Elem_id('fname').value = f_name + " " + m_name +" "+ l_name;
       Elem_id('mname').value = m_name 
       Elem_id('lname').value = l_name 
       i[3].querySelector('input').value = age    
       i[5].querySelector('input').value = u_name.toLowerCase() 
       i[7].querySelector('input').value = email  
       i[9].querySelector('select').value = country
       Elem_id('ctr_c').innerText = ctr_c
       i[11].querySelector('input').value = ph_no  
    }

    async function check_user(user)
    {  
       var response = await fetch('/check_user',{
              method: "POST",
              headers:{"Content-Type" :"application/json"},
              body:JSON.stringify(user)
              });
          data = await response.text()
      
          return data;
    }

    function disable_acc_page(){
      x.style.cssText = 'display:block';
       
      Elem_id('acc_info').querySelectorAll('input, select').forEach(e=>{
          e.disabled = true;
          e.style.cssText=  `background-color: #45454569;`;
      })

      Elem_id('ph_no').style.cssText=`background-color: #45454569;`;
      var s = Elem_id('acc_info').querySelector('.grid-items:nth-child(2)');
      s.style.cssText = 'height: 20px;';

      Elem_id('account').style.cssText='height:400px;width:400px;';

      s = s.querySelectorAll('input');

      s[1].style.cssText = 'opacity:0;background-color: #45454569;';
      s[2].style.cssText = 'opacity:0;background-color: #45454569;';

      b[0].style.display = 'none';
      b[1].style.display = 'none';
      b[2].style.display = 'block';
    }

    function acc_page_user_update(k){
      f_name = Elem_id('fname').value;
      m_name = Elem_id('mname').value;
      l_name = Elem_id('lname').value;
      age  = i[3].querySelector('input').value
      old_un = u_name
      u_name  = i[5].querySelector('input').value.toLowerCase()
      u_name = u_name.replaceAll(" ", "")
     
      email  = i[7].querySelector('input').value
      country =  i[9].querySelector('select').value
      ctr_c = Elem_id('ctr_c').innerText
      ph_no = i[11].querySelector('input').value
      k.value = f_name+" "+m_name+" "+l_name
    }

   function account_set(){
        var f_name = Elem_id('fname').value;
        var m_name = Elem_id('mname').value;
        var l_name = Elem_id('lname').value;
        var age  = i[3].querySelector('input').value
        var old_un = u_name
        var uname  = i[5].querySelector('input').value.toLowerCase()
        uname = uname.replaceAll(" ", "")
      
        var email  = i[7].querySelector('input').value
        email = email.replaceAll(" ", "");
        var ctr_c = Elem_id('ctr_c').innerText;
        var ph_no = i[11].querySelector('input').value
        
        jsn = {'old_uname': old_un, 'data':{'first_name':f_name,'middle_name':m_name,'last_name':l_name, 'age': age, 'username': uname, 'email': email, 'country':ctr_c, 'phone':ph_no}}
       
        return jsn;
    }

    display_account();
 
}

edit_account()

function display_account()
{
  Elem_id('user-icon').onclick = () => {
       show_account();
  }
  Elem_id('hide_2').onclick = () => {
       hide_account();
  }
}

function hide_account()
{
   Elem_id('hide_2').style.display = 'none';
   Elem_id('account').style.cssText = 'opacity:0; width:0px';
   Elem_id('user-icon').style.cssText = 'transform: scale(1.5);'
   Elem_id('account-container').style.cssText = 'right: 30px; top:30px;'
}

function show_account()
{
  Elem_id('hide_2').style.display = 'block';
  Elem_id('account').style.cssText = 'opacity:1; width:400px; overflow:hidden';
  Elem_id('user-icon').style.cssText = 'transform: scale(5);'
  Elem_id('account-container').style.cssText = 'right: 30px; top:50px;'

}