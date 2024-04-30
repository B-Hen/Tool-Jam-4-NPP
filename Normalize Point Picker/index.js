window.onload = function(){
    let input = document.querySelector("#fileInput");
    let output = document.querySelector("#fileOutput");
    let outputHolder = document.querySelector("#output-holder")

    const orignalWidth = outputHolder.getBoundingClientRect().width;
    const orignalHeight = outputHolder.getBoundingClientRect().height;

    let xPosition = document.querySelector("#x-position");
    let yPosition = document.querySelector("#y-position");

    let xNormalizedPosition = document.querySelector("#x-normalizedPosition");
    let yNormalizedPosition = document.querySelector("#y-normalizedPosition");

    let dropDown = document.querySelector("#origins");

    input.addEventListener("change", function(e){
        output.src = URL.createObjectURL(e.target.files[0]);

        output.onload = function()
        {
           let parentWidth = orignalWidth;
           let parentHeight = orignalHeight;

           let aspectRatio = output.naturalWidth / output.naturalHeight;

           let newWidth = parentWidth;
           let newHeight = parentWidth / aspectRatio;

           if(newHeight > parentHeight){
            newHeight = parentHeight;
            newWidth = parentHeight * aspectRatio;
           }

           output.style.width = newWidth + "px";
           output.style.height = newHeight + "px";

           outputHolder.style.height = newHeight + "px";
        }
    })

    output.addEventListener("click", function(e){
        let rect = output.getBoundingClientRect();

        SetCoordinateUsingTopLeftOrigins(e.clientX, e.clientY, rect);
    })

    function SetCoordinateUsingTopLeftOrigins(x,y, rect){
        let xPos = GetRoundedNumber(x - rect.left);
        let yPos = GetRoundedNumber(y - rect.top);

        let xNormPos = GetRoundedNumber((x - rect.left) / rect.width);
        let yNormPos = GetRoundedNumber((y - rect.top) / rect.height);

        SetTextElements(xPos, yPos, xNormPos, yNormPos);
    }

    function GetRoundedNumber(num)
    {
        return Math.round(((num) + Number.EPSILON) * 100) / 100;
    }

    function SetTextElements(x, y, xNormalized, yNormalized){
        xPosition.innerHTML = "X: " + x;
        yPosition.innerHTML = "Y: " + y;
        xNormalizedPosition.innerHTML = "X Normalized: " + xNormalized;
        yNormalizedPosition.innerHTML = "Y Normalized: " + yNormalized;
    }
};

