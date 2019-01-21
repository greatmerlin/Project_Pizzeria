var type = getType();
var url = getURL();

function submitOrder(buttonItem){
    var helperAttribute = document.getElementById(buttonItem).id.substring(8, buttonItem.length);
    var nameToPost = "";
    var typeToPost = getType();
    if(typeToPost === "pizzas"){
        nameToPost = document.getElementById(helperAttribute).getElementsByClassName("itemName")[0].innerHTML;
        typeToPost = "pizza";
    }else if(typeToPost === "salads"){
        nameToPost = document.getElementById(helperAttribute).getElementsByClassName("itemName")[0].innerHTML;
        typeToPost = "salad";
    }else if(typeToPost === "softdrinks"){
        nameToPost = document.getElementById(helperAttribute).getElementsByClassName("itemName")[0].innerHTML;
        typeToPost = "softdrink";
    }
    jsonData = {
        id: parseInt(helperAttribute),
        type: typeToPost,
        name: nameToPost.toString()
    };
    post(url, typeToPost, helperAttribute);
}

function submitFeedback(helperAttribute){
    var d = new Date();
    var n = d.getTime();
    var userName = document.getElementById("name").value;
    var userEmail = document.getElementById("email").value;
    var userText = document.getElementById("text").value;
    jsonData = {
        id: parseInt(n),
        pizzaRating: getRadioValue("ratingTaste"),
        prizeRating: getRadioValue("ratingPrice"),
        name: userName,
        email: userEmail,
        feedback: userText
    };
    post(url, type, helperAttribute);
}

/* -------------- HELP FUNCTIONS ---------------------------------------------------------------------------------- */
function getType(){
    var page = location.pathname.split("/").slice(-1).toString();
    page = page.substring(0, page.length - 5);
    return page;
}

function getURL(){
    var baseurl = "https://tonyspizzafactory.herokuapp.com/api/";
    if(getType() === "feedback"){
        return baseurl + "feedback";
    }else{
        return baseurl + "orders";
    }
}

function getRadioValue(radioName){
    var el = document.getElementsByName(radioName);
    for(var i = 0; i < el.length; i++){
        if(el[i].checked){
            return el[i].value;
        }
    }
}

function post(url, type, helperAttribute){
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4"
        },
        body: JSON.stringify(jsonData)
    }).then(
        function(response){
            if(response.status > 202){
                console.log("Looks like there was a problem. Status Code: " + response.status + ": " + response.statusText);
                if(type !== "feedback"){
                    handleOrderError(helperAttribute);
                }else if(type === "feedback"){
                    handleFeedbackError(helperAttribute);
                }
            }else{
                if(type !== "feedback"){
                    handleOrder(helperAttribute);
                }else if(type === "feedback"){
                    handleFeedback(helperAttribute);
                }
            }
        }
    ).catch(function(error){
        console.log("Network error: ", error);
        if(type !== "feedback"){
            handleOrderError(helperAttribute);
        }else if(type === "feedback"){
            handleFeedbackError(helperAttribute);
        }
    });
}

function handleOrder(helperAttribute){
    var thankMessage = document.getElementById(helperAttribute).getElementsByClassName("overlayThanks invisible")[0];
    var counts = document.getElementById("timesOrdered" + helperAttribute).innerHTML;
    counts = parseInt(counts) + 1;
    document.getElementById("timesOrdered" + helperAttribute).innerHTML = counts;
    if(thankMessage){
        thankMessage.className = "overlayThanks";
    }
}

function handleFeedback(){
    var formFilled = document.getElementById("mainContainer");
    if(formFilled){
        formFilled.className = "invisible";
        document.getElementById("statisticContainer").className = "";
    }
}

function handleOrderError(helperAttribute){
    var errorMessage = document.getElementById(helperAttribute).getElementsByClassName("errorBox invisible")[0];
    if(errorMessage){
        errorMessage.className = "errorBox";
        goAway("thanks" + helperAttribute);
    }
}

function handleFeedbackError(){
    var errorMessage = document.getElementsByClassName("feedbackError invisible")[0];
    if(errorMessage){
        errorMessage.className = "feedbackError";
    }
}

function goAway(divToDisappear){
    var makeInvisible = document.getElementById(divToDisappear);
    if(makeInvisible.className){
        makeInvisible.className += " invisible";
    }
}

function goAwayOrderError(divToDisappear){
    goAway(divToDisappear);
    var byeDiv = document.getElementById("thanks" + divToDisappear.substring(4, divToDisappear.length));
    if(byeDiv.className === "overlayThanks"){
        byeDiv.className = "overlayThanks invisible";
    }
}
