var formName = "";
var formEmail = "";
var formText = "";
var submitBut = "";

function validateName(input){
    input.parentNode.querySelector("span").innerText = '"' + input.value + '"';
    if(!checkName()){
        showError(input);
    }else{
        hideError(input);
    }
}

function validateEmail(input){
    input.parentNode.querySelector("span").innerText = '"' + input.value + '"';
    if(!checkEmail()){
        showError(input);
    }else{
        hideError(input);
    }
}

function validateText(input){
    if(!checkText()){
        showError(input);
    }else{
        hideError(input);
    }
}

/* -------------- HELPER FUNCTIONS -------------- */
function checkAll(){
    submitBut.setAttribute("disabled", null);
    var nameIsValid = checkName();
    var emailIsValid = checkEmail();
    var textIsValid = checkText();
    if (!nameIsValid){
        return;
    }
    if(!emailIsValid){
        return;
    }
    if(!textIsValid){
        return;
    }
    if(nameIsValid && emailIsValid && textIsValid){
        submitBut.removeAttribute("disabled");
    }
}

function checkName(){
    formName.value = sanitize(formName.value);
    var pattern = /^[a-zA-Z\s]*$/;
    if(pattern.test(formName.value) && formName.value.length >= 2){
        return true;
    }
    return false;
}

function checkEmail(){
    formEmail.value = sanitize(formEmail.value);
    var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if(pattern.test(formEmail.value) && formEmail.value){
        return true;
    }
    return false;
}

function checkText(){
    formText.value = sanitize(formText.value);
    if(formText.value.length >= 50){
        return true;
    }
    return false;
}

function sanitize(value){
    return value.replace(/[&\/\\#,+()$~%'":*?<>=\[\]{}]/g, "");
}

function showError(input){
    input.style.border = "1px solid red";
    if(input.parentNode.querySelector("p").className === "inputError invisible"){
        input.parentNode.querySelector("p").className = "inputError";
    }
}
function hideError(input){
    input.style.border = "1px solid #ccc";
    if(input.parentNode.querySelector("p").className === "inputError"){
        input.parentNode.querySelector("p").className = "inputError invisible";
    }
}

/* -------------- LOAD PAGE -------------- */
window.addEventListener('load', function(){
    formName = document.getElementById("name");
    formEmail = document.getElementById("email");
    formText = document.getElementById("text");
    submitBut = document.getElementById("submitButton");
    formName.addEventListener('keyup', checkAll);
    formEmail.addEventListener('keyup', checkAll);
    formText.addEventListener('keyup', checkAll);
});