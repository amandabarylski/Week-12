/*Coding Steps:

    Create a CRD application (CRUD without update) using json-server or another API
    Use fetch and async/await to interact with the API
    Use a form to create/post new entities
    Build a way for users to delete entities
    Include a way to get entities from the API and display them
    You do NOT need update, but you can add it if you'd like
    Use Bootstrap and/or CSS to style your project */

/*After a brainstorming session, I decided I wanted to create a "commission board"
where users could post, edit, and delete commissions. I am considering a toggle function
to switch between "available" and "taken" states, but that will be the last thing I work
on if I decide to do it at all.
The commissions themselves will include a title, risk rating, and description.
The title and description will be text inputs, and risk rating will be a dropdown menu.
As I will be using json-server I will create a few to display when the page is first opened.*/

/*Coming back to this after working with the HTML and CSS, I have decided to adjust my plan.
With how complicated I made the commissions, editing them would be difficult. I would likely
have to place edit options for each section seperately. However, toggling them between two states
would be more feasible, so I adjusted my buttons accordingly.
Both the delete and toggle buttons required more time than I expected, so I won't add an edit function.*/

const baseURL = 'http://localhost:3000'

//After making the render function, I went back to make the fetch function.
const fetchCommissions = async () => {
    //Since I needed to use .json(), I tied my fetch request to a variable and used await.
    //I also used await on response.json() so that it would return only when it had the data.
    const response = await fetch(`${baseURL}/commissions`)
    const data = await response.json()
    return data
}

//The render has to be an async function so that it can await the fetch request.
const render = async () => {

    const commissions = await fetchCommissions()

    //Before I could render the board, I first have to empty it.
    $('#commission-board').empty()

    //The ForEach method allows me to cycle through each commission to create a card for it.
    //I used template literals combined with ternary operations to react to whether the commission was taken or not.
    commissions.forEach(function (commission) {
        let commissionPost = `<div class="col">
        <div class="card h-100">
            <div class="card-header ${commission.taken ? "taken" : ""}">
                <h3>${commission.title}</h3>
            </div>
            <div class="card-body">
                <h5 class="card-title ${commission.taken ? "taken" : ""}">Risk Rating: <strong>${commission.risk}</strong></h4>
                <p class="card-text ${commission.taken ? "taken" : ""}">${commission.description}</p>
                <div class="row">
                    <button type="button" class="btn ${commission.taken ? "btn-secondary" : "btn-success"} toggleCommission col-auto mx-auto" data-index="${commission.id}">
                    ${commission.taken ? "Taken" : "Available"}</button>
                    <button type="button" class="btn btn-danger deleteCommission col-auto mx-auto" data-index="${commission.id}">Delete</button>
                </div>
            </div>
        </div>
    </div>`

    $('#commission-board').append(commissionPost)
    //Nothing appeared when I tried this. The console.log confirms that it's creating the commissionPost for each,
    //and correctly creating the HTML that I want. So there's something wrong with appending it.
    //Solved: in the HTML spelled the id "commssion-board" by accident, fixed the spelling error and it worked perfectly.
    //Commenting out the console.log since testing on this part is complete for now.
    // console.log(commissionPost)
    });
}

//I call the render function here to make the commission board render when the page first loads.
render()

//Of the three pieces of functionality, I decided to start with add as that felt like the most important.
//It would also allow me to leave what's currently in my db.json file alone when testing the delete function.
$('#add-commission').on('click', async () => {
    //I started with an if statement to check that the user had entered a title and description.
    if ($('#title').val() == '') {
        return alert('Please enter a title for your commission!')
    } else if ($('#description').val() == '') {
        return alert('Please give a short description of your commission!')
    } else {
        //The user's inputs create most of the new commission. I set "taken" to false by default.
        //As I don't specify an id here, it is generated automatically.
        const newCommission = { title: $('#title').val(), risk: $('#risk-rating').val(), description: $('#description').val(), taken: false}
        const response = await fetch(`${baseURL}/commissions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCommission)
        })
        //I don't need another variable as I'm rendering after using the json() method on the response.
        //Since the information is already added to the API, I don't need to return it.
        await response.json()
        render()
        //My first attempt to reset the inputs failed. I forgot that I needed to put the new values in the parentheses,
        //instead of after an equal sign, when using jquery.
        $('#title').val('')
        $('#risk-rating').val(1)
        $('#description').val('')
    }
})

//Our instructor showed us how to attach event listeners to created HTML elements, so I used what he did as a starting point.
//I had to start the event listener with the document, using the class for my delete buttons as a second paramater to tie it to them.
    //On researching, I realized that to tie this click to the commission the button was attached to,
    //I would need to use data indexing.
    //Our instructor had used this but as I had not researched it I didn't know his reasoning at the time.
    //While there may be other ways, adding a data-index to my created buttons seemed the most straightforward method.
    //I then had to use the .data() method to use it to find the correct commission in the API.
    //While our instructor used it to create a variable that he then called in both the fetch and a console.log,
    //I decided to plug it in directly to the fetch request using a template literal.
    //However, it resulted in an error, with the id being undefined.
    //After changing my single quotes in the event handler to double quotes, and changing the arrow function to a regular function,
    //it worked without an issue the way my instructor had shown it.
    //I then tried again without going through a variable, and this time it worked as I had initially tried it.
$(document).on("click", ".deleteCommission", async function () {
    // const id = $(this).data("index")
    // console.log(id)
    await fetch(`${baseURL}/commissions/${$(this).data("index")}`, {
        method: "DELETE",
    })
    //After deleting the commission, I wanted to re-render the page without it, so I called my render function.
    render()
})

//The toggle method uses PUT.
//As the styling is based on the "taken" property in the commission objects, I could alter that property using a ternary operation.
//I then had to use .stringify() to convert it into JSON format.
//I started by using the same syntax as I did to add the click event and start the fetch request.

$(document).on("click", ".toggleCommission", async function () {

    //Trying with the ternary here made all the text change to undefined.
    //It had removed all other properties besides taken and id.
    //I also saw there was an easier way to toggle a Boolean.
    //My instructor had used spread, so I gave it a try so I would only access the property I wanted to change.
    //Now I get an error that commission is undefined.
    //I went back to my instructor's example and saw that he'd fetched the object separately with another created function.
    //As I was now needing the this.data section in multiple places, I put it in a variable to use.
    //Having the commission in this function defined it and allowed the toggle to work as intended.
    const id = $(this).data("index")
    const commission = await fetchCommission(id)
    
    await fetch(`${baseURL}/commissions/${id}`, {
        method: "PUT",
        headers:  { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commission, taken: !commission.taken }),
    })

    //As always, I then re-render the commissions to show the changes.
    render()
})

//I followed what my instructor did, fetching the commission based on its id and returning its data after using the json() method.
const fetchCommission = async (id) => {

    const response = await fetch(`${baseURL}/commissions/${id}`)

    const data = await response.json()

    return data
}