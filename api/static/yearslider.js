
        var s = document.getElementById("slider")
        var y = s.innerHTML;
        for(let i=2001;i<2013;i++)
          {
             if(i!=2012)
              {y = y+`<span><span onclick = 'checkbut(${i})'><span><input id= '${i}' type = 'radio' value=${i}></span><span>${i}</span></span></span>`;}
             else{
               y = y+`<span><span onclick = 'checkbut(${i})'><span><input id = '${i}' type = 'radio' value=${i} checked></span><span>${i}</span></span></span>`;
             }
          }
          s.innerHTML = y;
          var d=document.querySelectorAll('#slider > span')
         
          var y = s.querySelectorAll('input')
        

          var e1=2012,j,k;
          
          checkbut(2012)
         function checkbut(e){
           
            flag = 1
    
            y.forEach(input => {
               input.checked = false;
               d[input.value-2001].style.backgroundColor = "rgb(171, 171, 171)";
            })
            if(e<e1)
            { j = e;
              k=e1;}
            else{
              j = e1;
              k=e;
            }

         for(let i = j; i<=k;i++)
         { 
            document.getElementById(i).checked = true;
            if(i==k)
             break
            d[i-2001].style.backgroundColor = "rgb(58, 170, 190)";
         }
          
            y.forEach(input => {
               if(flag==1)
               if(input.value == e && e1 != e)
               { 
                  e1 = e
                  flag = 0
                }
            
          });
 
         
         }   
        
