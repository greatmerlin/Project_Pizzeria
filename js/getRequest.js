var type = getType();
var url = getURL();


get(url).then(function(){
    console.log(url + " has been successfully loaded.");
}, function(error){
    console.log("Failed to fetch " + url + ": " + error);
});

/* -------------- HELP FUNCTION -------------- */
function getType(){
    var page = location.pathname.split("/").slice(-1).toString();
    page = page.substring(0, page.length -5);
    return page;
}

function getURL(){
    var baseurl = "https://tonyspizzafactory.herokuapp.com/api/";
    return baseurl + getType();
}

function createPizza(item, id, imageUrl, name, prize){
    var ingredients = item.ingredients.join(', ').toString();
    return '<div class="itemBox" id=' + id + '>' +
        '<div class="itemImage"><img src=' + imageUrl + ' alt="image of tasty pizza"></div>' +
        '<div class="itemDescriptionBox"></div>' +
        '<div class="itemName">' + name + '</div>' +
        '<div class="itemPrice">' + prize + '<button class="shoppingCart" id=' + 'buttonId' + id + ' onclick="submitOrder(this.id)"><i class="fa fa-shopping-cart"></i></button></div>' +
        '<div class="itemContent">' + ingredients + '</div>' +
        '<div class="overlayThanks invisible" id=thanks' + id + ' onclick="goAway(this.id)">Nice choice! (<span id=timesOrdered' + id + '>0</span>x)</div>' +
        '<div class="errorBox invisible" id=oops' + id +' onclick="goAwayOrderError(this.id)">Sorry, it&apos;s not available!</div>' +
        '</div>';
}

function createSalad(item, id, imageUrl, name, prize){
    var ingredients = item.ingredients.join(', ').toString();
    return '<div class="itemBox" id=' + id + '>' +
        '<div class="itemImage"><img src=' + imageUrl + ' alt="image of tasty salad"></div>' +
        '<div class="itemDescriptionBox"><div class="itemName">' + name + '</div>' +
        '<div class="itemContent"><span>' + ingredients + '</span></div>' +
        '<div class="selectAddition"><select name="dressing"><option value="house">House dressing</option><option value="italian">Italian dressing</option><option value="french">French dressing</option></select></div>' +
        '<div class="itemPrice"><span>' + prize + '</span><button class="shoppingCart" id=' + 'buttonId' + id + ' onclick="submitOrder(this.id)"><i class="fa fa-shopping-cart"></i></button></div>' +
        '</div>' +
        '<div class="overlayThanks invisible" id=thanks' + id + ' onclick="goAway(this.id)">Nice choise! (<span id=timesOrdered' + id + '>0</span>x)</div>' +
        '<div class="errorBox invisible" id=oops' + id +' onclick="goAwayOrderError(this.id)">Sorry, it&apos;s not available!</div>' +
        '</div>';
}

function createDrinks(item, id, imageUrl, name, prize){

    var volume = item.volume.toString();
    return '<div class="itemBox" id=' + id + '>' +
        '<div class="itemImage"><img src=' + imageUrl + ' alt="image of tasty drink"></div>' +
        '<div class="itemDescriptionBox"><div class="itemName">' + name + '</div>' +
        '<div class="selectAddition">' + volume + '</div>' +
        '<div class="itemPrice"><span>' + prize + '</span><button class="shoppingCart" id=' + 'buttonId' + id + ' onclick="submitOrder(this.id)"><i class="fa fa-shopping-cart"></i></button></div>' +
        '</div>' +
        '<div class="overlayThanks invisible" id=thanks' + id + ' onclick="goAway(this.id)">Nice choise! (<span id=timesOrdered' + id + '>0</span>x)</div>' +
        '<div class="errorBox invisible" id=oops' + id +' onclick="goAwayOrderError(this.id)">Sorry, it&apos;s not available!</div>' +
        '</div>';
}

function buildChart(json){
    var countAwesome = 0;
    var countGood = 0;
    var countOkay = 0;
    var countPoor = 0;
    for(var i = 0; i < json.length; i++){
        var item = json[i];
        var rating = sanitize(item.pizzaRating);
        if(rating === "awesome"){
            countAwesome += 1;
        }
        if(rating === "good"){
            countGood += 1;
        }
        if(rating === "okay"){
            countOkay += 1;
        }
        if(rating === "poor"){
            countPoor += 1;
        }
    }
    var data = [{"label": "awesome", "value": countAwesome},
        {"label": "good", "value": countGood},
        {"label": "okay", "value": countOkay},
        {"label": "poor", "value": countPoor}];

    document.getElementById("pieContainer0").innerHTML = "<div id=chartContainer0></div>";
    var svg0 = dimple.newSvg("#chartContainer0", 590, 400);
    var largeChart = new dimple.chart(svg0, data);
    largeChart.setBounds(20, 20, 460, 360);
    largeChart.addLegend(400, 30, 120, 300, "right");
    largeChart.addMeasureAxis("p", "value");
    largeChart.addSeries("label", dimple.plot.pie);
    largeChart.draw();

    document.getElementById("pieContainer1").innerHTML = "<div id=chartContainer1></div>";
    var svg1 = dimple.newSvg("#chartContainer1", 400, 230);
    var mediumChart = new dimple.chart(svg1, data);
    mediumChart.setBounds(20, 20, 300, 200);
    mediumChart.addLegend(300, 30, 60, 200, "right");
    mediumChart.addMeasureAxis("p", "value");
    mediumChart.addSeries("label", dimple.plot.pie);
    mediumChart.draw();

    document.getElementById("pieContainer2").innerHTML = "<div id=chartContainer2></div>";
    var svg2 = dimple.newSvg("#chartContainer2", 300, 180);
    var smallChart = new dimple.chart(svg2, data);
    smallChart.setBounds(20, 20, 200, 150);
    smallChart.addLegend(250, 30, 50, 200, "right");
    smallChart.addMeasureAxis("p", "value");
    smallChart.addSeries("label", dimple.plot.pie);
    smallChart.draw();
}

function get(url){
    return new Promise(function(succeed, fail){
        var xhr = new XMLHttpRequest(), json;
        xhr.open("GET", url, true);
        var status = "";
        var statusText = "";
        xhr.addEventListener("load", function(){
            status = xhr.status;
            statusText = xhr.statusText;
            if(status < 203){
                json = JSON.parse(xhr.responseText);
                var listContainer = document.querySelector("#itemLayer");
                var resultString = "";
                for (var i = 0; i < json.length; i++){
                    var item = json[i];
                    if(type !== "feedback"){
                        var id = item.id.toString();
                        var imageUrl = item.imageUrl.toString();
                        var name = item.name.toString();
                        var prize = item.prize.toString();
                        if(type === "pizzas"){
                            resultString += createPizza(item, id, imageUrl, name, prize);
                        }else if(type === "salads"){
                            resultString += createSalad(item, id, imageUrl, name, prize);
                        }else if(type === "softdrinks"){
                            resultString += createDrinks(item, id, imageUrl, name, prize);
                        }
                    }
                }
                if(type !== "feedback"){
                    listContainer.innerHTML = resultString;
                }else{
                    buildChart(json);
                }
            }else{
                fail(new Error("Looks like there was a problem. Status Code: " + status + ": " + statusText));
                handleStatusError(status, statusText);
            }
        });
        xhr.addEventListener("error", function(){
            fail(new Error("Network error"));
            handleNetworkError();
        });
        xhr.setRequestHeader("Authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MQ.bYceSpllpyYQixgNzDt7dpCkEojdv3NKD-85XLXfdI4");
        xhr.send(null);
    });
}

function handleStatusError(status, statusText){
    var errorTitle = "<div class='errorTitle'>ERROR " + status + ": " + statusText + "</div>";
    var errorText = "<div class='errorText'>Hello! This just went wrong. Please have a little bit of patience or contact the administrator.</div>";
    document.getElementById("mainBox").innerHTML = errorTitle + errorText;
}

function handleNetworkError(){
    var errorTitle = "<div class='errorTitle'>Oops!</div>";
    var errorText = "<div class='errorText'>You&apos;re offline !!!!!.</div>";
    document.getElementById("mainBox").innerHTML = errorTitle + errorText;
}



