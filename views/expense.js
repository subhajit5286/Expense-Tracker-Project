var form=document.getElementById('addForm');
var welcome = document.getElementById('welcome');

 


form.addEventListener('submit', saveExpense);//


function saveExpense(event){
    event.preventDefault();
    const amount = event.target.amount.value;
    const description= event.target.description.value;
    const category = event.target.category.value;
    const userId=1
    const obj = {
        amount,
        description,
        category,
        userId

    }
    const token = localStorage.getItem('token');
    axios.post("http://localhost:4000/expense/add-expense",obj, {headers: {"Authorization": token}})
       .then((response) => {
        showNewExpenseOnScreen(response.data.newExpense);
           console.log(response);
       })
       .catch((error) => {
        document.body.innerHTML =
          document.body.innerHTML + "<h4>Something went worng";
        console.log(error);
       })

}

window.addEventListener("DOMContentLoaded",() => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:4000/expense/get-expenses",{ headers: {"Authorization": token}})
       .then((response) => {
          console.log(response.data.allExpenses,response.data.name);
          const welcome = document.getElementById("welcome");
          //console.log(welcome)
         const childHtml = 
         `<h1 style="color: red;font-family: sans-serif;margin-left: 45.5rem;" id="welcome">Welcome ${response.data.name} </h1>`
         welcome.innerHTML =welcome.innerHTML+childHtml;
        //   response.data.expenses.forEach(expense => {
        //     showNewExpenseOnScreen(expense);
        //   })
           for(var i=0; i<response.data.allExpenses.length; i++){
              showNewExpenseOnScreen(response.data.allExpenses[i]);
           }


       }).catch((error) => {
            console.log(error);
       });
});

function showNewExpenseOnScreen(expense) {
    const parentNode = document.getElementById("items");
    const childHTML = `<li class="list-group-item" style="display:inline-block;" id=${expense.id}>
                        <div class="row" >
                            <div class="col-sm-3" style="text-align:center;font-family: Trebuchet MS;font-size: 20px;">
                            <span >${expense.amount}</span>
                            </div>
                            <div class="col-sm-3" style="text-align:center;font-family: Trebuchet MS;font-size: 20px;">
                            <span>${expense.description}</span>
                            </div>
                            <div class="col-sm-3" style="text-align:center;font-family: Trebuchet MS;font-size: 20px;">
                            <span>${expense.category}</span>
                            </div>
                            <div class="col-sm-3" style="text-align:center;font-family: Trebuchet MS;font-size: 20px;margin-right:0rem">
                            <span>
                                 <button class="btn btn-danger" onclick=deleteExpense('${expense.id}')>Delete</button>
                            </span>
                            </div>
                        </div>        
                    </li>`;
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function deleteExpense(expenseid) {
    console.log(expenseid);
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:4000/expense/delete-expense/${expenseid}`,{headers:{"Authorization":token}})
        .then((response) => {
           removeExpenseFromScreen(expenseid);
        })
        .catch((err) => console.log(err));
}

function removeExpenseFromScreen(expenseid) {

    const parentNode = document.getElementById("items");
    const childNodeToBeDeleted = document.getElementById(expenseid);
    if (childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted);
    }
}

