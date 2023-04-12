/*-------------------------
stacking page js
-------------------------*/
function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("stake-tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("stake-tab-links");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

/*-------------------------
stacking 4 page js
-------------------------*/
// Add active class to the current button (highlight it)
// var header = document.getElementById("staking_preiod_btn");
// var btns = header.getElementsByClassName("StakeTablinks");
// for (var i = 0; i < btns.length; i++) {
//     btns[i].addEventListener("click", function() {
//         var current = document.getElementsByClassName("active");
//         if (current.length > 0) {
//             current[0].className = current[0].className.replace(" active", "");
//         }
//         this.className += " active";
//     });
// }