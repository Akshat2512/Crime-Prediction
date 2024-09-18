
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

function select_page(){
    var x = Elem_id('select-page').querySelectorAll('a');
    x[0].style.display = 'none';
    x[0].onclick =()=>{
        Elem_id('login-form').style.display = 'block';
        Elem_id('pwd-form').style.display = 'none';
        Elem_id('creacc-form').style.display = 'none';
        x[0].style.display = 'none';
        x[1].style.display = 'inline';
        x[2].style.display = 'inline';
    }

    x[1].onclick =()=>{
        Elem_id('login-form').style.display = 'none';
        Elem_id('pwd-form').style.display = 'block';
        Elem_id('creacc-form').style.display = 'none';
        x[0].style.display = 'inline';
        x[1].style.display = 'none';
        x[2].style.display = 'inline';
        change_password();
    }

    x[2].onclick =()=>{
        Elem_id('login-form').style.display = 'none';
        Elem_id('pwd-form').style.display = 'none';
        Elem_id('creacc-form').style.display = 'block';
        x[0].style.display = 'inline';
        x[1].style.display = 'inline';
        x[2].style.display = 'none';
        create_account();
    }
}

select_page();


function fill_account_details(){
    
var x = Elem_id('acc-content').querySelector('select');

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

var int_usr;
function check_user(user)
 {  
    clearTimeout(int_usr);
    int_usr = setTimeout(async() => {
      var response = await fetch('/check_user',{
        method: "POST",
        headers:{"Content-Type" :"application/json"},
        body:JSON.stringify(user)
        });
    data = await response.text()
    if(data == 'not exist')
     {
      Elem_id('chk_usr').style.cssText='background-color: green';
      Elem_id('acc-content').querySelector('button').disabled=false; 
     }
     else if(data == 'exist'){
      Elem_id('chk_usr').style.cssText='background-color: red';
      Elem_id('acc-content').querySelector('button').disabled=true; 
      popupWarning('Username already exists!!')
     
     }
    }, 1000);
  
 }


function create_account()
{
     
    var x = Elem_id('select-page').querySelectorAll('a');
    var b = Elem_id('acc-content').querySelector('button');
    

    setTimeout(()=>{
      Elem_id('ph_no').oninput = ()=>{
        if(check_ph_no_on_input()=="not valid")
          Elem_id('ph_no').value = Elem_id('ph_no').value.slice(0,-1);
      }
      Elem_id('uname2').oninput = async()=>{
        var user = Elem_id('uname2').value;
        console.log(user);
        if(user.length < 6 )
        {
            Elem_id('chk_usr').style.cssText='background-color: red';
        }
       else if(user.length >= 6 ){ 
          check_user(user)
          Elem_id('chk_usr').style.cssText='background-color: green';
          b.disabled = false;
         }
        else{
          Elem_id('chk_usr').style.cssText='background-color: red';
         }
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
    Elem_id('uname2').onblur = async()=>{
        var user = Elem_id('uname2').value;
        if(user.length < 6 )
        {
           popupWarning("Username's length must be of 6 or more characters")
        }
       
      }
    
    b.onclick = async (e)=>{
        b.disabled = true;
        var mail = check_email()
        var phno  = check_phonenumber()

        if(Elem_id('fname').value == '')
        {
          popupWarning("First name can't be empty!!");
          b.disabled = false;
          return false;
        }

        if(Elem_id('uname2').value=='')
        {
          popupWarning("Username can't be empty!!");
          b.disabled = false;
          return false;
        }
        if(Elem_id('uname2').value.length < 6){
            popupWarning("Username's length must be of 6 or more characters");
            b.disabled = false;
            return false;
        }
        if(Elem_id('pwd2').value.length<8)
        {
          popupWarning('Password must be 8 or more character long!!')
          b.disabled = false;
          return false;
        }

        if(mail == "not valid" || Elem_id('mail_in').value == '')
        {popupWarning('Email not valid');
          b.disabled = false;
             return false;}

        if(phno == "not valid")
        {popupWarning('Phone number not valid');
          b.disabled = false;
             return false;}
 
         fetch('/create',{
              method: "POST",
              headers:{"Content-Type" :"application/json"},
              body: JSON.stringify(account_set())
            }).then(response=>response.text()).then(data=>{
              if(data == "Success")
                { 
                  popupWarning('Account successfully Created!!!')
                  x[0].click();
                }

              else if(data == "uname exist")
                  popupWarning('Username already exists!!')
                  
              b.disabled = false;
            }).catch(error=>{
              popupWarning(error)
              b.disabled = false;
            });

    }
  

   function account_set(){
        var f_name = Elem_id('fname').value;
        var m_name = Elem_id('mname').value;
        var l_name = Elem_id('lname').value;
        var age  = Elem_id('age').value
        var uname  = Elem_id('uname2').value.toLowerCase();
        uname = uname.replaceAll(" ", "");
        var pwd = Elem_id('pwd2').value;
        var email  = Elem_id('mail_in').value;
        email = email.replaceAll(" ", "");
        var ctr_c = Elem_id('ctr_c').innerText;
        var ph_no = Elem_id('ph_no').value;
        
        jsn = {'first_name':f_name,'middle_name':m_name,'last_name':l_name, 'age': age, 'username': uname, 'password': pwd, 'email': email, 'country':ctr_c, 'phone':ph_no}
       
        return jsn;
    }

 
}


async function check_usrfp(user)
 {  
   
      var response = await fetch('/check_user',{
        method: "POST",
        headers:{"Content-Type" :"application/json"},
        body:JSON.stringify(user)
        });

      data = await response.text();
      return data
    
 }


function change_password(){
   
    var x = Elem_id('select-page').querySelectorAll('a');

    var uname = Elem_id('uname1');
     uname.value = Elem_id('uname').value;
    var o_pwd = Elem_id('pwd1');
    var n_pwd = Elem_id('n_pwd');
    var c_pwd = Elem_id('c_pwd');
    var s_warn = Elem_id('pwd-content').querySelectorAll('span');
    var b = Elem_id('pwd-content').querySelector('button');
    setTimeout(()=>{

        uname.oninput = async ()=>{
           
          if(uname.value.length < 6 )
          {
              s_warn[0].style.cssText='background-color: red';
          }
         else if(await check_usrfp(uname.value) == 'exist'){ 
            s_warn[0].style.cssText='background-color: green';
           }
          else{
           s_warn[0].style.cssText='background-color: red';
           }
        }
        uname.onblur = async()=>{
           
            if(uname.value.length < 6 )
            {
                popupWarning('Username must be 6 or more characters long !!')
            }
           else if(await check_usrfp(uname.value) == 'not exist'){ 
                popupWarning('Username not exist !!')
             }
          
          }
  

        n_pwd.oninput = ()=>{
            if(n_pwd.value.length<8)
                {
                  s_warn[1].style.cssText='background-color: red';
                }
            else if(o_pwd.value == n_pwd.value)
              s_warn[1].style.cssText='background-color: red';
                
            else {
                s_warn[1].style.cssText='background-color: green';
            }
            if(c_pwd.value!='' && n_pwd.value != c_pwd.value)
            {
                   s_warn[2].style.cssText = 'background-color: red';
            }
            else if(c_pwd.value!='' && n_pwd.value == c_pwd.value)
            {
                    s_warn[2].style.cssText = 'background-color: green';
            }
        }

        n_pwd.onblur = ()=>{
                if(n_pwd.value.length<8)
                    {
                      popupWarning('New Password must be 8 or more character long!!')
                    }
                    else if(n_pwd.value == o_pwd.value)
                    {
                        popupWarning("Password cannot be same as your old password!!")
                    }
        }

        c_pwd.oninput =()=>{
            if(c_pwd.value.length<8)
                  s_warn[2].style.cssText='background-color: red';

            else if(c_pwd.value == n_pwd.value)
                s_warn[2].style.cssText='background-color: green';

            else
               s_warn[2].style.cssText='background-color:red';
        
        }

        c_pwd.onblur =()=>{
             if(c_pwd.value != n_pwd.value)
            {  popupWarning("Password not Matching"); 
              s_warn[2].style.cssText='background-color:red'
            }

        }

        
      },1000)

   function account_set(){
     var jsn = {'username': uname.value, 'o_pwd': o_pwd.value, 'n_pwd': n_pwd.value, 'c_pwd':c_pwd.value} 
     console.log(jsn)
     return jsn
   }
 
   
   b.onclick = async ()=>{
 

    if(await check_usrfp(uname.value) == 'not exist'){ 
        popupWarning("Username not exists!!")
        s_warn[0].style.cssText='background-color:red'
        return false;
    }
    if(uname.value=='')
    {
      popupWarning("Username can't be empty!!");
      return false;
    }
    if(uname.value.length < 6){
        popupWarning("Username's length must be of 6 or more characters");
        return false;
    }
    if(Elem_id('pwd1').value.length<8)
    {
      popupWarning('Password must be 8 or more character long!!')
      return false;
    }


     fetch('/ch_pwd',{
          method: "POST",
          headers:{"Content-Type" :"application/json"},
          body: JSON.stringify(account_set())
        }).then(response=>response.text()).then(data=>{
            console.log(data);
          if(data == "Success")
            { 
              popupWarning('Password successfully Changed!!!');
              o_pwd.value = "";
              n_pwd.value = "";
              c_pwd.value = "";
              x[0].click();
            }
         else if(data == 'same as old')
              popupWarning("Password cannot be same as your old password!!");
         else if(data == "not exist")
              popupWarning('Username not exists!!');
         else if(data == "Incorrect!!")
              popupWarning('Old password Incorrect!!');

        }).catch(error=>popupWarning(error));
}

 

}


